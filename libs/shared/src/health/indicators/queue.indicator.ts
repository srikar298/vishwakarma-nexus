import { HealthCheckResult, IHealthIndicator } from '../health.interface';
import { IJobQueue } from '../../queue/job-queue.interface';

/**
 * Low-Level Design (LLD): Queue Health Indicator
 * Probes the background job queue for backlog congestion, active workers, and DLQ errors.
 */
export class QueueHealthIndicator implements IHealthIndicator {
  public readonly name = 'queue';
  private queue: IJobQueue;
  private maxWaitingThreshold: number;

  constructor(queue: IJobQueue, maxWaitingThreshold = 500) {
    this.queue = queue;
    this.maxWaitingThreshold = maxWaitingThreshold;
  }

  public async check(): Promise<HealthCheckResult> {
    const start = process.hrtime();
    try {
      const stats = await this.queue.getStats();
      const [seconds, nanoseconds] = process.hrtime(start);
      const latencyMs = Number((seconds * 1000 + nanoseconds / 1e6).toFixed(2));

      let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
      let message: string | undefined;

      if (stats.waiting > this.maxWaitingThreshold) {
        status = 'degraded';
        message = `High queue backlog: ${stats.waiting} jobs waiting`;
      } else if (stats.paused) {
        status = 'degraded';
        message = 'Job queue is currently paused';
      }

      return {
        name: this.name,
        status,
        latencyMs,
        message,
        details: {
          waiting: stats.waiting,
          active: stats.active,
          delayed: stats.delayed,
          completed: stats.completed,
          failed: stats.failed,
          paused: stats.paused,
        },
      };
    } catch (err: any) {
      const [seconds, nanoseconds] = process.hrtime(start);
      const latencyMs = Number((seconds * 1000 + nanoseconds / 1e6).toFixed(2));

      return {
        name: this.name,
        status: 'unhealthy',
        latencyMs,
        message: err?.message || 'Failed to probe job queue',
      };
    }
  }
}
