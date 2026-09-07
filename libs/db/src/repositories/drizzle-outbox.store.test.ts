import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DrizzleOutboxStore } from './drizzle-outbox.store';
import { DomainEvent } from '@vishwakarma-k-c/shared';

describe('DrizzleOutboxStore Unit Tests', () => {
  let mockDb: any;
  let outboxStore: DrizzleOutboxStore;

  const sampleEvent: DomainEvent = {
    id: 'evt-123',
    eventName: 'member.verified',
    aggregateId: 'usr-456',
    payload: { memberId: 'usr-456', status: 'VERIFIED' },
    occurredOn: new Date('2026-09-01T10:00:00Z'),
    version: 1,
    metadata: { correlationId: 'corr-789' },
  };

  beforeEach(() => {
    mockDb = {
      insert: vi.fn().mockReturnValue({
        values: vi.fn().mockResolvedValue([{ id: 'evt-123' }]),
      }),
      select: vi.fn().mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue([
                {
                  id: 'evt-123',
                  eventName: 'member.verified',
                  aggregateId: 'usr-456',
                  payload: { memberId: 'usr-456' },
                  version: 1,
                  metadata: { correlationId: 'corr-789' },
                  status: 'PENDING',
                  attemptsMade: 0,
                  lastError: null,
                  createdAt: new Date('2026-09-01T10:00:00Z'),
                  publishedAt: null,
                },
              ]),
            }),
            limit: vi.fn().mockResolvedValue([{ attemptsMade: 0 }]),
          }),
        }),
      }),
      update: vi.fn().mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([{ id: 'evt-123' }]),
        }),
      }),
    };

    outboxStore = new DrizzleOutboxStore(mockDb);
  });

  it('should save a single domain event into outbox', async () => {
    await outboxStore.save(sampleEvent);

    expect(mockDb.insert).toHaveBeenCalledTimes(1);
  });

  it('should save using a transactional context when provided', async () => {
    const mockTx = {
      insert: vi.fn().mockReturnValue({
        values: vi.fn().mockResolvedValue([]),
      }),
    };

    await outboxStore.save(sampleEvent, mockTx);

    expect(mockTx.insert).toHaveBeenCalledTimes(1);
    expect(mockDb.insert).not.toHaveBeenCalled();
  });

  it('should batch-save multiple domain events', async () => {
    const events: DomainEvent[] = [
      sampleEvent,
      {
        ...sampleEvent,
        id: 'evt-124',
        aggregateId: 'usr-457',
      },
    ];

    await outboxStore.saveAll(events);

    expect(mockDb.insert).toHaveBeenCalledTimes(1);
  });

  it('should not call insert if batch saveAll is given an empty array', async () => {
    await outboxStore.saveAll([]);

    expect(mockDb.insert).not.toHaveBeenCalled();
  });

  it('should fetch pending events and correctly map to OutboxRecord', async () => {
    const pending = await outboxStore.fetchPending(10);

    expect(pending).toHaveLength(1);
    expect(pending[0].id).toBe('evt-123');
    expect(pending[0].status).toBe('PENDING');
    expect(pending[0].aggregateId).toBe('usr-456');
  });

  it('should mark events as PUBLISHED', async () => {
    await outboxStore.markPublished(['evt-123', 'evt-124']);

    expect(mockDb.update).toHaveBeenCalledTimes(1);
  });

  it('should not call update if markPublished is given an empty array', async () => {
    await outboxStore.markPublished([]);

    expect(mockDb.update).not.toHaveBeenCalled();
  });

  it('should record failure and retry count', async () => {
    await outboxStore.markFailed('evt-123', 'Network timeout', 5);

    expect(mockDb.select).toHaveBeenCalledTimes(1);
    expect(mockDb.update).toHaveBeenCalledTimes(1);
  });

  it('should transition status to FAILED when retry limit reached', async () => {
    mockDb.select = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([{ attemptsMade: 4 }]),
        }),
      }),
    });

    await outboxStore.markFailed('evt-123', 'Repeated failure', 5);

    expect(mockDb.update).toHaveBeenCalledTimes(1);
  });
});
