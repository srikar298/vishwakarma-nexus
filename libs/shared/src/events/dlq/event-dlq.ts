import { DomainEvent, IEventBus } from '../event-bus.interface';
import { logger } from '../../logger';

export interface DeadLetterEntry {
  id: string;
  event: DomainEvent;
  failedHandlerName: string;
  error: string;
  stack?: string;
  attemptsMade: number;
  failedAt: Date;
}

/**
 * Low-Level Design (LLD): Event Dead-Letter Queue (DLQ)
 * Captures unrecoverable poison events for investigation, alerting, and manual/automated replay.
 */
export class EventDeadLetterQueue {
  private deadLetters = new Map<string, DeadLetterEntry>();

  public async push(
    event: DomainEvent,
    failedHandlerName: string,
    error: unknown,
    attemptsMade: number
  ): Promise<string> {
    const entryId = `dlq_${event.id}_${Date.now()}`;
    const entry: DeadLetterEntry = {
      id: entryId,
      event,
      failedHandlerName,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      attemptsMade,
      failedAt: new Date(),
    };

    this.deadLetters.set(entryId, entry);

    // TASK: [Telemetry Integration] Increment event_dlq_total counter (Component 10)
    // TASK: [Audit Integration] Log CRITICAL audit alert for poison event via AuditLogger (Component 10)
    logger.error(
      { dlqId: entryId, eventName: event.eventName, eventId: event.id, handler: failedHandlerName, error: entry.error },
      'EventDeadLetterQueue: Poison event captured in DLQ'
    );

    return entryId;
  }

  public async replay(dlqId: string, eventBus: IEventBus): Promise<boolean> {
    const entry = this.deadLetters.get(dlqId);
    if (!entry) return false;

    logger.info({ dlqId, eventName: entry.event.eventName }, 'EventDeadLetterQueue: Replaying DLQ event');
    await eventBus.publish(entry.event);
    this.deadLetters.delete(dlqId);
    return true;
  }

  public async replayAll(eventBus: IEventBus): Promise<number> {
    let replayed = 0;
    for (const [id] of this.deadLetters.entries()) {
      const ok = await this.replay(id, eventBus);
      if (ok) replayed++;
    }
    return replayed;
  }

  public getAll(): DeadLetterEntry[] {
    return Array.from(this.deadLetters.values());
  }

  public getById(dlqId: string): DeadLetterEntry | undefined {
    return this.deadLetters.get(dlqId);
  }

  public size(): number {
    return this.deadLetters.size;
  }

  public clear(): void {
    this.deadLetters.clear();
  }
}

export const defaultEventDLQ = new EventDeadLetterQueue();
