import { 
  BulkheadOptions, 
  BulkheadMetrics, 
  IBulkhead, 
  BulkheadFullError, 
  BulkheadTimeoutError 
} from './bulkhead.interface';
import { logger } from '../../logger';

interface QueuedExecution {
  run: () => void;
  reject: (reason: any) => void;
  timer?: NodeJS.Timeout;
}

const DEFAULT_BULKHEAD_OPTIONS: BulkheadOptions = {
  maxConcurrent: 10,
  maxQueue: 20,
  maxWaitTimeMs: 5000,
};

/**
 * Low-Level Design (LLD): Production Bulkhead Semaphore & Bounded Wait-Queue
 * Prevents downstream slow endpoints from cascading and saturating node resources.
 */
export class Bulkhead implements IBulkhead {
  public readonly name: string;
  private readonly options: BulkheadOptions;

  private activeExecutions = 0;
  private queue: QueuedExecution[] = [];
  private totalAccepted = 0;
  private totalRejected = 0;

  constructor(name: string, options?: Partial<BulkheadOptions>) {
    this.name = name;
    this.options = { ...DEFAULT_BULKHEAD_OPTIONS, ...options };
  }

  public async execute<T>(action: () => Promise<T>): Promise<T> {
    if (this.activeExecutions < this.options.maxConcurrent) {
      return this.runDirect(action);
    }

    if (this.queue.length >= this.options.maxQueue) {
      this.totalRejected++;
      // TASK: [Telemetry Integration] Increment Prometheus bulkhead_rejected_total counter
      logger.warn(
        { bulkhead: this.name, active: this.activeExecutions, queue: this.queue.length },
        'Bulkhead: Queue full. Rejecting call.'
      );
      throw new BulkheadFullError(`Bulkhead [${this.name}] queue is full (${this.options.maxQueue} max).`);
    }

    return this.enqueue(action);
  }

  private async runDirect<T>(action: () => Promise<T>): Promise<T> {
    this.activeExecutions++;
    this.totalAccepted++;

    try {
      return await action();
    } finally {
      this.activeExecutions--;
      this.pumpQueue();
    }
  }

  private enqueue<T>(action: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      let waitTimer: NodeJS.Timeout | undefined;

      if (this.options.maxWaitTimeMs && this.options.maxWaitTimeMs > 0) {
        waitTimer = setTimeout(() => {
          const index = this.queue.findIndex((item) => item.timer === waitTimer);
          if (index !== -1) {
            this.queue.splice(index, 1);
            this.totalRejected++;
            logger.warn({ bulkhead: this.name }, 'Bulkhead: Queue wait timeout exceeded');
            reject(new BulkheadTimeoutError(`Bulkhead [${this.name}] queue wait exceeded ${this.options.maxWaitTimeMs}ms.`));
          }
        }, this.options.maxWaitTimeMs);
      }

      const item: QueuedExecution = {
        run: async () => {
          if (waitTimer) clearTimeout(waitTimer);
          try {
            const res = await this.runDirect(action);
            resolve(res);
          } catch (err) {
            reject(err);
          }
        },
        reject,
        timer: waitTimer,
      };

      this.queue.push(item);
    });
  }

  private pumpQueue(): void {
    if (this.activeExecutions < this.options.maxConcurrent && this.queue.length > 0) {
      const next = this.queue.shift();
      if (next) {
        next.run();
      }
    }
  }

  public getMetrics(): BulkheadMetrics {
    return {
      activeExecutions: this.activeExecutions,
      queuedCount: this.queue.length,
      totalAccepted: this.totalAccepted,
      totalRejected: this.totalRejected,
      maxConcurrent: this.options.maxConcurrent,
      maxQueue: this.options.maxQueue,
    };
  }

  public clearQueue(): void {
    // TASK: [Lifecycle Integration] Register clearQueue() in GracefulShutdownManager (Component 11) to drain pending promises on SIGTERM
    while (this.queue.length > 0) {
      const item = this.queue.shift();
      if (item) {
        if (item.timer) clearTimeout(item.timer);
        item.reject(new BulkheadFullError('Bulkhead queue cleared.'));
      }
    }
  }
}

// Bulkhead Registry
const bulkheads = new Map<string, Bulkhead>();

export function getBulkhead(name: string, options?: Partial<BulkheadOptions>): Bulkhead {
  if (!bulkheads.has(name)) {
    bulkheads.set(name, new Bulkhead(name, options));
  }
  return bulkheads.get(name)!;
}
