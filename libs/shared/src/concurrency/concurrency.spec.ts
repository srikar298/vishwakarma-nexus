import { describe, it, expect, beforeEach } from 'vitest';
import { 
  MemoryLockProvider, 
  SingleFlight, 
  LockFactory,
  defaultSingleFlight 
} from './index';

describe('Concurrency Subsystem: Production Audit Test Suite', () => {
  describe('MemoryLockProvider (Mutual Exclusion & Watchdog)', () => {
    let lock: MemoryLockProvider;

    beforeEach(() => {
      lock = new MemoryLockProvider();
    });

    it('ensures mutual exclusion under concurrent race conditions', async () => {
      let sharedCounter = 0;
      const numWorkers = 30;

      // 30 workers attempt to increment sharedCounter with a simulated async delay
      const workerPromises = Array.from({ length: numWorkers }).map(async (_, i) => {
        return lock.withLock('test-mutex', async () => {
          const current = sharedCounter;
          await new Promise((r) => setTimeout(r, 5));
          sharedCounter = current + 1;
          return sharedCounter;
        }, { timeoutMs: 5000, retryIntervalMs: 10 });
      });

      await Promise.all(workerPromises);
      expect(sharedCounter).toBe(numWorkers);
    });

    it('fails with timeout error if lock is held past timeoutMs', async () => {
      const lock1 = await lock.acquire('held-key', { ttlMs: 5000 });
      expect(lock1).toBeDefined();

      await expect(
        lock.acquire('held-key', { timeoutMs: 100, retryIntervalMs: 20 })
      ).resolves.toBeNull();

      if (lock1) await lock.release(lock1);
    });

    it('supports reentrant locking by the same owner token', async () => {
      const token1 = await lock.acquire('reentrant-key', { ttlMs: 5000 });
      expect(token1).toBeDefined();

      // Nested acquisition with existingToken
      const token2 = await lock.acquire('reentrant-key', { existingToken: token1! });
      expect(token2).toBe(token1);
      expect(token2?.reentrancyCount).toBe(2);

      // First release decreases count
      const releasedFirst = await lock.release(token2!);
      expect(releasedFirst).toBe(true);

      // Lock is still held
      const conflict = await lock.acquire('reentrant-key', { timeoutMs: 50 });
      expect(conflict).toBeNull();

      // Final release frees the lock
      const releasedFinal = await lock.release(token1!);
      expect(releasedFinal).toBe(true);

      // Now another caller can acquire it
      const nextToken = await lock.acquire('reentrant-key', { timeoutMs: 100 });
      expect(nextToken).toBeDefined();
      if (nextToken) await lock.release(nextToken);
    });

    it('auto-extends lock TTL via Watchdog while task is in-flight', async () => {
      let taskExecuted = false;

      // Initial TTL is very short (50ms), task takes 120ms. Watchdog must extend it!
      await lock.withLock('watchdog-key', async () => {
        await new Promise((r) => setTimeout(r, 120));
        taskExecuted = true;
      }, { ttlMs: 50, heartbeatIntervalMs: 20, autoExtend: true });

      expect(taskExecuted).toBe(true);
    });
  });

  describe('SingleFlight (In-Flight Request Deduplication)', () => {
    let sf: SingleFlight;

    beforeEach(() => {
      sf = new SingleFlight();
    });

    it('coalesces multiple concurrent calls into a single invocation', async () => {
      let underlyingExecutionCount = 0;

      const fetchMetadata = async () => {
        underlyingExecutionCount++;
        await new Promise((r) => setTimeout(r, 30));
        return { data: 'temple-info-2026' };
      };

      // 25 simultaneous calls for the same key
      const callers = Array.from({ length: 25 }).map(() =>
        sf.do('temple:101', fetchMetadata)
      );

      const results = await Promise.all(callers);

      expect(underlyingExecutionCount).toBe(1); // Executed only ONCE!
      for (const res of results) {
        expect(res).toEqual({ data: 'temple-info-2026' });
      }
      expect(sf.getInFlightCount()).toBe(0); // Cleaned up
    });

    it('executes a fresh call after the in-flight request resolves', async () => {
      let callCount = 0;
      const fn = async () => ++callCount;

      const r1 = await sf.do('key-seq', fn);
      const r2 = await sf.do('key-seq', fn);

      expect(r1).toBe(1);
      expect(r2).toBe(2);
      expect(callCount).toBe(2);
    });

    it('propagates errors to all coalesced callers', async () => {
      let callCount = 0;
      const failFn = async () => {
        callCount++;
        await new Promise((r) => setTimeout(r, 20));
        throw new Error('Database connection reset');
      };

      const callers = Array.from({ length: 5 }).map(() =>
        expect(sf.do('failing-key', failFn)).rejects.toThrow('Database connection reset')
      );

      await Promise.all(callers);
      expect(callCount).toBe(1);
      expect(sf.getInFlightCount()).toBe(0);
    });
  });

  describe('LockFactory', () => {
    it('provides a valid singleton lock provider', () => {
      const provider = LockFactory.getProvider();
      expect(provider).toBeDefined();
      expect(typeof provider.acquire).toBe('function');
      expect(typeof provider.release).toBe('function');
      expect(typeof provider.withLock).toBe('function');
    });
  });
});
