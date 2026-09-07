import { 
  IDistributedLockProvider, 
  LockOptions, 
  LockToken 
} from '../interfaces/distributed-lock.interface';
import { nanoid } from 'nanoid';
import { logger } from '../../logger';

/**
 * Low-Level Design (LLD): Production In-Memory Mutex Lock Provider
 * Provides local concurrency safety, reentrancy support, and Watchdog auto-extension.
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

      // 1. Reentrancy Check: If caller already holds this lock, increment depth
      if (existingLock && options?.existingToken && existingLock.token === options.existingToken.token) {
        existingLock.reentrancyCount = (existingLock.reentrancyCount || 1) + 1;
        existingLock.expiresAt = now + ttlMs;
        return existingLock;
      }

      // 2. Clean up expired lock if TTL elapsed
      if (existingLock && existingLock.expiresAt <= now) {
        this.locks.delete(key);
      }

      // 3. Acquire new lock if slot is free
      if (!this.locks.has(key)) {
        const token: LockToken = {
          key,
          token: nanoid(),
          expiresAt: now + ttlMs,
          reentrancyCount: 1,
        };
        this.locks.set(key, token);
        return token;
      }

      // 4. Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, retryIntervalMs));
    }

    return null;
  }

  public async release(lock: LockToken): Promise<boolean> {
    const current = this.locks.get(lock.key);
    if (!current || current.token !== lock.token) {
      return false;
    }

    if (current.reentrancyCount && current.reentrancyCount > 1) {
      current.reentrancyCount--;
      return true;
    }

    this.locks.delete(lock.key);
    return true;
  }

  public async extend(lock: LockToken, extensionMs: number): Promise<boolean> {
    const current = this.locks.get(lock.key);
    if (current && current.token === lock.token) {
      current.expiresAt = Date.now() + extensionMs;
      lock.expiresAt = current.expiresAt;
      return true;
    }
    return false;
  }

  public async withLock<T>(
    key: string, 
    task: (token: LockToken) => Promise<T>, 
    options?: LockOptions
  ): Promise<T> {
    const lock = await this.acquire(key, options);
    if (!lock) {
      // TASK: [Telemetry Integration] Increment lock_acquisition_timeout_total counter (Component 10)
      throw new Error(`Failed to acquire lock for key [${key}] within timeout (${options?.timeoutMs ?? 3000}ms).`);
    }

    // TASK: [Lifecycle Integration] Register active lock instance in GracefulShutdownManager (Component 11) to prevent orphaned leases on process termination

    const autoExtend = options?.autoExtend ?? true;
    const ttlMs = options?.ttlMs ?? 10000;
    const heartbeatIntervalMs = options?.heartbeatIntervalMs ?? Math.max(1000, Math.floor(ttlMs / 3));

    let watchdogTimer: NodeJS.Timeout | null = null;

    if (autoExtend) {
      watchdogTimer = setInterval(async () => {
        try {
          const extended = await this.extend(lock, ttlMs);
          if (!extended && watchdogTimer) {
            clearInterval(watchdogTimer);
          }
        } catch (err) {
          logger.error({ key, error: err }, 'MemoryLockProvider: Watchdog heartbeat failed');
        }
      }, heartbeatIntervalMs);
    }

    try {
      return await task(lock);
    } finally {
      if (watchdogTimer) {
        clearInterval(watchdogTimer);
      }
      await this.release(lock);
    }
  }
}

export const defaultLockProvider: IDistributedLockProvider = new MemoryLockProvider();
