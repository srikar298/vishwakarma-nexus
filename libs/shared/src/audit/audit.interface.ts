export type AuditSeverity = 'INFO' | 'WARNING' | 'CRITICAL';

export interface AuditEventDTO {
  action: string;              // e.g. "AUTH_LOGIN", "MEMBER_VERIFIED", "PAYMENT_REFUND", "ROLE_ASSIGNED"
  userId?: string;            // Actor executing the action
  targetId?: string;          // Resource affected
  resourceType: string;       // e.g. "MEMBER", "FINANCE_LEDGER", "MATRIMONY_PROFILE"
  severity?: AuditSeverity;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
  diff?: {
    before?: Record<string, any>;
    after?: Record<string, any>;
  };
  timestamp?: string;
}

export interface AuditRecord {
  id: string;
  sequenceNumber: number;
  action: string;
  userId?: string;
  targetId?: string;
  resourceType: string;
  severity: AuditSeverity;
  payload: Record<string, any>;
  previousHash: string;
  currentHash: string;
  timestamp: string;
}

export interface IAuditStore {
  append(record: AuditRecord): Promise<void>;
  getRecords(filter?: { resourceType?: string; userId?: string; limit?: number }): Promise<AuditRecord[]>;
  getLatestRecord(): Promise<AuditRecord | null>;
  clear?(): Promise<void>;
}

export interface IAuditLogger {
  log(event: AuditEventDTO): Promise<AuditRecord>;
  getStore(): IAuditStore;
  flush?(): Promise<void>;
}
