import { DomainEvent } from '../event-bus.interface';

export type OutboxStatus = 'PENDING' | 'PUBLISHED' | 'FAILED';

export interface OutboxRecord {
  id: string;
  eventName: string;
  aggregateId: string;
  payload: any;
  version: number;
  metadata?: Record<string, any>;
  status: OutboxStatus;
  attemptsMade: number;
  lastError?: string;
  createdAt: Date;
  publishedAt?: Date;
}

/**
 * Low-Level Design (LLD): Transactional Outbox Store Contract
 * Stores domain events within the same transactional boundary as business entities.
 */
export interface IOutboxStore {
  save(event: DomainEvent, transactionContext?: any): Promise<void>;
  saveAll(events: DomainEvent[], transactionContext?: any): Promise<void>;
  fetchPending(limit: number): Promise<OutboxRecord[]>;
  markPublished(ids: string[]): Promise<void>;
  markFailed(id: string, error: string): Promise<void>;
}
