import { AuditEventDTO, IAuditLogger } from './audit.interface';
import { logger } from '../logger';

/**
 * Low-Level Design (LLD): Enterprise Audit Logger
 * Dispatches structured, immutable audit records for regulatory compliance and security forensics.
 */
export class StructuredAuditLogger implements IAuditLogger {
  public async log(event: AuditEventDTO): Promise<void> {
    const record = {
      ...event,
      timestamp: event.timestamp || new Date().toISOString(),
      severity: event.severity || 'INFO',
    };

    logger.info(
      {
        audit: true,
        action: record.action,
        userId: record.userId,
        resourceType: record.resourceType,
        targetId: record.targetId,
        ipAddress: record.ipAddress,
        severity: record.severity,
        diff: record.diff,
        metadata: record.metadata,
      },
      `[AUDIT] ${record.action} on ${record.resourceType}${record.targetId ? ` (${record.targetId})` : ''}`
    );
  }
}

export const auditLogger: IAuditLogger = new StructuredAuditLogger();
