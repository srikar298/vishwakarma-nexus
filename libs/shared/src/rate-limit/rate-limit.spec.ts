import { describe, it, expect, beforeEach } from 'vitest';
import { TokenBucketLimiter } from './token-bucket.limiter';
import { MemoryCacheProvider } from '../cache/providers/memory-cache.provider';

describe('Rate Limiting Subsystem: Production Audit Test Suite', () => {
  describe('TokenBucketLimiter (Business Domain Throttling)', () => {
    let limiter: TokenBucketLimiter;

    beforeEach(() => {
      // 3 tokens max, refills 3 tokens every 100ms
      limiter = new TokenBucketLimiter({
        capacity: 3,
        refillTokens: 3,
        refillIntervalMs: 100,
      }, new MemoryCacheProvider());
    });

    it('allows requests within bucket capacity', async () => {
      const r1 = await limiter.consume('phone:9876543210');
      const r2 = await limiter.consume('phone:9876543210');
      const r3 = await limiter.consume('phone:9876543210');

      expect(r1.allowed).toBe(true);
      expect(r1.remainingTokens).toBe(2);

      expect(r2.allowed).toBe(true);
      expect(r2.remainingTokens).toBe(1);

      expect(r3.allowed).toBe(true);
      expect(r3.remainingTokens).toBe(0);
    });

    it('rejects requests once capacity is depleted', async () => {
      await limiter.consume('phone:9876543210', 3); // Consume all 3 tokens

      const rejected = await limiter.consume('phone:9876543210', 1);
      expect(rejected.allowed).toBe(false);
      expect(rejected.remainingTokens).toBe(0);
      expect(rejected.retryAfterSeconds).toBeGreaterThanOrEqual(1);
    });

    it('refills tokens automatically after the refill interval', async () => {
      await limiter.consume('phone:9876543210', 3);
      expect((await limiter.consume('phone:9876543210')).allowed).toBe(false);

      // Wait for refill interval (100ms)
      await new Promise((r) => setTimeout(r, 120));

      const afterRefill = await limiter.consume('phone:9876543210');
      expect(afterRefill.allowed).toBe(true);
      expect(afterRefill.remainingTokens).toBe(2);
    });

    it('tracks different keys independently', async () => {
      await limiter.consume('user:101', 3); // user 101 depleted

      const user102 = await limiter.consume('user:102');
      expect(user102.allowed).toBe(true);
      expect(user102.remainingTokens).toBe(2);
    });
  });
});
