import { DomainEvent, EventHandler, IEventBus } from './event-bus.interface';
import { logger } from '../logger';

/**
 * In-Memory Asynchronous Event Bus Implementation.
 * Runs event handlers asynchronously without blocking the publishing domain transaction.
 */
export class InMemoryEventBus implements IEventBus {
  private handlers = new Map<string, Set<EventHandler>>();

  public async publish<T>(event: DomainEvent<T>): Promise<void> {
    const eventHandlers = this.handlers.get(event.eventName);
    if (!eventHandlers || eventHandlers.size === 0) {
      return;
    }

    // Execute handlers concurrently in the background (fire-and-forget or awaited depending on design)
    const executions = Array.from(eventHandlers).map(async (handler) => {
      try {
        await handler(event);
      } catch (err: any) {
        logger.error({
          msg: `[EventBus] Unhandled exception in handler for event: ${event.eventName}`,
          eventId: event.id,
          error: err?.message,
          stack: err?.stack,
        });
      }
    });

    // We do not reject the publish call if one listener fails
    await Promise.allSettled(executions);
  }

  public async publishAll(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }

  public subscribe<T>(eventName: string, handler: EventHandler<T>): void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, new Set());
    }
    this.handlers.get(eventName)!.add(handler as EventHandler);
  }

  public unsubscribe<T>(eventName: string, handler: EventHandler<T>): void {
    const eventHandlers = this.handlers.get(eventName);
    if (eventHandlers) {
      eventHandlers.delete(handler as EventHandler);
      if (eventHandlers.size === 0) {
        this.handlers.delete(eventName);
      }
    }
  }

  public clearAll(): void {
    this.handlers.clear();
  }
}

export const defaultEventBus = new InMemoryEventBus();
