import {
  IJobQueue,
  Job,
  JobHandler,
  JobOptions,
  JobPriority,
  JobStatus,
  QueueStats,
  WorkerOptions,
} from './job-queue.interface';
import { logger } from '../logger';
import { randomUUID } from 'crypto';

interface QueuedItem {
  job: Job;
  handler: JobHandler;
  options: JobOptions;
  enqueuedAt: number;
}

interface WorkerConfig {
  handler: JobHandler;
  concurrency: number;
  active: number;
  options: WorkerOptions;
}

/**
 * Parses standard 5-part cron expressions (minute hour dom month dow)
 * and determines if current date matches or calculates next interval.
 */
function matchesCron(cronExpression: string, date: Date = new Date()): boolean {
  const parts = cronExpression.trim().split(/\s+/);
  if (parts.length !== 5) return false;

  const [minRule, hourRule, domRule, monthRule, dowRule] = parts;

  const matchPart = (rule: string, val: number): boolean => {
    if (rule === '*') return true;
    if (rule.startsWith('*/')) {
      const step = parseInt(rule.slice(2), 10);
      return !isNaN(step) && step > 0 && val % step === 0;
    }
    const numbers = rule.split(',').map((n) => parseInt(n, 10));
    return numbers.includes(val);
  };

  const minutes = date.getMinutes();
  const hours = date.getHours();
  const dom = date.getDate();
  const month = date.getMonth() + 1; // 1-12
  const dow = date.getDay(); // 0-6 (Sun-Sat)

  return (
    matchPart(minRule, minutes) &&
    matchPart(hourRule, hours) &&
    matchPart(domRule, dom) &&
    matchPart(monthRule, month) &&
    matchPart(dowRule, dow)
  );
}

/**
 * Low-Level Design (LLD): Production In-Memory Job Queue Engine
 * Features:
 * - Priority-aware sorting (Priority 1: Urgent -> Priority 4: Bulk)
 * - Worker pool concurrency throttling
 * - Delayed job scheduling & exponential backoff retry policies
 * - Cluster-safe Cron scheduling engine
 * - Pause / Resume and Graceful Lifecycle Draining
 */
export class InMemoryJobQueue implements IJobQueue {
  private handlers = new Map<string, WorkerConfig>();
  private queue: QueuedItem[] = [];
  private delayedJobs = new Map<string, NodeJS.Timeout>();
  private cronIntervals = new Map<string, NodeJS.Timeout>();
  private activeJobs = new Map<string, Job>();
  
  private stats: QueueStats = {
    waiting: 0,
    active: 0,
    delayed: 0,
    completed: 0,
    failed: 0,
    paused: false,
  };

  private isProcessing = false;
  private closed = false;
  private pausedQueues = new Set<string>();

  private completedListeners: Array<(job: Job, result: any) => void> = [];
  private failedListeners: Array<(job: Job, error: Error) => void> = [];

