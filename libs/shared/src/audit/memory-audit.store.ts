import { AuditRecord, IAuditStore } from './audit.interface';

/**
 * In-Memory Audit Store for testing and development.
 */
export class MemoryAuditStore implements IAuditStore {
  private records: AuditRecord[] = [];

  public async append(record: AuditRecord): Promise<void> {
    this.records.push({ ...record });
  }

  public async getRecords(filter?: { resourceType?: string; userId?: string; limit?: number }): Promise<AuditRecord[]> {
    let result = [...this.records];

    if (filter?.resourceType) {
      result = result.filter((r) => r.resourceType === filter.resourceType);
    }

    if (filter?.userId) {
      result = result.filter((r) => r.userId === filter.userId);
    }

    if (filter?.limit) {
      result = result.slice(-filter.limit);
    }

    return result;
  }

  public async getLatestRecord(): Promise<AuditRecord | null> {
    if (this.records.length === 0) return null;
    return this.records[this.records.length - 1];
  }

  public async clear(): Promise<void> {
    this.records = [];
  }
}
