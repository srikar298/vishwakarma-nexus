export type IdempotencyStatus = 'IN_PROGRESS' | 'COMPLETED';

export interface IdempotencyRecord {
  idempotencyKey: string;
  fingerprint: string;
  status: IdempotencyStatus;
  responseStatus?: number;
  responseBody?: any;
  responseHeaders?: Record<string, string>;
  createdAt: number;
  completedAt?: number;
}

export interface IdempotencyOptions {
  /** TTL in seconds for completed responses (default: 86400s / 24h) */
  ttlSeconds?: number;
  /** TTL in seconds for in-progress locks (default: 30s) */
  lockTtlSeconds?: number;
}

/**
 * Result of attempting to acquire/verify an idempotency key.
 */
export type IdempotencyCheckResult = 
  | { state: 'NEW_ACQUIRED'; lockToken: string }
  | { state: 'IN_PROGRESS'; retryAfterSeconds: number }
  | { state: 'REPLAY_READY'; record: IdempotencyRecord }
  | { state: 'FINGERPRINT_MISMATCH'; expectedFingerprint: string; actualFingerprint: string };
