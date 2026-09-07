import { IOutboxStore, OutboxRecord } from './outbox.interface';
import { defaultOutboxStore } from './memory-outbox.store';
import { DomainEvent, IEventBus } from '../event-bus.interface';
import { defaultEventBus } from '../memory-event-bus';
import { IDistributedLockProvider } from '../../concurrency/interfaces/distributed-lock.interface';
import { defaultLockProvider } from '../../concurrency/providers/memory-lock.provider';
import { logger } from '../../logger';

export interface OutboxPollerOptions {
  intervalMs?: number;
  batchSize?: number;
  lockTtlMs?: number;
}

/**
 * Low-Level Design (LLD): Transactional Outbox Poller
 * Periodically polls the outbox store and relays events to the EventBus.
 * Uses Distributed Mutex Lock to ensure single-leader execution across multi-process clusters.
 */
export class OutboxPoller {
  private isRunning = false;
  private timer: NodeJS.Timeout | null = null;
  private readonly store: IOutboxStore;
  private readonly eventBus: IEventBus;
  private readonly lockProvider: IDistributedLockProvider;
  private readonly options: Required<OutboxPollerOptions>;

  constructor(
    store: IOutboxStore = defaultOutboxStore,
    eventBus: IEventBus = defaultEventBus,
    lockProvider: IDistributedLockProvider = defaultLockProvider,
    options: OutboxPollerOptions = {}
  ) {
    this.store = store;
    this.eventBus = eventBus;
    this.lockProvider = lockProvider;
    this.options = {
      intervalMs: options.intervalMs || 1000,
      batchSize: options.batchSize || 50,
      lockTtlMs: options.lockTtlMs || 5000,
    };
  }

  public async pollAndDispatch(): Promise<number> {
    const lockKey = 'lock:outbox:poller';

    // 1. Single-Leader Election: Only 1 cluster node executes the poller tick
    const lockToken = await this.lockProvider.acquire(lockKey, {
      ttlMs: this.options.lockTtlMs,
      timeoutMs: 100, // fast fail if another node already holds leader lock
    });

    if (!lockToken) {
      return 0; // Another cluster worker is actively polling
    }

    try {
      // 2. Fetch pending outbox records
      const pendingRecords = await this.store.fetchPending(this.options.batchSize);
      if (pendingRecords.length === 0) {
        return 0;
      }

      // TASK: [Telemetry Integration] Record outbox_pending_batch_size metric (Component 10)
      logger.debug({ count: pendingRecords.length }, 'OutboxPoller: Relaying pending outbox events');

      const publishedIds: string[] = [];

      for (const record of pendingRecords) {
        try {
          const domainEvent: DomainEvent = {
            id: record.id,
            eventName: record.eventName,
            aggregateId: record.aggregateId,
            payload: record.payload,
            version: record.version,
            occurredOn: record.createdAt,
            metadata: record.metadata,
          };

          // 3. Publish to EventBus
          await this.eventBus.publish(domainEvent);
          publishedIds.push(record.id);
        } catch (err: any) {
          logger.error(
            { recordId: record.id, eventName: record.eventName, error: err?.message },
            'OutboxPoller: Failed to dispatch outbox event'
          );
          await this.store.markFailed(record.id, err?.message || 'Dispatch failed');
        }
      }

      // 4. Mark successfully published records
      if (publishedIds.length > 0) {
        await this.store.markPublished(publishedIds);
      }

      return publishedIds.length;
    } finally {
      await this.lockProvider.release(lockToken);
    }
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;

    // TASK: [Lifecycle Integration] Register OutboxPoller.stop() in GracefulShutdownManager (Component 11)
    logger.info({ intervalMs: this.options.intervalMs }, 'OutboxPoller: Started outbox polling engine');

    const tick = async () => {
      if (!this.isRunning) return;
      try {
        await this.pollAndDispatch();
      } catch (err) {
        logger.error({ error: err }, 'OutboxPoller: Uncaught error during polling loop');
      } finally {
        if (this.isRunning) {
          this.timer = setTimeout(tick, this.options.intervalMs);
        }
      }
    };

    this.timer = setTimeout(tick, this.options.intervalMs);
  }

  public stop(): void {
    this.isRunning = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    logger.info('OutboxPoller: Stopped outbox polling engine');
  }
}

export const defaultOutboxPoller = new OutboxPoller();
