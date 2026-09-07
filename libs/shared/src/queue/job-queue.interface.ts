export interface JobOptions {
  attempts?: number;
  delayMs?: number;
  backoffDelayMs?: number;
  priority?: number;
  removeOnComplete?: boolean;
}

export interface Job<T = any> {
  id: string;
  name: string;
  data: T;
  attemptsMade: number;
  maxAttempts: number;
  createdAt: Date;
}

export type JobHandler<T = any, R = any> = (job: Job<T>) => Promise<R>;

/**
 * Low-Level Design (LLD): Generic Job Queue Interface
 * Enables offloading heavy computations, external SMS/WhatsApp calls, and PDF generations
 * to asynchronous worker pools without blocking Fastify HTTP threads.
 */
export interface IJobQueue {
  addJob<T>(name: string, data: T, options?: JobOptions): Promise<string>;
  process<T, R = any>(name: string, handler: JobHandler<T, R>, concurrency?: number): void;
  getPendingCount(name?: string): Promise<number>;
  close(): Promise<void>;
}
