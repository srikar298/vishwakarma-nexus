import { AuditRecord } from './audit.interface';
import { computeRecordHash, GENESIS_HASH } from './audit-logger';

export interface ChainVerificationResult {
  isValid: boolean;
  totalRecordsChecked: number;
  brokenAtIndex?: number;
  reason?: string;
}

/**
 * Low-Level Design (LLD): Cryptographic Audit Trail Verifier
 * Traverses an array of audit records to verify SHA-256 hash chaining integrity.
 * Detects any tampered, modified, injected, or deleted audit log rows.
 */
export class AuditChainVerifier {
  public static verifyChain(records: AuditRecord[]): ChainVerificationResult {
    if (!records || records.length === 0) {
      return { isValid: true, totalRecordsChecked: 0 };
    }

    let expectedPrevHash = GENESIS_HASH;

    for (let i = 0; i < records.length; i++) {
      const record = records[i];

      // 1. Verify previous hash link
      if (record.previousHash !== expectedPrevHash) {
        return {
          isValid: false,
          totalRecordsChecked: i,
          brokenAtIndex: i,
          reason: `Broken chain link at sequence ${record.sequenceNumber}: expected previousHash "${expectedPrevHash}", but got "${record.previousHash}"`,
        };
      }

      // 2. Recompute and verify current record hash
      const computedHash = computeRecordHash(record);
      if (computedHash !== record.currentHash) {
        return {
          isValid: false,
          totalRecordsChecked: i,
          brokenAtIndex: i,
          reason: `Tampered record content at sequence ${record.sequenceNumber}: expected hash "${computedHash}", but got "${record.currentHash}"`,
        };
      }

      expectedPrevHash = record.currentHash;
    }

    return {
      isValid: true,
      totalRecordsChecked: records.length,
    };
  }
}
