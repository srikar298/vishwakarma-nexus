import { describe, it, expect, beforeEach } from 'vitest';
import { 
  InMemoryEventBus, 
  EventDeadLetterQueue, 
  MemoryOutboxStore, 
  OutboxPoller, 
  CacheInvalidationBridge, 
  DomainEvent 
} from './index';
import { MemoryLockProvider } from '../concurrency/providers/memory-lock.provider';
import { MemoryCacheProvider } from '../cache/providers/memory-cache.provider';

describe('Event-Driven Architecture Subsystem: Production Audit Test Suite', () => {
  describe('InMemoryEventBus & DLQ Routing', () => {
    let bus: InMemoryEventBus;
    let dlq: EventDeadLetterQueue;

    beforeEach(() => {
      dlq = new EventDeadLetterQueue();
      bus = new InMemoryEventBus(dlq);
    });

    it('publishes and delivers domain events to subscribers', async () => {
      const received: DomainEvent[] = [];

      bus.subscribe('member.registered', async (evt) => {
        received.push(evt);
      });

      const event: DomainEvent = {
        id: 'evt_1',
        eventName: 'member.registered',
        aggregateId: 'mem_101',
        occurredOn: new Date(),
        payload: { fullName: 'Suresh V' },
      };

      await bus.publish(event);
      expect(received.length).toBe(1);
      expect(received[0].id).toBe('evt_1');
      expect(received[0].payload.fullName).toBe('Suresh V');
    });

    it('retries failing handlers and routes poison events to DLQ', async () => {
      let attempts = 0;

      bus.subscribe('order.failed', async () => {
        attempts++;
        throw new Error('Downstream email gateway timeout');
      }, { retryAttempts: 2, enableDlq: true });

      const event: DomainEvent = {
        id: 'evt_poison',
        eventName: 'order.failed',
        aggregateId: 'ord_99',
        occurredOn: new Date(),
        payload: { amount: 500 },
      };

      await bus.publish(event);

      expect(attempts).toBe(3); // Initial try + 2 retries
      expect(dlq.size()).toBe(1);

      const deadLetter = dlq.getAll()[0];
      expect(deadLetter.event.id).toBe('evt_poison');
      expect(deadLetter.error).toContain('Downstream email gateway timeout');
    });

    it('replays dead letters successfully', async () => {
      let successfulDelivery = false;

      const event: DomainEvent = {
        id: 'evt_replay',
        eventName: 'invoice.generated',
        aggregateId: 'inv_1',
        occurredOn: new Date(),
        payload: { total: 1000 },
      };

      await dlq.push(event, 'InvoiceHandler', 'Simulated error', 3);
      expect(dlq.size()).toBe(1);

      // Register working subscriber
      bus.subscribe('invoice.generated', async (evt) => {
        if (evt.id === 'evt_replay') {
          successfulDelivery = true;
        }
      });

      const dlqId = dlq.getAll()[0].id;
      const replayed = await dlq.replay(dlqId, bus);

      expect(replayed).toBe(true);
      expect(successfulDelivery).toBe(true);
      expect(dlq.size()).toBe(0); // Cleared after successful replay
    });
  });

  describe('Transactional Outbox Pattern & OutboxPoller', () => {
    let outboxStore: MemoryOutboxStore;
    let eventBus: InMemoryEventBus;
    let lockProvider: MemoryLockProvider;
    let poller: OutboxPoller;

    beforeEach(() => {
      outboxStore = new MemoryOutboxStore();
      eventBus = new InMemoryEventBus();
      lockProvider = new MemoryLockProvider();
      poller = new OutboxPoller(outboxStore, eventBus, lockProvider, { intervalMs: 50 });
    });

    it('persists event in outbox store and poller relays to EventBus', async () => {
      const delivered: DomainEvent[] = [];
      eventBus.subscribe('payment.captured', async (evt) => {
        delivered.push(evt);
      });

      const event: DomainEvent = {
        id: 'evt_outbox_1',
        eventName: 'payment.captured',
        aggregateId: 'txn_555',
        occurredOn: new Date(),
        payload: { amountPaise: 50000 },
      };

      // 1. Save to outbox store
      await outboxStore.save(event);
      expect(await outboxStore.fetchPending()).toHaveLength(1);

      // 2. Run poller dispatch
      const dispatchedCount = await poller.pollAndDispatch();

      expect(dispatchedCount).toBe(1);
      expect(delivered.length).toBe(1);
      expect(delivered[0].aggregateId).toBe('txn_555');

      // 3. Outbox record is now marked as PUBLISHED
      expect(await outboxStore.fetchPending()).toHaveLength(0);
    });

    it('distributed lock prevents dual-polling by multiple cluster workers', async () => {
      // Worker 1 holds the poller lock
      const lock1 = await lockProvider.acquire('lock:outbox:poller', { ttlMs: 2000 });
      expect(lock1).toBeDefined();

      // Worker 2 attempts poller tick while Worker 1 holds lock
      const dispatched = await poller.pollAndDispatch();
      expect(dispatched).toBe(0); // Throttled / skipped cleanly

      if (lock1) await lockProvider.release(lock1);
    });
  });

  describe('CacheInvalidationBridge (Event-Driven Cache Eviction)', () => {
    it('automatically invalidates cache tags when domain events fire', async () => {
      const eventBus = new InMemoryEventBus();
      const cache = new MemoryCacheProvider();
      const bridge = new CacheInvalidationBridge(eventBus, cache);

      // Register rule: member.updated -> invalidate tag 'member:<id>'
      bridge.registerRule('member.updated', (event) => `member:${event.aggregateId}`);

      // Populate cache with tagged entries
      await cache.set('member:101:card', { name: 'Arjun' }, { tags: ['member:101'] });
      await cache.set('member:102:card', { name: 'Bhanu' }, { tags: ['member:102'] });

      expect(await cache.get('member:101:card')).toBeDefined();
      expect(await cache.get('member:102:card')).toBeDefined();

      // Publish domain event
      await eventBus.publish({
        id: 'evt_upd_1',
        eventName: 'member.updated',
        aggregateId: '101',
        occurredOn: new Date(),
        payload: { name: 'Arjun Chary' },
      });

      // member 101 cache tag is automatically invalidated
      expect(await cache.get('member:101:card')).toBeNull();
      // member 102 cache remains untouched
      expect(await cache.get('member:102:card')).toBeDefined();
    });
  });
});
