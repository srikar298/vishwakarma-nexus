import { ICacheProvider } from './interfaces/cache-provider.interface';
import { RedisCacheProvider } from './providers/redis-cache.provider';
import { MemoryCacheProvider } from './providers/memory-cache.provider';
import { HybridCacheProvider } from './providers/hybrid-cache.provider';
import { config } from '../config';
import { logger } from '../logger';

/**
 * Low-Level Design (LLD): Cache Factory
 * Provides production HybridCache (L1 Memory + L2 Redis) or MemoryCache dynamically based on configuration.
 */
export class CacheFactory {
  private static provider: ICacheProvider;

  public static getProvider(useHybrid = true): ICacheProvider {
    if (!this.provider) {
      if (config.redis?.url && !process.env.USE_MEMORY_CACHE && process.env.NODE_ENV !== 'test') {
        try {
          const redisProvider = RedisCacheProvider.getInstance();
          if (useHybrid) {
            this.provider = new HybridCacheProvider(redisProvider);
            logger.info('CacheFactory: Initialized HybridCacheProvider (L1 Memory LRU + L2 Redis)');
          } else {
            this.provider = redisProvider;
            logger.info('CacheFactory: Initialized RedisCacheProvider');
          }
        } catch (err: any) {
          logger.warn({ error: err.message }, 'CacheFactory: Redis failed to initialize. Falling back to MemoryCacheProvider');
          this.provider = new MemoryCacheProvider();
        }
      } else {
        logger.info('CacheFactory: Initializing MemoryCacheProvider');
        this.provider = new MemoryCacheProvider();
      }
    }
    return this.provider;
  }

  public static setProvider(provider: ICacheProvider): void {
    this.provider = provider;
  }
}

export const cacheProvider = CacheFactory.getProvider();
