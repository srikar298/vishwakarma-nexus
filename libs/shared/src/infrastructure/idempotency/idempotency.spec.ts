import { describe, it, expect, beforeEach } from 'vitest';
import { IdempotencyEngine } from './idempotency-engine';
import { MemoryCacheProvider } from '../../cache/providers/memory-cache.provider';
import { MemoryLockProvider } from '../../concurrency/providers/memory-lock.provider';

describe('Idempotency Subsystem: Production Audit Test Suite', () => {
  let engine: IdempotencyEngine;
  let cache: MemoryCacheProvider;
  let lock: MemoryLockProvider;

  beforeEach(() => {
    cache = new MemoryCacheProvider();
    lock = new MemoryLockProvider();
    engine = new IdempotencyEngine(cache, lock);
  });

  it('computes deterministic SHA-256 fingerprint regardless of key insertion order in payload', () => {
    const body1 = { amount: 500, currency: 'INR', target: 'acc_123' };
    const body2 = { target: 'acc_123', currency: 'INR', amount: 500 }; // different key ordering

    const fp1 = engine.computeFingerprint('POST', '/api/v1/finance/pay', body1);
    const fp2 = engine.computeFingerprint('POST', '/api/v1/finance/pay', body2);

    expect(fp1).toBe(fp2);
    expect(typeof fp1).toBe('string');
    expect(fp1.length).toBe(64); // SHA-256 hex length
  });

  it('acquires NEW_ACQUIRED slot on initial fresh request', async () => {
    const fp = engine.computeFingerprint('POST', '/api/v1/finance/pay', { amount: 100 });
    const res = await engine.checkAndAcquire('user_1', 'idem_key_1', fp);

    expect(res.state).toBe('NEW_ACQUIRED');
  });

  it('detects FINGERPRINT_MISMATCH when same key is reused with altered payload', async () => {
    const fpOriginal = engine.computeFingerprint('POST', '/api/v1/finance/pay', { amount: 5000 });
    const fpAltered = engine.computeFingerprint('POST', '/api/v1/finance/pay', { amount: 500 }); // Tampered!

    // 1. First request acquires slot
    await engine.checkAndAcquire('user_1', 'idem_key_tamper', fpOriginal);

    // 2. Second request with different body is flagged as a mismatch
    const check = await engine.checkAndAcquire('user_1', 'idem_key_tamper', fpAltered);
    expect(check.state).toBe('FINGERPRINT_MISMATCH');
  });

  it('returns IN_PROGRESS if a parallel request is currently being processed', async () => {
    const fp = engine.computeFingerprint('POST', '/api/v1/members/register', { name: 'Suresh' });

    // 1. First request starts processing
    const first = await engine.checkAndAcquire('user_2', 'idem_key_concur', fp);
    expect(first.state).toBe('NEW_ACQUIRED');

    // 2. Parallel duplicate request arrives while first is active
    const second = await engine.checkAndAcquire('user_2', 'idem_key_concur', fp);
    expect(second.state).toBe('IN_PROGRESS');
    if (second.state === 'IN_PROGRESS') {
      expect(second.retryAfterSeconds).toBe(2);
    }
  });

  it('returns REPLAY_READY with original status and body once completed', async () => {
    const fp = engine.computeFingerprint('POST', '/api/v1/finance/pay', { amount: 2000 });

    // 1. Initial acquire
    await engine.checkAndAcquire('user_3', 'idem_key_complete', fp);

    // 2. Complete and cache response
    await engine.saveCompleted(
      'user_3',
      'idem_key_complete',
      fp,
      201,
      { transactionId: 'txn_abc123', status: 'SUCCESS' },
      { 'content-type': 'application/json' }
    );

    // 3. Subsequent request replays identical response
    const check = await engine.checkAndAcquire('user_3', 'idem_key_complete', fp);
    expect(check.state).toBe('REPLAY_READY');
    if (check.state === 'REPLAY_READY') {
      expect(check.record.responseStatus).toBe(201);
      expect(check.record.responseBody).toEqual({ transactionId: 'txn_abc123', status: 'SUCCESS' });
      expect(check.record.responseHeaders).toEqual({ 'content-type': 'application/json' });
    }
  });

  it('releases in-progress lock when releaseLock is called on handler failure', async () => {
    const fp = engine.computeFingerprint('POST', '/api/v1/members', { name: 'Test' });

    await engine.checkAndAcquire('user_4', 'idem_key_fail', fp);
    await engine.releaseLock('user_4', 'idem_key_fail');

    // Slot is now free for retry
    const retry = await engine.checkAndAcquire('user_4', 'idem_key_fail', fp);
    expect(retry.state).toBe('NEW_ACQUIRED');
  });
});
