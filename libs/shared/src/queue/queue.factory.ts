import { IJobQueue } from './job-queue.interface';
import { InMemoryJobQueue } from './memory-job-queue';
import { RedisJobQueue } from './redis-job-queue';
import { config } from '../config';
import { logger } from '../logger';

/**
 * Low-Level Design (LLD): Job Queue Factory
 * Automatically switches to Redis Distributed Queue when Redis is configured,
 * or falls back safely to In-Memory Queue during development and testing.
 */
export class QueueFactory {
  private static instance: IJobQueue | null = null;

  public static getQueue(): IJobQueue {
    if (!this.instance) {
      if (process.env.NODE_ENV !== 'test' && config.redis?.url) {
        logger.info({ msg: `[QueueFactory] Initializing Redis Distributed Job Queue` });
        this.instance = RedisJobQueue.getInstance();
      } else {
        logger.info({ msg: `[QueueFactory] Initializing In-Memory Job Queue` });
        this.instance = new InMemoryJobQueue();
      }
    }
    return this.instance;
  }

  public static setQueue(queue: IJobQueue): void {
    this.instance = queue;
  }

  public static reset(): void {
    this.instance = null;
  }
}

export const defaultJobQueue = QueueFactory.getQueue();
