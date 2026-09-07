import { DomainEvent } from '../event-bus.interface';
import { IOutboxStore, OutboxRecord } from './outbox.interface';

/**
 * Low-Level Design (LLD): In-Memory Transactional Outbox Store
 * Used for testing and single-instance environments without direct SQL transactions.
 */
export class MemoryOutboxStore implements IOutboxStore {
  private records = new Map<string, OutboxRecord>();

  public async save(event: DomainEvent): Promise<void> {
    const record: OutboxRecord = {
      id: event.id,
      eventName: event.eventName,
      aggregateId: event.aggregateId,
      payload: event.payload,
      version: event.version || 1,
      metadata: event.metadata,
      status: 'PENDING',
      attemptsMade: 0,
      createdAt: event.occurredOn || new Date(),
    };

    this.records.set(event.id, record);
  }

  public async saveAll(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      await this.save(event);
    }
  }

  public async fetchPending(limit = 50): Promise<OutboxRecord[]> {
    const pending: OutboxRecord[] = [];
    for (const record of this.records.values()) {
      if (record.status === 'PENDING') {
        pending.push(record);
        if (pending.length >= limit) break;
      }
    }
    return pending;
  }

  public async markPublished(ids: string[]): Promise<void> {
    const now = new Date();
    for (const id of ids) {
      const rec = this.records.get(id);
      if (rec) {
        rec.status = 'PUBLISHED';
        rec.publishedAt = now;
      }
    }
  }

  public async markFailed(id: string, error: string): Promise<void> {
    const rec = this.records.get(id);
    if (rec) {
      rec.attemptsMade++;
      rec.lastError = error;
      if (rec.attemptsMade >= 5) {
        rec.status = 'FAILED';
      }
    }
  }

  public clear(): void {
    this.records.clear();
  }

  public size(): number {
    return this.records.size;
  }
}

export const defaultOutboxStore = new MemoryOutboxStore();
