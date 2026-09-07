import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  CircuitBreaker, 
  SlidingWindow, 
  Bulkhead, 
  BulkheadFullError,
  retryWithBackoff, 
  withTimeout, 
  TimeoutError, 
  createResiliencePipeline 
} from './index';

describe('Resilience Subsystem: Production Audit Test Suite', () => {
  describe('SlidingWindow Metric Tracker', () => {
    it('calculates failure rate percentage correctly in COUNT window', () => {
      const window = new SlidingWindow({ type: 'COUNT', size: 10, slowCallThresholdMs: 1000 });
      
      // 3 failures, 7 successes
      for (let i = 0; i < 7; i++) window.recordSuccess(50);
      for (let i = 0; i < 3; i++) window.recordFailure(50);

      const snapshot = window.getSnapshot();
      expect(snapshot.totalCalls).toBe(10);
      expect(snapshot.failureCount).toBe(3);
      expect(snapshot.successCount).toBe(7);
      expect(snapshot.failureRatePercentage).toBe(30);
    });

    it('prunes older records once window size is exceeded', () => {
      const window = new SlidingWindow({ type: 'COUNT', size: 5 });
      for (let i = 0; i < 5; i++) window.recordFailure(10);
      expect(window.getSnapshot().failureRatePercentage).toBe(100);

      // Overwrite with 5 successes
      for (let i = 0; i < 5; i++) window.recordSuccess(10);
      expect(window.getSnapshot().failureRatePercentage).toBe(0);
      expect(window.getSnapshot().totalCalls).toBe(5);
    });
  });

  describe('CircuitBreaker State Machine & Probing', () => {
    let cb: CircuitBreaker;

    beforeEach(() => {
      cb = new CircuitBreaker('test-circuit', {
        failureRateThreshold: 50,
        minimumNumberOfCalls: 4,
        resetTimeoutMs: 100, // short for test
        permittedNumberOfCallsInHalfOpenState: 2,
        halfOpenSuccessThreshold: 100,
        slidingWindowSize: 10,
      });
    });

    it('stays CLOSED when failure rate is below threshold', async () => {
      await cb.execute(async () => 'ok');
      await cb.execute(async () => 'ok');
      await cb.execute(async () => 'ok');
      try {
        await cb.execute(async () => { throw new Error('fail'); });
      } catch {}

      expect(cb.getState()).toBe('CLOSED');
      expect(cb.getMetrics().failureRatePercentage).toBe(25);
    });

    it('trips to OPEN when failure rate exceeds threshold after minimum calls', async () => {
      for (let i = 0; i < 2; i++) {
        await cb.execute(async () => 'ok');
      }
      for (let i = 0; i < 2; i++) {
        try {
          await cb.execute(async () => { throw new Error('fail'); });
        } catch {}
      }

      expect(cb.getState()).toBe('OPEN');
      await expect(cb.execute(async () => 'fast-fail')).rejects.toThrow(/is OPEN/);
    });

    it('transitions to HALF_OPEN after reset timeout and closes upon successful probe calls', async () => {
      // Trip to OPEN
      for (let i = 0; i < 4; i++) {
        try { await cb.execute(async () => { throw new Error('fail'); }); } catch {}
      }
      expect(cb.getState()).toBe('OPEN');

      // Wait for reset timeout
      await new Promise((r) => setTimeout(r, 120));

      expect(cb.getState()).toBe('HALF_OPEN');

      // Execute 2 successful probe calls
      const r1 = await cb.execute(async () => 'probe-1');
      const r2 = await cb.execute(async () => 'probe-2');

      expect(r1).toBe('probe-1');
      expect(r2).toBe('probe-2');
      expect(cb.getState()).toBe('CLOSED');
    });

    it('ignores non-countable errors when custom isFailure is provided', async () => {
      class ClientValidationError extends Error {}

      const customCb = new CircuitBreaker('custom-cb', {
        minimumNumberOfCalls: 2,
        failureRateThreshold: 50,
        isFailure: (err) => !(err instanceof ClientValidationError),
      });

      for (let i = 0; i < 4; i++) {
        try {
          await customCb.execute(async () => { throw new ClientValidationError('400 bad request'); });
        } catch {}
      }

      expect(customCb.getState()).toBe('CLOSED');
    });
  });

  describe('Bulkhead Concurrency & Queue Limiter', () => {
    it('allows executions within maxConcurrent limit', async () => {
      const bulkhead = new Bulkhead('test-bulkhead', { maxConcurrent: 2, maxQueue: 2 });
      
      const res = await bulkhead.execute(async () => 42);
      expect(res).toBe(42);
      expect(bulkhead.getMetrics().activeExecutions).toBe(0);
    });

    it('enqueues executions when maxConcurrent is exceeded and drains them', async () => {
      const bulkhead = new Bulkhead('test-bulkhead-queue', { maxConcurrent: 1, maxQueue: 2 });

      let resolvedOrder: number[] = [];
      const p1 = bulkhead.execute(async () => {
        await new Promise((r) => setTimeout(r, 50));
        resolvedOrder.push(1);
        return 1;
      });

      const p2 = bulkhead.execute(async () => {
        resolvedOrder.push(2);
        return 2;
      });

      expect(bulkhead.getMetrics().queuedCount).toBe(1);

      await Promise.all([p1, p2]);
      expect(resolvedOrder).toEqual([1, 2]);
      expect(bulkhead.getMetrics().queuedCount).toBe(0);
    });

    it('rejects calls with BulkheadFullError when queue capacity is reached', async () => {
      const bulkhead = new Bulkhead('test-bulkhead-overflow', { maxConcurrent: 1, maxQueue: 1 });

      const p1 = bulkhead.execute(() => new Promise((r) => setTimeout(r, 100)));
      const p2 = bulkhead.execute(() => new Promise((r) => setTimeout(r, 100)));

      // 3rd call exceeds 1 active + 1 queued limit
      await expect(bulkhead.execute(async () => 'overflow')).rejects.toThrow(BulkheadFullError);

      await Promise.allSettled([p1, p2]);
    });
  });

  describe('Retry with Backoff & Jitter', () => {
    it('retries until maxRetries is reached', async () => {
      let attempts = 0;
      await expect(
        retryWithBackoff(async () => {
          attempts++;
          throw new Error('transient error');
        }, { maxRetries: 2, initialDelayMs: 10, maxDelayMs: 50 })
      ).rejects.toThrow('transient error');

      expect(attempts).toBe(3); // Initial try + 2 retries
    });

    it('succeeds on subsequent attempt', async () => {
      let attempts = 0;
      const res = await retryWithBackoff(async () => {
        attempts++;
        if (attempts < 2) throw new Error('first try fail');
        return 'success';
      }, { maxRetries: 3, initialDelayMs: 10 });

      expect(res).toBe('success');
      expect(attempts).toBe(2);
    });
  });

  describe('Declarative ResiliencePipeline', () => {
    it('orchestrates Bulkhead + CircuitBreaker + Retry + Timeout together', async () => {
      let attempts = 0;
      const pipeline = createResiliencePipeline()
        .withBulkhead('pipeline-bulkhead', { maxConcurrent: 5, maxQueue: 5 })
        .withCircuitBreaker('pipeline-cb', { failureRateThreshold: 50, minimumNumberOfCalls: 5 })
        .withRetry({ maxRetries: 2, initialDelayMs: 5 })
        .withTimeout(500);

      const result = await pipeline.execute(async () => {
        attempts++;
        if (attempts < 2) throw new Error('retry me');
        return 'pipeline-ok';
      });

      expect(result).toBe('pipeline-ok');
      expect(attempts).toBe(2);
    });
  });
});
