import { randomUUID } from "crypto";
import { sql, eq, and, isNull } from "drizzle-orm";
import type { PgTableWithColumns } from "drizzle-orm/pg-core";
import { auditLogs, outboxEvents } from "../schema/modules/shared/infrastructure";

export abstract class BaseRepository<T extends PgTableWithColumns<any>> {
  constructor(protected readonly db: any, protected readonly table: T) {}

  public get dbInstance() {
    return this.db;
  }

  /**
   * Creates a new record
   */
  async create(data: typeof this.table.$inferInsert) {
    return this.db.insert(this.table).values(data).returning();
  }

  /**
   * Helper to record a cross-module event (Outbox Pattern)
   */
  async trackEvent(type: string, payload: any, aggregateId?: string) {
    return this.db.insert(outboxEvents).values({
      id: randomUUID(),
      eventName: type,
      aggregateId: aggregateId || String((payload as any)?.id || (payload as any)?.userId || "unknown"),
      payload,
    });
  }

  /**
   * Helper to record an audit log
   */
  async recordAudit(params: {
    actorId?: number;
    action: "CREATE" | "UPDATE" | "DELETE";
    entityId: string;
    oldData?: any;
    newData?: any;
  }) {
    return this.db.insert(auditLogs).values({
      ...params,
      entityType: (this.table as any).key || "UNKNOWN",
    });
  }

  /**
   * Finds all non-deleted records
   */
  async findAll() {
    return this.db
      .select()
      .from(this.table)
      .where(this.hasSoftDelete() ? isNull((this.table as any).deletedAt) : undefined);
  }

  /**
   * Finds a single non-deleted record by ID
   */
  async findById(id: number) {
    const filters = [eq((this.table as any).id, id)];
    if (this.hasSoftDelete()) {
      filters.push(isNull((this.table as any).deletedAt));
    }

    const results = await this.db
      .select()
      .from(this.table)
      .where(and(...filters))
      .limit(1);

    return results[0] || null;
  }

  /**
   * Performs a soft delete if the column exists, otherwise a hard delete
   */
  async delete(id: number) {
    if (this.hasSoftDelete()) {
      return this.db
        .update(this.table)
        .set({ deletedAt: new Date() })
        .where(eq((this.table as any).id, id));
    }
    return this.db.delete(this.table).where(eq((this.table as any).id, id));
  }

  /**
   * Utility to check if the table supports soft deletes
   */
  protected hasSoftDelete(): boolean {
    return "deletedAt" in this.table;
  }
}
