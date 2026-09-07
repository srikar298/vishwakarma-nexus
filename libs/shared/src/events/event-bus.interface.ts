/**
 * Generic Versioned Domain Event representation.
 */
export interface DomainEvent<T = any> {
  readonly id: string;
  readonly eventName: string;
  readonly aggregateId: string;
  readonly occurredOn: Date;
  readonly payload: T;
  readonly version?: number; // Event schema version (default: 1)
  readonly metadata?: {
    correlationId?: string;
    causationId?: string;
    userId?: string;
    sourceModule?: string;
  };
}

export type EventHandler<T = any> = (event: DomainEvent<T>) => Promise<void> | void;

export interface SubscriptionOptions {
  /** Number of retry attempts with exponential backoff on handler failure (default: 3) */
  retryAttempts?: number;
  /** Whether to route failed events to DLQ after exhausting retries (default: true) */
  enableDlq?: boolean;
}

/**
 * Low-Level Design (LLD): Event Bus Abstraction
 * Decouples cross-module business events from synchronous execution.
 */
export interface IEventBus {
  publish<T>(event: DomainEvent<T>): Promise<void>;
  publishAll(events: DomainEvent[]): Promise<void>;
  subscribe<T>(eventName: string, handler: EventHandler<T>, options?: SubscriptionOptions): void;
  unsubscribe<T>(eventName: string, handler: EventHandler<T>): void;
}
