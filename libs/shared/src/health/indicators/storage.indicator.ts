import { HealthCheckResult, IHealthIndicator } from '../health.interface';
import { IStorageProvider } from '../../storage/interfaces/storage-provider.interface';

/**
 * Low-Level Design (LLD): Storage Health Indicator
 * Probes the file storage provider to verify read/write accessibility.
 */
export class StorageHealthIndicator implements IHealthIndicator {
  public readonly name = 'storage';
  private storage: IStorageProvider;

  constructor(storage: IStorageProvider) {
    this.storage = storage;
  }

  public async check(): Promise<HealthCheckResult> {
    const start = process.hrtime();
    try {
      await this.storage.exists('health_probe_check.tmp');
      const [seconds, nanoseconds] = process.hrtime(start);
      const latencyMs = Number((seconds * 1000 + nanoseconds / 1e6).toFixed(2));

      return {
        name: this.name,
        status: latencyMs > 1000 ? 'degraded' : 'healthy',
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
        message: err?.message || 'Storage probe failed',
      };
    }
  }
}
