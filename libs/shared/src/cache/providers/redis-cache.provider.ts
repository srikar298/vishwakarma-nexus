import Redis, { RedisOptions } from 'ioredis';
import { ICacheProvider, IAtomicProvider, CacheOptions } from '../interfaces/cache-provider.interface';
import { getOrSetWithStampedeGuard } from '../cache-aside';
import { config } from '../../config';
import { logger } from '../../logger';

// Lua script: Atomic Invalidation of all keys tracked under a tag Set
const INVALIDATE_TAG_LUA = `
  local tagKey = KEYS[1]
  local members = redis.call('SMEMBERS', tagKey)
  local count = 0
  if #members > 0 then
    for i, key in ipairs(members) do
      redis.call('DEL', key)
      count = count + 1
    end
    redis.call('DEL', tagKey)
  end
  return count
`;

/**
 * Low-Level Design (LLD): Production Redis Cache Provider
 * Features: Jittered TTL, Tag-Based Invalidation via Redis Sets, and Cache Stampede protection.
 */
export class RedisCacheProvider implements ICacheProvider, IAtomicProvider {
  private static instance: RedisCacheProvider;
  private redis: Redis;
  private readonly prefix: string;

  public constructor(redisClient?: Redis) {
    this.prefix = config.redis?.prefix || 'vkc:';

    if (redisClient) {
      this.redis = redisClient;
    } else {
      const options: RedisOptions = {
        password: config.redis?.password,
        db: config.redis?.db,
        retryStrategy: (times: number) => Math.min(times * 50, 2000),
        keepAlive: 10000,
      };

      this.redis = new Redis(config.redis?.url || 'redis://localhost:6379', options);

      this.redis.on('error', (err) => {
        logger.error({ error: err.message }, 'Redis Connection Error');
      });

      this.redis.on('connect', () => {
        logger.info('Connected to Redis');
      });
    }
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

  private getTagKey(tag: string): string {
    return `${this.prefix}tag:${tag}`;
  }

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

  public async set(key: string, value: any, options?: CacheOptions | number): Promise<void> {
    const fullKey = this.getFullKey(key);
    const data = JSON.stringify(value);

    const ttlSeconds = typeof options === 'number' ? options : options?.ttlSeconds;
    const tags = typeof options === 'object' ? options?.tags : undefined;

    const pipeline = this.redis.pipeline();

    if (ttlSeconds) {
      const jitteredTtl = this.getJitteredTtl(ttlSeconds);
      pipeline.set(fullKey, data, 'EX', jitteredTtl);
    } else {
      pipeline.set(fullKey, data);
    }

    // Register key in Redis Tag Sets
    if (tags && tags.length > 0) {
      for (const tag of tags) {
        const tagKey = this.getTagKey(tag);
        pipeline.sadd(tagKey, fullKey);
        if (ttlSeconds) {
          // Keep tag index alive slightly longer than key TTL
          pipeline.expire(tagKey, ttlSeconds + 3600);
        }
      }
    }

    await pipeline.exec();
  }

  public async delete(key: string): Promise<void> {
    await this.redis.del(this.getFullKey(key));
  }

  public async exists(key: string): Promise<boolean> {
    const count = await this.redis.exists(this.getFullKey(key));
    return count > 0;
  }

  public async getOrSet<T>(
    key: string, 
    fetcher: () => Promise<T>, 
    options?: CacheOptions | number
  ): Promise<T> {
    return getOrSetWithStampedeGuard(this, key, fetcher, options);
  }

  public async invalidateByTag(tag: string): Promise<number> {
    const tagKey = this.getTagKey(tag);
    try {
      const count = await this.executeLua<number>(INVALIDATE_TAG_LUA, [tagKey], []);
      return count || 0;
    } catch (err) {
      logger.error({ tag, error: (err as Error).message }, 'Redis InvalidateByTag Error');
      return 0;
    }
  }

  public async invalidateByTags(tags: string[]): Promise<number> {
    let count = 0;
    for (const tag of tags) {
      count += await this.invalidateByTag(tag);
    }
    return count;
  }

  public async invalidateByPattern(pattern: string): Promise<number> {
    const fullPattern = this.getFullKey(pattern);
    let cursor = '0';
    let count = 0;

    do {
      const [nextCursor, keys] = await this.redis.scan(cursor, 'MATCH', fullPattern, 'COUNT', 100);
      cursor = nextCursor;

      if (keys.length > 0) {
        await this.redis.del(...keys);
        count += keys.length;
      }
    } while (cursor !== '0');

    return count;
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

  public async expire(key: string, ttlSeconds: number): Promise<boolean> {
    const res = await this.redis.expire(this.getFullKey(key), ttlSeconds);
    return res === 1;
  }

  // --- IAtomicProvider ---

  public async increment(key: string, ttlSeconds: number): Promise<number> {
    const fullKey = this.getFullKey(key);
    
    // Atomic INCR + EXPIRE in one Lua script
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

  public async disconnect(): Promise<void> {
    // TASK: [Lifecycle Integration] Register redis.quit() in GracefulShutdownManager (Component 11) for zero-downtime draining
    await this.redis.quit();
  }
}

export const redisCacheProvider = RedisCacheProvider.getInstance;
