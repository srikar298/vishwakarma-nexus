import { HealthCheckResult, IHealthIndicator } from '../health.interface';
import { ICacheProvider } from '../../cache/interfaces/cache-provider.interface';

/**
 * Low-Level Design (LLD): Redis/Cache Health Indicator
 * Probes the cache provider (PING or fast read) to monitor cache layer availability.
 */
export class RedisHealthIndicator implements IHealthIndicator {
  public readonly name = 'cache';
  private cacheProvider: ICacheProvider;

  constructor(cacheProvider: ICacheProvider) {
    this.cacheProvider = cacheProvider;
  }

  public async check(): Promise<HealthCheckResult> {
    const start = process.hrtime();
    const testKey = `health:ping:${Date.now()}`;
    try {
      await this.cacheProvider.set(testKey, '1', 5);
      const val = await this.cacheProvider.get(testKey);
      await this.cacheProvider.delete(testKey);

      const [seconds, nanoseconds] = process.hrtime(start);
      const latencyMs = Number((seconds * 1000 + nanoseconds / 1e6).toFixed(2));

      if (val !== '1') {
        return {
          name: this.name,
          status: 'degraded',
          latencyMs,
          message: 'Cache roundtrip read failed',
        };
      }

      return {
        name: this.name,
        status: latencyMs > 100 ? 'degraded' : 'healthy',
        latencyMs,
        details: {
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
        message: err?.message || 'Cache probe failed',
      };
    }
  }
}
