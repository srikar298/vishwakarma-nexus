import Redis, { RedisOptions } from 'ioredis';
import { 
  IDistributedLockProvider, 
  LockOptions, 
  LockToken 
} from '../interfaces/distributed-lock.interface';
import { nanoid } from 'nanoid';
import { config } from '../../config';
import { logger } from '../../logger';

// Lua script: Releases lock atomically ONLY if the token matches the current lock owner
const RELEASE_LOCK_LUA = `
  if redis.call("get", KEYS[1]) == ARGV[1] then
    return redis.call("del", KEYS[1])
  else
    return 0
  end
`;

// Lua script: Extends lock TTL atomically ONLY if the token matches the current lock owner
const EXTEND_LOCK_LUA = `
  if redis.call("get", KEYS[1]) == ARGV[1] then
    return redis.call("pexpire", KEYS[1], ARGV[2])
  else
    return 0
  end
`;

/**
 * Low-Level Design (LLD): Production Redis Distributed Lock Provider (Redlock Pattern)
 * Provides multi-process and multi-container mutual exclusion using atomic Redis primitives.
 */
export class RedisLockProvider implements IDistributedLockProvider {
  private redis: Redis;
  private readonly prefix: string;

  constructor(redisClient?: Redis) {
    this.prefix = `${config.redis?.prefix || 'vkc:'}lock:`;

    if (redisClient) {
      this.redis = redisClient;
    } else {
      const options: RedisOptions = {
        password: config.redis?.password,
        db: config.redis?.db,
        retryStrategy: (times) => Math.min(times * 50, 2000),
        keepAlive: 10000,
      };
      this.redis = new Redis(config.redis?.url || 'redis://localhost:6379', options);
    }
  }

  private getFullKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  public async acquire(key: string, options?: LockOptions): Promise<LockToken | null> {
    const ttlMs = options?.ttlMs ?? 10000;
    const timeoutMs = options?.timeoutMs ?? 3000;
    const retryIntervalMs = options?.retryIntervalMs ?? 50;

    const fullKey = this.getFullKey(key);
    const tokenStr = options?.existingToken?.token || nanoid();
    const startTime = Date.now();

    while (Date.now() - startTime < timeoutMs) {
      // SET key token NX PX ttlMs (atomic check-and-set with expiry)
      const result = await this.redis.set(fullKey, tokenStr, 'PX', ttlMs, 'NX');

      if (result === 'OK') {
        return {
          key,
          token: tokenStr,
          expiresAt: Date.now() + ttlMs,
          reentrancyCount: 1,
        };
      }

      // Reentrancy check: If existing token matches, extend TTL and return
      if (options?.existingToken) {
        const currentOwner = await this.redis.get(fullKey);
        if (currentOwner === options.existingToken.token) {
          await this.extend(options.existingToken, ttlMs);
          options.existingToken.reentrancyCount = (options.existingToken.reentrancyCount || 1) + 1;
          return options.existingToken;
        }
      }

      // Wait with backoff jitter before retrying
      const jitter = Math.floor(Math.random() * 20);
      await new Promise((resolve) => setTimeout(resolve, retryIntervalMs + jitter));
    }

    return null;
  }

  public async release(lock: LockToken): Promise<boolean> {
    if (lock.reentrancyCount && lock.reentrancyCount > 1) {
      lock.reentrancyCount--;
      return true;
    }

    const fullKey = this.getFullKey(lock.key);
    try {
      const result = await this.redis.eval(RELEASE_LOCK_LUA, 1, fullKey, lock.token);
      return result === 1;
    } catch (err) {
      logger.error({ key: lock.key, error: (err as Error).message }, 'RedisLockProvider: Lock release failed');
      return false;
    }
  }

  public async extend(lock: LockToken, extensionMs: number): Promise<boolean> {
    const fullKey = this.getFullKey(lock.key);
    try {
      const result = await this.redis.eval(EXTEND_LOCK_LUA, 1, fullKey, lock.token, extensionMs);
      if (result === 1) {
        lock.expiresAt = Date.now() + extensionMs;
        return true;
      }
      return false;
    } catch (err) {
      logger.error({ key: lock.key, error: (err as Error).message }, 'RedisLockProvider: Lock extend failed');
      return false;
    }
  }

  public async withLock<T>(
    key: string, 
    task: (token: LockToken) => Promise<T>, 
    options?: LockOptions
  ): Promise<T> {
    const lock = await this.acquire(key, options);
    if (!lock) {
      // TASK: [Telemetry Integration] Record distributed lock timeout metric in Prometheus (Component 10)
      throw new Error(`Failed to acquire distributed lock for key [${key}] within timeout (${options?.timeoutMs ?? 3000}ms).`);
    }

    // TASK: [Lifecycle Integration] Register active distributed lease in GracefulShutdownManager (Component 11) for clean release on SIGTERM

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
          logger.error({ key, error: err }, 'RedisLockProvider: Watchdog heartbeat failed');
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
