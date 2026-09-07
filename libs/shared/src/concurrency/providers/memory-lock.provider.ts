import { 
  IDistributedLockProvider, 
  LockOptions, 
  LockToken 
} from '../interfaces/distributed-lock.interface';
import { nanoid } from 'nanoid';

/**
 * Low-Level Design (LLD): In-Memory Mutex Lock Provider
 * Ensures local concurrency safety and race condition prevention in single-instance/dev setups.
 */
export class MemoryLockProvider implements IDistributedLockProvider {
  private locks = new Map<string, LockToken>();

  public async acquire(key: string, options?: LockOptions): Promise<LockToken | null> {
    const ttlMs = options?.ttlMs ?? 10000;
    const timeoutMs = options?.timeoutMs ?? 3000;
    const retryIntervalMs = options?.retryIntervalMs ?? 50;

    const startTime = Date.now();

    while (Date.now() - startTime < timeoutMs) {
      const now = Date.now();
      const existingLock = this.locks.get(key);

      // 1. If existing lock is expired, clean it up
      if (existingLock && existingLock.expiresAt <= now) {
        this.locks.delete(key);
      }

      // 2. Try acquiring lock
      if (!this.locks.has(key)) {
        const token: LockToken = {
          key,
          token: nanoid(),
          expiresAt: now + ttlMs,
        };
        this.locks.set(key, token);
        return token;
      }

      // 3. Wait before retry
      await new Promise((resolve) => setTimeout(resolve, retryIntervalMs));
    }

    return null; // Could not acquire lock within timeout
  }

  public async release(lock: LockToken): Promise<boolean> {
    const current = this.locks.get(lock.key);
    if (current && current.token === lock.token) {
      this.locks.delete(lock.key);
      return true;
    }
    return false;
  }

  public async withLock<T>(key: string, task: () => Promise<T>, options?: LockOptions): Promise<T> {
    const lock = await this.acquire(key, options);
    if (!lock) {
      throw new Error(`Failed to acquire lock for key [${key}] within timeout.`);
    }

    try {
      return await task();
    } finally {
      await this.release(lock);
    }
  }
}

export const defaultLockProvider: IDistributedLockProvider = new MemoryLockProvider();
