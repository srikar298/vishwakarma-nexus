import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { InMemoryJobQueue } from './memory-job-queue';
import { JobPriority } from './job-queue.interface';

describe('Component 6: Background Worker Job Queue Engine', () => {
  let queue: InMemoryJobQueue;

  beforeEach(() => {
    queue = new InMemoryJobQueue();
  });

  afterEach(async () => {
    await queue.close();
  });

  it('should enqueue and execute a background job successfully', async () => {
    const executed: any[] = [];
    const completedListener = vi.fn();
    queue.onJobCompleted(completedListener);

    queue.process('send_email', async (job) => {
      executed.push(job.data);
      return { success: true };
    });

    const jobId = await queue.addJob('send_email', { to: 'user@example.com' });
    expect(jobId).toBeDefined();

    // Wait for async worker execution
    await new Promise((r) => setTimeout(r, 50));

    expect(executed).toEqual([{ to: 'user@example.com' }]);
    expect(completedListener).toHaveBeenCalledTimes(1);

    const stats = await queue.getStats();
    expect(stats.completed).toBe(1);
    expect(stats.failed).toBe(0);
  });

  it('should strictly prioritize Priority 1 (Urgent) jobs over Priority 4 (Low) jobs', async () => {
    const executionOrder: string[] = [];

    // Pause queue to stage multiple jobs simultaneously
    await queue.pause('task_pipeline');

    queue.process<{ name: string }>('task_pipeline', async (job) => {
      executionOrder.push(job.data.name);
    }, 1);

    // Enqueue Low priority first, then Normal, then Critical
    await queue.addJob('task_pipeline', { name: 'bulk_image_resize' }, { priority: JobPriority.LOW });
    await queue.addJob('task_pipeline', { name: 'send_digest' }, { priority: JobPriority.NORMAL });
    await queue.addJob('task_pipeline', { name: 'urgent_otp' }, { priority: JobPriority.CRITICAL });

    // Resume queue: all queued jobs are dequeued in strict priority order
    await queue.resume('task_pipeline');

    // Allow all 3 jobs to finish
    await new Promise((r) => setTimeout(r, 60));

    expect(executionOrder).toEqual(['urgent_otp', 'send_digest', 'bulk_image_resize']);
  });

  it('should delay job execution until delayMs has elapsed', async () => {
    const executed: number[] = [];
    const startTime = Date.now();

    queue.process('delayed_task', async (job) => {
      executed.push(Date.now() - startTime);
    });

    await queue.addJob('delayed_task', { text: 'hello' }, { delayMs: 100 });

    // After 30ms, job should not have executed yet
    await new Promise((r) => setTimeout(r, 30));
    expect(executed.length).toBe(0);

    // After 120ms total, job should have executed
    await new Promise((r) => setTimeout(r, 100));
    expect(executed.length).toBe(1);
    expect(executed[0]).toBeGreaterThanOrEqual(90);
  });

  it('should retry failed jobs with backoff up to maxAttempts', async () => {
    let attempts = 0;

    queue.process('flaky_service', async (job) => {
      attempts++;
      if (attempts < 2) {
        throw new Error('Transient 503 Network Error');
      }
      return 'recovered';
    });

    await queue.addJob('flaky_service', { payload: 'data' }, {
      attempts: 3,
      backoffDelayMs: 30,
      backoffType: 'fixed',
    });

    await new Promise((r) => setTimeout(r, 100));

    expect(attempts).toBe(2);
    const stats = await queue.getStats();
    expect(stats.completed).toBe(1);
    expect(stats.failed).toBe(0);
  });

  it('should route permanently failed jobs to DLQ and trigger onJobFailed hook', async () => {
    const failedListener = vi.fn();
    queue.onJobFailed(failedListener);

    queue.process('permanent_fail', async (job) => {
      throw new Error('Unrecoverable 400 Bad Request');
    });

    await queue.addJob('permanent_fail', { payload: 'invalid' }, {
      attempts: 2,
      backoffDelayMs: 20,
    });

    await new Promise((r) => setTimeout(r, 100));

    expect(failedListener).toHaveBeenCalledTimes(1);
    const stats = await queue.getStats();
    expect(stats.failed).toBe(1);
    expect(stats.completed).toBe(0);
  });

  it('should respect worker concurrency limits', async () => {
    let activeWorkers = 0;
    let maxParallelWorkers = 0;

    queue.process('heavy_compute', async (job) => {
      activeWorkers++;
      maxParallelWorkers = Math.max(maxParallelWorkers, activeWorkers);
      await new Promise((r) => setTimeout(r, 40));
      activeWorkers--;
    }, 2); // Max concurrency = 2

    // Enqueue 4 parallel jobs
    await Promise.all([
      queue.addJob('heavy_compute', 1),
      queue.addJob('heavy_compute', 2),
      queue.addJob('heavy_compute', 3),
      queue.addJob('heavy_compute', 4),
    ]);

    await new Promise((r) => setTimeout(r, 150));

    expect(maxParallelWorkers).toBe(2);
    const stats = await queue.getStats();
    expect(stats.completed).toBe(4);
  });

  it('should pause and resume queue processing seamlessly', async () => {
    const executed: number[] = [];

    queue.process<number>('pauseable_task', async (job) => {
      executed.push(job.data);
    });

    await queue.pause('pauseable_task');
    await queue.addJob('pauseable_task', 1);
    await queue.addJob('pauseable_task', 2);

    await new Promise((r) => setTimeout(r, 40));
    expect(executed.length).toBe(0); // Queued but not processed

    await queue.resume('pauseable_task');
    await new Promise((r) => setTimeout(r, 60));
    expect(executed).toEqual([1, 2]); // Processed after resume
  });

  it('should report comprehensive queue statistics accurately', async () => {
    await queue.addJob('stat_job', { id: 1 });
    await queue.addJob('stat_job', { id: 2 }, { delayMs: 5000 });

    const stats = await queue.getStats();
    expect(stats.waiting).toBe(1);
    expect(stats.delayed).toBe(1);
    expect(stats.paused).toBe(false);
  });
});