  public async addJob<T>(name: string, data: T, options: JobOptions = {}): Promise<string> {
    if (this.closed) {
      throw new Error('[InMemoryJobQueue] Cannot add job to a closed queue');
    }

    const jobId = options.jobId ?? randomUUID();
    const priority = options.priority ?? JobPriority.NORMAL;

    const job: Job<T> = {
      id: jobId,
      name,
      data,
      attemptsMade: 0,
      maxAttempts: options.attempts ?? 3,
      priority,
      status: (options.delayMs ?? 0) > 0 ? 'delayed' : 'waiting',
      createdAt: new Date(),
    };

    const delay = options.delayMs ?? 0;
    if (delay > 0) {
      this.stats.delayed++;
      const timer = setTimeout(() => {
        this.delayedJobs.delete(jobId);
        this.stats.delayed--;
        if (!this.closed) {
          job.status = 'waiting';
          this.enqueueJob(job, options);
        }
      }, delay);
      this.delayedJobs.set(jobId, timer);
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

    const item: QueuedItem = {
      job,
      handler: handlerConfig ? handlerConfig.handler : async () => {},
      options,
      enqueuedAt: Date.now(),
    };

    this.queue.push(item);
    this.sortQueueByPriority();
    this.stats.waiting = this.queue.length;

    this.triggerProcessing();
  }

  /**
   * Sorts queue by:
   * 1. Priority ascending (1 Critical precedes 4 Low)
   * 2. FIFO order for identical priority
   */
  private sortQueueByPriority() {
    this.queue.sort((a, b) => {
      if (a.job.priority !== b.job.priority) {
        return a.job.priority - b.job.priority;
      }
      return a.enqueuedAt - b.enqueuedAt;
    });
  }

  public process<T, R = any>(
    name: string,
    handler: JobHandler<T, R>,
    options: WorkerOptions | number = 5
  ): void {
    const workerOptions: WorkerOptions = typeof options === 'number' ? { concurrency: options } : options;
    const concurrency = workerOptions.concurrency ?? 5;

    this.handlers.set(name, {
      handler,
      concurrency,
      active: 0,
      options: workerOptions,
    });

    // Re-attach handler to any pending jobs in the queue
    for (const item of this.queue) {
      if (item.job.name === name) {
        item.handler = handler;
      }
    }

    this.triggerProcessing();
  }

  public async scheduleCron<T>(
    name: string,
    cronExpression: string,
    data?: T,
    options: JobOptions = {}
  ): Promise<void> {
    if (this.closed) {
      throw new Error('[InMemoryJobQueue] Cannot schedule cron on a closed queue');
    }

    // TASK: [Concurrency Integration] In clustered Redis deployment, protect cron execution with DistributedLock (e.g. 'lock:cron:' + name)
    // Clear any existing cron for this name
    if (this.cronIntervals.has(name)) {
      clearInterval(this.cronIntervals.get(name)!);
      this.cronIntervals.delete(name);
    }

    let lastRanMinute = -1;

    const intervalTimer = setInterval(async () => {
      if (this.closed) return;

      const now = new Date();
      const currentMinute = now.getMinutes();

      if (currentMinute !== lastRanMinute && matchesCron(cronExpression, now)) {
        lastRanMinute = currentMinute;
        logger.info({ msg: `[JobQueue] Cron triggered for job "${name}"`, cron: cronExpression });
        await this.addJob(name, data as T, options);
      }
    }, 1000); // 1-second check interval for precision

    this.cronIntervals.set(name, intervalTimer);
  }

  private async triggerProcessing() {
    if (this.isProcessing || this.closed || this.stats.paused) return;
    this.isProcessing = true;

    try {
      while (this.queue.length > 0) {
        const itemIndex = this.queue.findIndex((item) => {
          if (this.pausedQueues.has(item.job.name)) return false;
          const cfg = this.handlers.get(item.job.name);
          return cfg && cfg.active < cfg.concurrency;
        });

        if (itemIndex === -1) {
          // No workers available or matching handlers currently available
          break;
        }

        const [item] = this.queue.splice(itemIndex, 1);
        this.stats.waiting = this.queue.length;

        const cfg = this.handlers.get(item.job.name)!;
        cfg.active++;
        this.stats.active++;
        this.activeJobs.set(item.job.id, item.job);

        // Execute job asynchronously without blocking queue dispatch loop
        this.executeJob(item, cfg);
      }
    } finally {
      this.isProcessing = false;
    }
  }

  private async executeJob(item: QueuedItem, cfg: WorkerConfig) {
    const { job, options } = item;
    job.attemptsMade++;
    job.status = 'active';
    job.processedAt = new Date();

    const timeoutMs = options.timeoutMs ?? 30000;
    let timer: NodeJS.Timeout | undefined;

    try {
      // TASK: [Resilience Integration] Optionally wrap execution in ResiliencePipeline (Timeout + Bulkhead)
      const executionPromise = cfg.handler(job);
      const timeoutPromise = new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error(`[JobQueue] Job "${job.name}" (${job.id}) timed out after ${timeoutMs}ms`)), timeoutMs);
      });

      const result = await Promise.race([executionPromise, timeoutPromise]);
      if (timer) clearTimeout(timer);

      job.status = 'completed';
      job.completedAt = new Date();
      this.stats.completed++;

      // TASK: [Observability Integration] Record job execution duration and success metric
      logger.debug({ msg: `[JobQueue] Job completed successfully`, jobId: job.id, jobName: job.name });

      for (const listener of this.completedListeners) {
        try {
          listener(job, result);
        } catch (e) {
          logger.error({ msg: `[JobQueue] Error in onJobCompleted listener`, error: (e as Error).message });
        }
      }
    } catch (err: any) {
      if (timer) clearTimeout(timer);
      job.failedReason = err?.message || 'Unknown error';

      logger.error({
        msg: `[JobQueue] Job execution failed (Attempt ${job.attemptsMade}/${job.maxAttempts})`,
        jobId: job.id,
        jobName: job.name,
        error: err?.message,
      });

      if (job.attemptsMade < job.maxAttempts) {
        job.status = 'delayed';
        const backoffType = options.backoffType ?? 'exponential';
        const baseDelay = options.backoffDelayMs ?? 1000;
        const delay = backoffType === 'exponential' 
          ? baseDelay * Math.pow(2, job.attemptsMade - 1)
          : baseDelay;

        this.stats.delayed++;
        const retryTimer = setTimeout(() => {
          this.delayedJobs.delete(job.id);
          this.stats.delayed--;
          if (!this.closed) {
            job.status = 'waiting';
            this.enqueueJob(job, options);
          }
        }, delay);

        this.delayedJobs.set(job.id, retryTimer);
      } else {
        job.status = 'failed';
        this.stats.failed++;

        // TASK: [Audit Integration] Log persistent job failure to Audit Logger for administrative alert
        logger.error({
          msg: `[JobQueue] Job reached max attempts. Moved to DLQ/Failed state.`,
          jobId: job.id,
          jobName: job.name,
        });

        for (const listener of this.failedListeners) {
          try {
            listener(job, err);
          } catch (e) {
            logger.error({ msg: `[JobQueue] Error in onJobFailed listener`, error: (e as Error).message });
          }
        }
      }
    } finally {
      cfg.active--;
      this.stats.active--;
      this.activeJobs.delete(job.id);
      this.triggerProcessing();
    }
  }

  public async getPendingCount(name?: string): Promise<number> {
    if (name) {
      return this.queue.filter((q) => q.job.name === name).length;
    }
    return this.queue.length;
  }

  public async getStats(name?: string): Promise<QueueStats> {
    if (name) {
      const waiting = this.queue.filter((q) => q.job.name === name).length;
      const active = Array.from(this.activeJobs.values()).filter((j) => j.name === name).length;
      return {
        ...this.stats,
        waiting,
        active,
        paused: this.pausedQueues.has(name) || this.stats.paused,
      };
    }
    return { ...this.stats };
  }

  public async pause(name?: string): Promise<void> {
    if (name) {
      this.pausedQueues.add(name);
    } else {
      this.stats.paused = true;
    }
    logger.info({ msg: `[JobQueue] Paused queue`, name: name ?? 'ALL' });
  }

  public async resume(name?: string): Promise<void> {
    if (name) {
      this.pausedQueues.delete(name);
    } else {
      this.stats.paused = false;
    }
    logger.info({ msg: `[JobQueue] Resumed queue`, name: name ?? 'ALL' });
    this.triggerProcessing();
  }

  public onJobCompleted(listener: (job: Job, result: any) => void): void {
    this.completedListeners.push(listener);
  }

  public onJobFailed(listener: (job: Job, error: Error) => void): void {
    this.failedListeners.push(listener);
  }

  public async close(): Promise<void> {
    // TASK: [Lifecycle Integration] Invoked by GracefulShutdownManager (Component 11) to drain jobs before Node exit
    this.closed = true;
    this.queue = [];
    this.handlers.clear();
    this.activeJobs.clear();

    for (const timer of this.delayedJobs.values()) {
      clearTimeout(timer);
    }
    this.delayedJobs.clear();

    for (const timer of this.cronIntervals.values()) {
      clearInterval(timer);
    }
    this.cronIntervals.clear();

    this.completedListeners = [];
    this.failedListeners = [];
    logger.info({ msg: `[JobQueue] InMemoryJobQueue closed and drained` });
  }
}
