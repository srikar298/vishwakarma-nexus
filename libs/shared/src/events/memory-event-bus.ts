import { 
  DomainEvent, 
  EventHandler, 
  IEventBus, 
  SubscriptionOptions 
} from './event-bus.interface';
import { defaultEventDLQ, EventDeadLetterQueue } from './dlq/event-dlq';
import { retryWithBackoff } from '../resilience/retry/retry';
import { logger } from '../logger';

interface SubscriptionConfig {
  handler: EventHandler;
  options: SubscriptionOptions;
}

/**
 * Low-Level Design (LLD): Production-Grade Asynchronous Event Bus
 * Features:
 * - Asynchronous handler dispatching.
 * - Exponential backoff retries on subscriber failure (via Component 1).
 * - Poison event isolation and DLQ routing.
 */
export class InMemoryEventBus implements IEventBus {
  private handlers = new Map<string, Set<SubscriptionConfig>>();
  private dlq: EventDeadLetterQueue;

  constructor(dlq: EventDeadLetterQueue = defaultEventDLQ) {
    this.dlq = dlq;
  }

  public async publish<T>(event: DomainEvent<T>): Promise<void> {
    const subscriptions = this.handlers.get(event.eventName);
    if (!subscriptions || subscriptions.size === 0) {
      return;
    }

    // TASK: [Telemetry Integration] Increment domain_event_published_total counter (Component 10)
    logger.debug({ eventName: event.eventName, eventId: event.id }, 'EventBus: Publishing domain event');

    const executions = Array.from(subscriptions).map(async ({ handler, options }) => {
      const maxRetries = options.retryAttempts ?? 3;
      const enableDlq = options.enableDlq ?? true;

      try {
        await retryWithBackoff(
          async (attempt) => {
            await handler(event);
          },
          {
            maxRetries,
            initialDelayMs: 50,
            maxDelayMs: 1000,
            backoffFactor: 2,
          }
        );
      } catch (err: any) {
        logger.error({
          msg: `[EventBus] Handler execution failed after ${maxRetries} retries for event: ${event.eventName}`,
          eventId: event.id,
          error: err?.message,
        });

        if (enableDlq) {
          await this.dlq.push(
            event,
            handler.name || 'anonymous_handler',
            err,
            maxRetries + 1
          );
        }
      }
    });

    await Promise.allSettled(executions);
  }

  public async publishAll(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }

  public subscribe<T>(
    eventName: string, 
    handler: EventHandler<T>, 
    options: SubscriptionOptions = {}
  ): void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, new Set());
    }

    this.handlers.get(eventName)!.add({
      handler: handler as EventHandler,
      options,
    });
  }

  public unsubscribe<T>(eventName: string, handler: EventHandler<T>): void {
    const subscriptions = this.handlers.get(eventName);
    if (subscriptions) {
      for (const config of subscriptions) {
        if (config.handler === handler) {
          subscriptions.delete(config);
        }
      }
      if (subscriptions.size === 0) {
        this.handlers.delete(eventName);
      }
    }
  }

  public clearAll(): void {
    this.handlers.clear();
  }
}

export const defaultEventBus = new InMemoryEventBus();
