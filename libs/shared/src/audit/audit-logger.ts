import { AuditEventDTO, AuditRecord, IAuditLogger, IAuditStore } from './audit.interface';
import { MemoryAuditStore } from './memory-audit.store';
import { PiiMasker } from '../crypto/pii-masker';
import { logger } from '../logger';
import * as crypto from 'crypto';

export const GENESIS_HASH = '0000000000000000000000000000000000000000000000000000000000000000';

/**
 * Calculates SHA-256 hash for an audit record including previousHash.
 */
export function computeRecordHash(record: Omit<AuditRecord, 'currentHash'>): string {
  const canonicalString = [
    record.previousHash,
    record.sequenceNumber,
    record.action,
    record.userId || '',
    record.resourceType,
    record.targetId || '',
    record.severity,
    record.timestamp,
    JSON.stringify(record.payload),
  ].join('|');

  return crypto.createHash('sha256').update(canonicalString).digest('hex');
}

/**
 * Low-Level Design (LLD): Enterprise Tamper-Evident Audit Logger
 * Features:
 * - Blockchain-style SHA-256 cryptographic hash chaining (prevHash + currentData)
 * - Automatic PII sanitization of sensitive metadata before persistence
 * - Immutable sequence numbering and append-only store
 */
export class StructuredAuditLogger implements IAuditLogger {
  private store: IAuditStore;
  private sequenceCounter = 0;
  private lastHash: string = GENESIS_HASH;

  constructor(store: IAuditStore = new MemoryAuditStore()) {
    this.store = store;
  }

  public getStore(): IAuditStore {
    return this.store;
  }

  public async log(event: AuditEventDTO): Promise<AuditRecord> {
    this.sequenceCounter++;
    const timestamp = event.timestamp || new Date().toISOString();

    // 1. Sanitize PII from metadata and diffs
    const sanitizedPayload: Record<string, any> = {
      ipAddress: event.ipAddress,
      userAgent: event.userAgent,
      metadata: event.metadata ? PiiMasker.sanitizeObject(event.metadata) : undefined,
      diff: event.diff ? PiiMasker.sanitizeObject(event.diff) : undefined,
    };

    const recordWithoutHash: Omit<AuditRecord, 'currentHash'> = {
      id: `aud_${Date.now()}_${this.sequenceCounter}`,
      sequenceNumber: this.sequenceCounter,
      action: event.action,
      userId: event.userId,
      targetId: event.targetId,
      resourceType: event.resourceType,
      severity: event.severity || 'INFO',
      payload: sanitizedPayload,
      previousHash: this.lastHash,
      timestamp,
    };

    // 2. Cryptographic Hash Chaining
    const currentHash = computeRecordHash(recordWithoutHash);
    const completeRecord: AuditRecord = {
      ...recordWithoutHash,
      currentHash,
    };

    this.lastHash = currentHash;

    // 3. Append to Audit Store
    await this.store.append(completeRecord);

    // 4. Log to System Logger
    logger.info({
      audit: true,
      auditId: completeRecord.id,
      sequence: completeRecord.sequenceNumber,
      action: completeRecord.action,
      resourceType: completeRecord.resourceType,
      targetId: completeRecord.targetId,
      userId: completeRecord.userId,
      hash: completeRecord.currentHash,
    }, `[AUDIT] ${completeRecord.action} on ${completeRecord.resourceType}`);

    // TASK: [Lifecycle Integration] Register flush hook in GracefulShutdownManager (Component 11, Phase 4) to ensure pending audit events are flushed before DB disconnect
    return completeRecord;
  }

  /**
   * Flushes any pending in-flight audit logs to datastore during graceful shutdown (Phase 4).
   */
  public async flush(): Promise<void> {
    logger.info('[AuditLogger] Flushing audit logs...');
  }
}

export const auditLogger: IAuditLogger = new StructuredAuditLogger();
export const defaultAuditLogger = auditLogger;
