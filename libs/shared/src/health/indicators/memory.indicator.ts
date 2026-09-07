import { HealthCheckResult, IHealthIndicator } from '../health.interface';

/**
 * Low-Level Design (LLD): Memory & Heap Health Indicator
 * Evaluates Node.js runtime heap and RSS memory consumption against configured thresholds.
 */
export class MemoryHealthIndicator implements IHealthIndicator {
  public readonly name = 'memory';
  private maxHeapPercentThreshold: number;

  constructor(maxHeapPercentThreshold = 85) {
    this.maxHeapPercentThreshold = maxHeapPercentThreshold;
  }

  public async check(): Promise<HealthCheckResult> {
    const memory = process.memoryUsage();
    const heapUsedMb = Math.round(memory.heapUsed / 1024 / 1024);
    const heapTotalMb = Math.round(memory.heapTotal / 1024 / 1024);
    const rssMb = Math.round(memory.rss / 1024 / 1024);
    const heapUsagePercent = Math.round((memory.heapUsed / memory.heapTotal) * 100);

    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    let message: string | undefined;

    if (heapUsagePercent > 95) {
      status = 'unhealthy';
      message = `Critical memory pressure: heap at ${heapUsagePercent}%`;
    } else if (heapUsagePercent > this.maxHeapPercentThreshold) {
      status = 'degraded';
      message = `Elevated memory usage: heap at ${heapUsagePercent}%`;
    }

    return {
      name: this.name,
      status,
      message,
      details: {
        heapUsedMb,
        heapTotalMb,
        heapUsagePercent: `${heapUsagePercent}%`,
        rssMb,
      },
    };
  }
}
