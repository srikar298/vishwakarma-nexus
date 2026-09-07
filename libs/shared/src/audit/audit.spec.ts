import { describe, it, expect, beforeEach } from 'vitest';
import { StructuredAuditLogger, AuditChainVerifier, MemoryAuditStore } from './index';

describe('Component 10.2: Audit Subsystem (Tamper-Evident Cryptographic Ledger)', () => {
  let store: MemoryAuditStore;
  let auditLogger: StructuredAuditLogger;

  beforeEach(() => {
    store = new MemoryAuditStore();
    auditLogger = new StructuredAuditLogger(store);
  });

  it('should log audit events with sequential numbering and SHA-256 hash chaining', async () => {
    const record1 = await auditLogger.log({
      action: 'USER_LOGIN',
      userId: 'usr_1',
      resourceType: 'AUTH',
      metadata: { ip: '127.0.0.1', mobile: '+919876543210' },
    });

    const record2 = await auditLogger.log({
      action: 'MEMBER_REGISTERED',
      userId: 'usr_1',
      resourceType: 'MEMBER',
      targetId: 'mem_101',
      metadata: { fullName: 'Rajesh Sharma' },
    });

    expect(record1.sequenceNumber).toBe(1);
    expect(record2.sequenceNumber).toBe(2);

    // Hash chaining: record2's previousHash must equal record1's currentHash
    expect(record2.previousHash).toBe(record1.currentHash);

    // PII Masking: mobile number in metadata must be masked
    expect(record1.payload.metadata?.mobile).toContain('3210');
    expect(record1.payload.metadata?.mobile).not.toBe('+919876543210');
  });

  it('should verify a valid unbroken audit hash chain', async () => {
    for (let i = 1; i <= 5; i++) {
      await auditLogger.log({
        action: `TRANSACTION_${i}`,
        userId: `usr_${i}`,
        resourceType: 'FINANCE',
        targetId: `txn_${i}`,
      });
    }

    const records = await store.getRecords();
    const verification = AuditChainVerifier.verifyChain(records);

    expect(verification.isValid).toBe(true);
    expect(verification.totalRecordsChecked).toBe(5);
  });

  it('should detect when an audit record content has been tampered with', async () => {
    for (let i = 1; i <= 3; i++) {
      await auditLogger.log({
        action: `EVENT_${i}`,
        userId: 'admin',
        resourceType: 'SETTING',
      });
    }

    const records = await store.getRecords();

    // Tamper with record 2
    records[1].action = 'UNAUTHORIZED_MODIFICATION';

    const verification = AuditChainVerifier.verifyChain(records);
    expect(verification.isValid).toBe(false);
    expect(verification.brokenAtIndex).toBe(1);
    expect(verification.reason).toContain('Tampered record content');
  });

  it('should detect when an audit record has been deleted or removed from sequence', async () => {
    for (let i = 1; i <= 4; i++) {
      await auditLogger.log({
        action: `EVENT_${i}`,
        userId: 'admin',
        resourceType: 'SETTING',
      });
    }

    const records = await store.getRecords();

    // Delete record at index 1 (sequence 2)
    records.splice(1, 1);

    const verification = AuditChainVerifier.verifyChain(records);
    expect(verification.isValid).toBe(false);
    expect(verification.brokenAtIndex).toBe(1);
    expect(verification.reason).toContain('Broken chain link');
  });
});
