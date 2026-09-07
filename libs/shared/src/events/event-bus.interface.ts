/**
 * Generic Domain Event representation.
 */
export interface DomainEvent<T = any> {
  readonly id: string;
  readonly eventName: string;
  readonly aggregateId: string;
  readonly occurredOn: Date;
  readonly payload: T;
  readonly metadata?: {
    correlationId?: string;
    causationId?: string;
    userId?: string;
  };
}

export type EventHandler<T = any> = (event: DomainEvent<T>) => Promise<void> | void;

/**
 * Low-Level Design (LLD): Event Bus Abstraction
 * Decouples cross-module business events from synchronous execution.
 */
export interface IEventBus {
  publish<T>(event: DomainEvent<T>): Promise<void>;
  publishAll(events: DomainEvent[]): Promise<void>;
  subscribe<T>(eventName: string, handler: EventHandler<T>): void;
  unsubscribe<T>(eventName: string, handler: EventHandler<T>): void;
}
