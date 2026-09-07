export interface LockToken {
  key: string;
  token: string;
  expiresAt: number;
}

export interface LockOptions {
  ttlMs?: number;        // Lock auto-expiry in milliseconds (e.g. 10000ms)
  timeoutMs?: number;    // Maximum time to wait attempting to acquire the lock (e.g. 3000ms)
  retryIntervalMs?: number; // Delay between retry attempts
}

export interface IDistributedLockProvider {
  acquire(key: string, options?: LockOptions): Promise<LockToken | null>;
  release(lock: LockToken): Promise<boolean>;
  withLock<T>(key: string, task: () => Promise<T>, options?: LockOptions): Promise<T>;
}
