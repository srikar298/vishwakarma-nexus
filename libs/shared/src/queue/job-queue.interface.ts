/**
 * Low-Level Design (LLD): Comprehensive Background Worker & Job Queue Interface
 * 
 * Supports:
 * - Priority-based job scheduling (Priority 1: Urgent OTP -> Priority 4: Low bulk)
 * - Delayed job execution and exponential backoff retries
 * - Concurrency throttling per job type
 * - Distributed Cron scheduling protected by Distributed Locks
 * - Queue pause/resume and worker lifecycle draining
 */

export enum JobPriority {
  CRITICAL = 1,
  HIGH = 2,
  NORMAL = 3,
  LOW = 4,
}

export type JobStatus = 'waiting' | 'delayed' | 'active' | 'completed' | 'failed' | 'paused';

export interface JobOptions {
  /**
   * Maximum retry attempts before routing to Dead Letter Queue (DLQ).
   * Default: 3
   */
  attempts?: number;
  /**
   * Initial delay in milliseconds before the job becomes eligible for processing.
   */
  delayMs?: number;
  /**
   * Base backoff delay in milliseconds between retry attempts.
   * Default: 1000ms
   */
  backoffDelayMs?: number;
  /**
   * Backoff strategy: 'exponential' or 'fixed'.
   * Default: 'exponential'
   */
  backoffType?: 'exponential' | 'fixed';
  /**
   * Job priority score (1: Critical, 2: High, 3: Normal, 4: Low).
   * Lower numeric value indicates higher execution priority.
   * Default: JobPriority.NORMAL (3)
   */
  priority?: JobPriority | number;
  /**
   * Maximum execution timeout in milliseconds before job is marked as timed out.
   */
  timeoutMs?: number;
  /**
   * Whether to remove job data from history immediately upon successful completion.
   */
  removeOnComplete?: boolean | number;
  /**
   * Whether to remove job data upon final failure.
   */
  removeOnFail?: boolean | number;
  /**
   * Optional deterministic job identifier for deduplication.
   */
  jobId?: string;
}

export interface WorkerOptions {
  /**
   * Maximum number of concurrent jobs processed simultaneously by this worker.
   * Default: 5
   */
  concurrency?: number;
  /**
   * Rate limiter settings for outbound API compliance (e.g. max 50 SMS/sec).
   */
  limiter?: {
    max: number;
    durationMs: number;
  };
  /**
   * Distributed lock heartbeat/lease duration in milliseconds for active jobs.
   */
  lockDurationMs?: number;
}

export interface Job<T = any> {
  id: string;
  name: string;
  data: T;
  attemptsMade: number;
  maxAttempts: number;
  priority: number;
  createdAt: Date;
  processedAt?: Date;
  completedAt?: Date;
  failedReason?: string;
  status: JobStatus;
  progress?: number;
}

export interface QueueStats {
  waiting: number;
  active: number;
  delayed: number;
  completed: number;
  failed: number;
  paused: boolean;
}

export type JobHandler<T = any, R = any> = (job: Job<T>) => Promise<R>;

export interface IJobQueue {
  /**
   * Enqueues a new background job with optional priority, delay, and retry configuration.
   */
  addJob<T>(name: string, data: T, options?: JobOptions): Promise<string>;

  /**
   * Registers a worker handler for a specific job name with custom concurrency limits.
   */
  process<T, R = any>(name: string, handler: JobHandler<T, R>, options?: WorkerOptions | number): void;

  /**
   * Schedules a recurring cron job across the cluster.
   * Execution must be guarded by DistributedLock to prevent duplicate runs across nodes.
   */
  scheduleCron<T>(name: string, cronExpression: string, data?: T, options?: JobOptions): Promise<void>;

  /**
   * Returns total pending (waiting + delayed) job count for a queue name or across all queues.
   */
  getPendingCount(name?: string): Promise<number>;

  /**
   * Retrieves detailed metrics and state statistics for monitoring and health diagnostics.
   */
  getStats(name?: string): Promise<QueueStats>;

  /**
   * Pauses queue processing (in-flight jobs finish, pending jobs remain queued).
   */
  pause(name?: string): Promise<void>;

  /**
   * Resumes queue processing for a paused queue.
   */
  resume(name?: string): Promise<void>;

  /**
   * Gracefully shuts down workers, drains active jobs, and clears intervals.
   */
  close(): Promise<void>;

  /**
   * Event listener hooks for observability, metrics, and DLQ handling.
   */
  onJobCompleted?(listener: (job: Job, result: any) => void): void;
  onJobFailed?(listener: (job: Job, error: Error) => void): void;
}
