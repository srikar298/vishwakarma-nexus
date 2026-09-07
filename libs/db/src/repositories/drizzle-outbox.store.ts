import { eq, inArray, asc } from "drizzle-orm";
import { IOutboxStore, OutboxRecord, DomainEvent } from "@vishwakarma-k-c/shared";
import { outboxEvents } from "../schema/modules/shared/infrastructure";
import { db as defaultDb } from "../index";

/**
 * Low-Level Design (LLD): Production Drizzle Transactional Outbox Store
 * Implements IOutboxStore to guarantee atomic persistence of domain events
 * alongside business mutations within PostgreSQL transactions.
 */
export class DrizzleOutboxStore implements IOutboxStore {
  constructor(private readonly client: any = defaultDb) {}

  /**
   * Saves a single domain event into the outbox.
   * If transactionContext (Drizzle Tx) is provided, executes within that transaction.
   */
  public async save(event: DomainEvent, transactionContext?: any): Promise<void> {
    const tx = transactionContext || this.client;
    await tx.insert(outboxEvents).values({
      id: event.id,
      eventName: event.eventName,
      aggregateId: event.aggregateId,
      payload: event.payload,
      version: event.version || 1,
      metadata: event.metadata || null,
      status: "PENDING",
      attemptsMade: 0,
      createdAt: event.occurredOn || new Date(),
    });
  }

  /**
   * Batch-saves domain events into the outbox within the same transaction.
   */
  public async saveAll(events: DomainEvent[], transactionContext?: any): Promise<void> {
    if (events.length === 0) return;
    const tx = transactionContext || this.client;
    const rows = events.map((event) => ({
      id: event.id,
      eventName: event.eventName,
      aggregateId: event.aggregateId,
      payload: event.payload,
      version: event.version || 1,
      metadata: event.metadata || null,
      status: "PENDING",
      attemptsMade: 0,
      createdAt: event.occurredOn || new Date(),
    }));

    await tx.insert(outboxEvents).values(rows);
  }

  /**
   * Fetches pending outbox events ordered by createdAt ASC for sequential processing.
   */
  public async fetchPending(limit = 50): Promise<OutboxRecord[]> {
    const rows = await this.client
      .select()
      .from(outboxEvents)
      .where(eq(outboxEvents.status, "PENDING"))
      .orderBy(asc(outboxEvents.createdAt))
      .limit(limit);

    return rows.map((r: any) => ({
      id: r.id,
      eventName: r.eventName,
      aggregateId: r.aggregateId,
      payload: r.payload,
      version: r.version,
      metadata: r.metadata ?? undefined,
      status: r.status as any,
      attemptsMade: r.attemptsMade,
      lastError: r.lastError ?? undefined,
      createdAt: r.createdAt,
      publishedAt: r.publishedAt ?? undefined,
    }));
  }

  /**
   * Marks events as PUBLISHED with the current timestamp.
   */
  public async markPublished(ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    await this.client
      .update(outboxEvents)
      .set({
        status: "PUBLISHED",
        publishedAt: new Date(),
      })
      .where(inArray(outboxEvents.id, ids));
  }

  /**
   * Records a failed delivery attempt, updating lastError and marking as FAILED if retry limit reached.
   */
  public async markFailed(id: string, error: string, maxRetries = 5): Promise<void> {
    const existing = await this.client
      .select({ attemptsMade: outboxEvents.attemptsMade })
      .from(outboxEvents)
      .where(eq(outboxEvents.id, id))
      .limit(1);

    const attempts = (existing[0]?.attemptsMade ?? 0) + 1;
    const newStatus = attempts >= maxRetries ? "FAILED" : "PENDING";

    await this.client
      .update(outboxEvents)
      .set({
        attemptsMade: attempts,
        lastError: error,
        status: newStatus,
      })
      .where(eq(outboxEvents.id, id));
  }
}
