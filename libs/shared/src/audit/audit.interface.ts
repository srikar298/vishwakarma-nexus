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

export interface IAuditLogger {
  log(event: AuditEventDTO): Promise<void>;
}
