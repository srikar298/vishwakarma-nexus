import { ICacheProvider, CacheOptions } from '../interfaces/cache-provider.interface';
import { MemoryCacheProvider } from './memory-cache.provider';
import { getOrSetWithStampedeGuard } from '../cache-aside';
import { logger } from '../../logger';

/**
 * Low-Level Design (LLD): Two-Tier Hybrid Cache Provider (L1 Memory + L2 Redis)
 * Delivers sub-microsecond in-memory reads while maintaining cluster-wide consistency via Redis L2.
 */
export class HybridCacheProvider implements ICacheProvider {
  private l1: MemoryCacheProvider; // Local In-Memory LRU
  private l2: ICacheProvider;       // Distributed Redis

  constructor(l2Provider: ICacheProvider, l1Options: { maxEntries?: number } = {}) {
    this.l1 = new MemoryCacheProvider(l1Options);
    this.l2 = l2Provider;
  }

  public async get<T>(key: string): Promise<T | null> {
    // 1. L1 Fast Path (<0.1ms)
    const l1Value = await this.l1.get<T>(key);
    if (l1Value !== null && l1Value !== undefined) {
      // TASK: [Telemetry Integration] Increment hybrid_cache_l1_hit_total counter
      return l1Value;
    }

    // 2. L2 Distributed Path (~1.5ms)
    const l2Value = await this.l2.get<T>(key);
    if (l2Value !== null && l2Value !== undefined) {
      // TASK: [Telemetry Integration] Increment hybrid_cache_l2_hit_total counter
      // Backfill L1 with a short default local TTL (e.g. 60 seconds) to prevent stale drift
      await this.l1.set(key, l2Value, { ttlSeconds: 60 });
      return l2Value;
    }

    return null;
  }

  public async set(key: string, value: any, options?: CacheOptions | number): Promise<void> {
    // Write to both L1 and L2
    await Promise.all([
      this.l1.set(key, value, options),
      this.l2.set(key, value, options),
    ]);
  }

  public async delete(key: string): Promise<void> {
    await Promise.all([
      this.l1.delete(key),
      this.l2.delete(key),
    ]);
  }

  public async exists(key: string): Promise<boolean> {
    const inL1 = await this.l1.exists(key);
    if (inL1) return true;
    return this.l2.exists(key);
  }

  public async getOrSet<T>(
    key: string, 
    fetcher: () => Promise<T>, 
    options?: CacheOptions | number
  ): Promise<T> {
    return getOrSetWithStampedeGuard(this, key, fetcher, options);
  }

  public async invalidateByTag(tag: string): Promise<number> {
    const [, l2Count] = await Promise.all([
      this.l1.invalidateByTag(tag),
      this.l2.invalidateByTag(tag),
    ]);
    return l2Count;
  }

  public async invalidateByTags(tags: string[]): Promise<number> {
    const [, l2Count] = await Promise.all([
      this.l1.invalidateByTags(tags),
      this.l2.invalidateByTags(tags),
    ]);
    return l2Count;
  }

  public async invalidateByPattern(pattern: string): Promise<number> {
    const [, l2Count] = await Promise.all([
      this.l1.invalidateByPattern(pattern),
      this.l2.invalidateByPattern(pattern),
    ]);
    return l2Count;
  }

  public async addToSet(key: string, member: string): Promise<void> {
    await this.l2.addToSet(key, member);
  }

  public async removeFromSet(key: string, member: string): Promise<void> {
    await this.l2.removeFromSet(key, member);
  }

  public async getSet(key: string): Promise<string[]> {
    return this.l2.getSet(key);
  }

  public async expire(key: string, ttlSeconds: number): Promise<boolean | void> {
    await Promise.all([
      this.l1.expire(key, ttlSeconds),
      this.l2.expire(key, ttlSeconds),
    ]);
  }
}
