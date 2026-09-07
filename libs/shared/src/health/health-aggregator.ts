import { 
  HealthCheckResult, 
  HealthStatus, 
  IHealthIndicator, 
  SystemHealthReport 
} from './health.interface';
import { config } from '../config';

/**
 * Low-Level Design (LLD): Composite Health Checker
 * Collects and aggregates deep health signals from all registered infrastructure subsystems.
 */
export class HealthAggregator {
  private indicators = new Map<string, IHealthIndicator>();

  public registerIndicator(indicator: IHealthIndicator): void {
    this.indicators.set(indicator.name, indicator);
  }

  public async checkHealth(): Promise<SystemHealthReport> {
    const checks: HealthCheckResult[] = [];
    const promises: Promise<HealthCheckResult>[] = [];

    for (const indicator of this.indicators.values()) {
      promises.push(
        indicator.check().catch((err) => ({
          name: indicator.name,
          status: 'unhealthy',
          message: err?.message || 'Check failed with exception',
        }))
      );
    }

    const results = await Promise.all(promises);
    checks.push(...results);

    // Compute overall aggregated health status
    let overallStatus: HealthStatus = 'healthy';
    if (checks.some((c) => c.status === 'unhealthy')) {
      overallStatus = 'unhealthy';
    } else if (checks.some((c) => c.status === 'degraded')) {
      overallStatus = 'degraded';
    }

    const memoryUsage = process.memoryUsage();

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      environment: config.app.env || 'development',
      memory: {
        heapUsedMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        heapTotalMb: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        rssMb: Math.round(memoryUsage.rss / 1024 / 1024),
      },
      checks,
    };
  }
}

export const defaultHealthAggregator = new HealthAggregator();
