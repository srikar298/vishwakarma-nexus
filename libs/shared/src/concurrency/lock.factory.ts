import { IDistributedLockProvider } from './interfaces/distributed-lock.interface';
import { MemoryLockProvider } from './providers/memory-lock.provider';
import { RedisLockProvider } from './providers/redis-lock.provider';
import { config } from '../config';
import { logger } from '../logger';

/**
 * Low-Level Design (LLD): Distributed Lock Factory
 * Dynamically provides RedisLockProvider for distributed production environments
 * and MemoryLockProvider for single-box/test environments.
 */
export class LockFactory {
  private static instance: IDistributedLockProvider;

  public static getProvider(): IDistributedLockProvider {
    if (!this.instance) {
      if (config.redis?.url && !process.env.USE_MEMORY_CACHE && process.env.NODE_ENV !== 'test') {
        try {
          this.instance = new RedisLockProvider();
          logger.info('LockFactory: Using RedisLockProvider');
        } catch (err: any) {
          logger.warn({ error: err.message }, 'LockFactory: Redis initialization failed. Falling back to MemoryLockProvider');
          this.instance = new MemoryLockProvider();
        }
      } else {
        logger.info('LockFactory: Initializing MemoryLockProvider');
        this.instance = new MemoryLockProvider();
      }
    }

    return this.instance;
  }

  public static setProvider(provider: IDistributedLockProvider): void {
    this.instance = provider;
  }
}

export const lockProvider = LockFactory.getProvider();
