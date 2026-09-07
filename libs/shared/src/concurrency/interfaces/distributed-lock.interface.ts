export interface LockToken {
  key: string;
  token: string;
  expiresAt: number;
  reentrancyCount?: number;
}

export interface LockOptions {
  /** Lock auto-expiry duration in milliseconds (default: 10000ms) */
  ttlMs?: number;
  /** Maximum duration (ms) to wait while attempting to acquire the lock (default: 3000ms) */
  timeoutMs?: number;
  /** Delay (ms) between retry attempts (default: 50ms) */
  retryIntervalMs?: number;
  /** Automatically extend lock TTL periodically while the task promise is running (Watchdog) */
  autoExtend?: boolean;
  /** Interval in ms to renew the lock heartbeat (default: ttlMs / 3) */
  heartbeatIntervalMs?: number;
  /** Existing token for reentrant locking by the same caller */
  existingToken?: LockToken;
}

/**
 * Low-Level Design (LLD): Distributed Lock Provider Contract
 * Guarantees mutual exclusion across distributed nodes and processes.
 */
export interface IDistributedLockProvider {
  acquire(key: string, options?: LockOptions): Promise<LockToken | null>;
  release(lock: LockToken): Promise<boolean>;
  extend(lock: LockToken, extensionMs: number): Promise<boolean>;
  withLock<T>(key: string, task: (token: LockToken) => Promise<T>, options?: LockOptions): Promise<T>;
}
