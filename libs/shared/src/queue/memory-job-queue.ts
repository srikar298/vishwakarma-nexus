import { IJobQueue, Job, JobHandler, JobOptions } from './job-queue.interface';
import { logger } from '../logger';
import { randomUUID } from 'crypto';

interface QueuedItem {
  job: Job;
  handler: JobHandler;
  options: JobOptions;
}

/**
 * In-Memory Asynchronous Job Queue Implementation.
 * Provides delayed scheduling, retry with backoff, and worker concurrency limits.
 */
export class InMemoryJobQueue implements IJobQueue {
  private handlers = new Map<string, { handler: JobHandler; concurrency: number; active: number }>();
  private queue: QueuedItem[] = [];
  private isProcessing = false;
  private closed = false;

  public async addJob<T>(name: string, data: T, options: JobOptions = {}): Promise<string> {
    if (this.closed) {
      throw new Error('[InMemoryJobQueue] Cannot add job to a closed queue');
    }

    const jobId = randomUUID();
    const job: Job<T> = {
      id: jobId,
      name,
      data,
      attemptsMade: 0,
      maxAttempts: options.attempts ?? 3,
      createdAt: new Date(),
    };

    const delay = options.delayMs ?? 0;
    if (delay > 0) {
      setTimeout(() => {
        if (!this.closed) {
          this.enqueueJob(job, options);
        }
      }, delay);
    } else {
      this.enqueueJob(job, options);
    }

    return jobId;
  }

  private enqueueJob(job: Job, options: JobOptions) {
    const handlerConfig = this.handlers.get(job.name);
    if (!handlerConfig) {
      logger.warn({ msg: `[JobQueue] No worker registered for job "${job.name}". Job queued.` });
    }

    this.queue.push({
      job,
      handler: handlerConfig ? handlerConfig.handler : async () => {},
      options,
    });

    this.triggerProcessing();
  }

  public process<T, R = any>(name: string, handler: JobHandler<T, R>, concurrency = 5): void {
    this.handlers.set(name, {
      handler,
      concurrency,
      active: 0,
    });

    // Re-attach handler to any existing queued jobs
    for (const item of this.queue) {
      if (item.job.name === name) {
        item.handler = handler;
      }
    }

    this.triggerProcessing();
  }

  private async triggerProcessing() {
    if (this.isProcessing || this.closed) return;
    this.isProcessing = true;

    try {
      while (this.queue.length > 0) {
        const itemIndex = this.queue.findIndex((item) => {
          const cfg = this.handlers.get(item.job.name);
          return cfg && cfg.active < cfg.concurrency;
        });

        if (itemIndex === -1) {
          // No workers available or no matching registered handlers ready
          break;
        }

        const [item] = this.queue.splice(itemIndex, 1);
        const cfg = this.handlers.get(item.job.name)!;
        cfg.active++;

        this.executeJob(item, cfg);
      }
    } finally {
      this.isProcessing = false;
    }
  }

  private async executeJob(item: QueuedItem, cfg: { handler: JobHandler; concurrency: number; active: number }) {
    const { job, options } = item;
    job.attemptsMade++;

    try {
      await cfg.handler(job);
      logger.debug({ msg: `[JobQueue] Job completed successfully`, jobId: job.id, jobName: job.name });
    } catch (err: any) {
      logger.error({
        msg: `[JobQueue] Job execution failed (Attempt ${job.attemptsMade}/${job.maxAttempts})`,
        jobId: job.id,
        jobName: job.name,
        error: err?.message,
      });

      if (job.attemptsMade < job.maxAttempts) {
        const backoff = (options.backoffDelayMs ?? 1000) * Math.pow(2, job.attemptsMade - 1);
        setTimeout(() => {
          if (!this.closed) {
            this.queue.push(item);
            this.triggerProcessing();
          }
        }, backoff);
      } else {
        logger.error({
          msg: `[JobQueue] Job reached max attempts. Moved to DLQ/Failed.`,
          jobId: job.id,
          jobName: job.name,
        });
      }
    } finally {
      cfg.active--;
      this.triggerProcessing();
    }
  }

  public async getPendingCount(name?: string): Promise<number> {
    if (name) {
      return this.queue.filter((q) => q.job.name === name).length;
    }
    return this.queue.length;
  }

  public async close(): Promise<void> {
    this.closed = true;
    this.queue = [];
    this.handlers.clear();
  }
}
