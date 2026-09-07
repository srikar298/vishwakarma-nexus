import { ICacheProvider } from './interfaces/cache-provider.interface';
import { RedisCacheProvider } from './providers/redis-cache.provider';
import { MemoryCacheProvider } from './providers/memory-cache.provider';
import { config } from '../config';
import { logger } from '../logger';

export class CacheFactory {
  private static provider: ICacheProvider;

  public static getProvider(): ICacheProvider {
    if (!this.provider) {
      if (config.redis && config.redis.url && !process.env.USE_MEMORY_CACHE) {
        try {
          this.provider = RedisCacheProvider.getInstance();
          logger.info('CacheFactory: Using RedisCacheProvider');
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
}

export const cacheProvider = CacheFactory.getProvider();
