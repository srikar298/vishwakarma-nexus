import { HealthCheckResult, IHealthIndicator } from '../health.interface';

/**
 * Low-Level Design (LLD): Database Health Indicator
 * Performs a lightweight probe (e.g., SELECT 1) and records query latency.
 */
export class DatabaseHealthIndicator implements IHealthIndicator {
  public readonly name = 'database';
  private pingFn: () => Promise<void>;

  constructor(pingFn?: () => Promise<void>) {
    this.pingFn = pingFn || (async () => {});
  }

  public setPingFn(fn: () => Promise<void>): void {
    this.pingFn = fn;
  }

  public async check(): Promise<HealthCheckResult> {
    const start = process.hrtime();
    try {
      await this.pingFn();
      const [seconds, nanoseconds] = process.hrtime(start);
      const latencyMs = Number((seconds * 1000 + nanoseconds / 1e6).toFixed(2));

      return {
        name: this.name,
        status: latencyMs > 500 ? 'degraded' : 'healthy',
        latencyMs,
        details: {
          engine: 'PostgreSQL',
          responseTime: `${latencyMs}ms`,
        },
      };
    } catch (err: any) {
      const [seconds, nanoseconds] = process.hrtime(start);
      const latencyMs = Number((seconds * 1000 + nanoseconds / 1e6).toFixed(2));

      return {
        name: this.name,
        status: 'unhealthy',
        latencyMs,
        message: err?.message || 'Database connection error',
        details: {
          error: err?.message,
        },
      };
    }
  }
}
