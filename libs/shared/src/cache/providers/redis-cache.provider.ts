import Redis, { RedisOptions } from 'ioredis';
import { ICacheProvider, IAtomicProvider } from '../interfaces/cache-provider.interface';
import { config } from '../../config';
import { logger } from '../../logger';

/**
 * LLD: Redis Cache Provider Implementation
 * Implements Singleton Pattern for connection management and Strategy Pattern for caching policies.
 */
export class RedisCacheProvider implements ICacheProvider, IAtomicProvider {
  private static instance: RedisCacheProvider;
  private redis: Redis;
  private readonly prefix: string;

  private constructor() {
    this.prefix = config.redis.prefix || 'vkc:';
    
    const options: RedisOptions = {
      password: config.redis.password,
      db: config.redis.db,
      // resilience: exponential backoff
      retryStrategy: (times: number) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      // Keep-alive settings
      keepAlive: 10000,
    };

    this.redis = new Redis(config.redis.url, options);

    this.redis.on('error', (err) => {
      logger.error({ error: err.message }, 'Redis Connection Error');
    });

    this.redis.on('connect', () => {
      logger.info('Connected to Redis');
    });
  }

  public static getInstance(): RedisCacheProvider {
    if (!RedisCacheProvider.instance) {
      RedisCacheProvider.instance = new RedisCacheProvider();
    }
    return RedisCacheProvider.instance;
  }

  private getFullKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  /**
   * Enterprise Implementation: Jittered TTL
   * Prevents "Cache Avalanche" by adding ±10% variation to expiration times.
   */
  private getJitteredTtl(ttlSeconds: number): number {
    const jitterFactor = 0.1; // 10%
    const jitter = Math.floor(Math.random() * (ttlSeconds * jitterFactor));
    return Math.random() > 0.5 ? ttlSeconds + jitter : ttlSeconds - jitter;
  }

  // --- ICacheProvider ---

  public async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(this.getFullKey(key));
    if (!data) return null;

    try {
      return JSON.parse(data) as T;
    } catch (err) {
      logger.error({ key, error: (err as Error).message }, 'Redis Deserialization Error');
      return null;
    }
  }

  public async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    const fullKey = this.getFullKey(key);
    const data = JSON.stringify(value);

    if (ttlSeconds) {
      const jitteredTtl = this.getJitteredTtl(ttlSeconds);
      await this.redis.set(fullKey, data, 'EX', jitteredTtl);
    } else {
      await this.redis.set(fullKey, data);
    }
  }

  public async delete(key: string): Promise<void> {
    await this.redis.del(this.getFullKey(key));
  }

  public async exists(key: string): Promise<boolean> {
    const count = await this.redis.exists(this.getFullKey(key));
    return count > 0;
  }

  public async addToSet(key: string, member: string): Promise<void> {
    await this.redis.sadd(this.getFullKey(key), member);
  }

  public async removeFromSet(key: string, member: string): Promise<void> {
    await this.redis.srem(this.getFullKey(key), member);
  }

  public async getSet(key: string): Promise<string[]> {
    return await this.redis.smembers(this.getFullKey(key));
  }

  public async expire(key: string, ttlSeconds: number): Promise<void> {
    await this.redis.expire(this.getFullKey(key), ttlSeconds);
  }

  // --- IAtomicProvider ---

  public async increment(key: string, ttlSeconds: number): Promise<number> {
    const fullKey = this.getFullKey(key);
    
    // Atomic INCR + EXPIRE in one Lua roundtrip to prevent orphaned keys without TTL
    const luaScript = `
      local current = redis.call('INCR', KEYS[1])
      if current == 1 then
        redis.call('EXPIRE', KEYS[1], ARGV[1])
      end
      return current
    `;

    return this.executeLua<number>(luaScript, [fullKey], [ttlSeconds]);
  }

  public async executeLua<T>(script: string, keys: string[], args: any[]): Promise<T> {
    try {
      return await this.redis.eval(script, keys.length, ...keys, ...args) as T;
    } catch (err) {
      logger.error({ error: (err as Error).message }, 'Redis Lua Execution Error');
      throw err;
    }
  }

  /**
   * Graceful Shutdown
   */
  public async disconnect(): Promise<void> {
    await this.redis.quit();
  }
}

// Export a singleton instance by default
export const redisCacheProvider = RedisCacheProvider.getInstance;
