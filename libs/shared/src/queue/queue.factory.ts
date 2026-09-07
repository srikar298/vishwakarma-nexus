import { IJobQueue } from './job-queue.interface';
import { InMemoryJobQueue } from './memory-job-queue';
import { config } from '../config';
import { logger } from '../logger';

/**
 * Low-Level Design (LLD): Job Queue Factory
 * Automatically falls back to In-Memory Queue during development, testing,
 * or when Redis is not configured.
 */
export class QueueFactory {
  private static instance: IJobQueue | null = null;

  public static getQueue(): IJobQueue {
    if (!this.instance) {
      // Default to In-Memory for lean setups without Redis dependencies
      logger.info({ msg: `[QueueFactory] Initializing In-Memory Job Queue` });
      this.instance = new InMemoryJobQueue();
    }
    return this.instance;
  }

  public static setQueue(queue: IJobQueue): void {
    this.instance = queue;
  }
}

export const defaultJobQueue = QueueFactory.getQueue();
