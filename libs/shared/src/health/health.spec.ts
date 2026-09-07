import { describe, it, expect } from 'vitest';
import {
  HealthAggregator,
  DatabaseHealthIndicator,
  MemoryHealthIndicator,
  QueueHealthIndicator,
  StorageHealthIndicator,
} from './index';
import { InMemoryJobQueue } from '../queue/memory-job-queue';
import { LocalStorageProvider } from '../storage/providers/local-storage.provider';

describe('Component 10.3: Health Subsystem (Modular Health Matrix)', () => {
  it('should aggregate multiple health indicators and report healthy status', async () => {
    const aggregator = new HealthAggregator();

    // 1. Healthy Database indicator
    const dbIndicator = new DatabaseHealthIndicator(async () => {});
    aggregator.registerIndicator(dbIndicator);

    // 2. Healthy Memory indicator
    const memoryIndicator = new MemoryHealthIndicator(99); // high threshold for test
    aggregator.registerIndicator(memoryIndicator);

    // 3. Healthy Queue indicator
    const queue = new InMemoryJobQueue();
    const queueIndicator = new QueueHealthIndicator(queue);
    aggregator.registerIndicator(queueIndicator);

    // 4. Healthy Storage indicator
    const storage = new LocalStorageProvider('./tmp_health_test');
    const storageIndicator = new StorageHealthIndicator(storage);
    aggregator.registerIndicator(storageIndicator);

    const report = await aggregator.checkHealth();

    expect(report.status).toBe('healthy');
    expect(report.checks.length).toBe(4);
    expect(report.memory.heapUsedMb).toBeGreaterThan(0);
    expect(report.uptimeSeconds).toBeGreaterThanOrEqual(0);

    await queue.close();
  });

  it('should report unhealthy status if any indicator fails with exception', async () => {
    const aggregator = new HealthAggregator();

    // Failing DB indicator
    const failingDb = new DatabaseHealthIndicator(async () => {
      throw new Error('Connection refused to PostgreSQL at 5432');
    });
    aggregator.registerIndicator(failingDb);

    const report = await aggregator.checkHealth();

    expect(report.status).toBe('unhealthy');
    const dbCheck = report.checks.find((c) => c.name === 'database');
    expect(dbCheck?.status).toBe('unhealthy');
    expect(dbCheck?.message).toContain('Connection refused');
  });

  it('should report degraded status if queue is congested or paused', async () => {
    const aggregator = new HealthAggregator();
    const queue = new InMemoryJobQueue();

    // Pause queue
    await queue.pause();

    const queueIndicator = new QueueHealthIndicator(queue);
    aggregator.registerIndicator(queueIndicator);

    const report = await aggregator.checkHealth();

    expect(report.status).toBe('degraded');
    const queueCheck = report.checks.find((c) => c.name === 'queue');
    expect(queueCheck?.status).toBe('degraded');
    expect(queueCheck?.message).toContain('paused');

    await queue.close();
  });
});
