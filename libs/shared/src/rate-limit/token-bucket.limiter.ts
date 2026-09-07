import { ICacheProvider } from '../cache/interfaces/cache-provider.interface';
import { cacheProvider } from '../cache/cache.factory';
import { logger } from '../logger';

export interface TokenBucketOptions {
  /** Maximum burst capacity of tokens */
  capacity: number;
  /** Number of tokens refilled per refill interval */
  refillTokens?: number;
  /** Duration in milliseconds of the refill interval (e.g. 60000ms for 1 minute) */
  refillIntervalMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remainingTokens: number;
  resetTimeMs: number;
  retryAfterSeconds?: number;
}

interface BucketState {
  tokens: number;
  lastRefillTimestamp: number;
}

/**
 * Low-Level Design (LLD): Business-Level Token Bucket Rate Limiter
 * Enforces fine-grained domain throttling (e.g. max 3 OTP requests per phone number per 10 minutes).
 */
export class TokenBucketLimiter {
  private inMemoryBuckets = new Map<string, BucketState>();
  private readonly options: TokenBucketOptions;
  private readonly cache: ICacheProvider;

  constructor(options: TokenBucketOptions, cache: ICacheProvider = cacheProvider) {
    this.options = {
      refillTokens: options.refillTokens || options.capacity,
      ...options,
    };
    this.cache = cache;
  }

  /**
   * Attempts to consume the specified number of tokens from the bucket.
   */
  public async consume(key: string, tokensToConsume = 1): Promise<RateLimitResult> {
    const now = Date.now();
    const bucketKey = `rate:${key}`;

    let state = this.inMemoryBuckets.get(bucketKey);

    if (!state) {
      state = {
        tokens: this.options.capacity,
        lastRefillTimestamp: now,
      };
      this.inMemoryBuckets.set(bucketKey, state);
    } else {
      // Calculate token refill based on elapsed time
      const elapsed = now - state.lastRefillTimestamp;
      if (elapsed >= this.options.refillIntervalMs) {
        const refillCycles = Math.floor(elapsed / this.options.refillIntervalMs);
        const tokensToAdd = refillCycles * (this.options.refillTokens || this.options.capacity);
        state.tokens = Math.min(this.options.capacity, state.tokens + tokensToAdd);
        state.lastRefillTimestamp = now;
      }
    }

    const resetTimeMs = state.lastRefillTimestamp + this.options.refillIntervalMs;

    if (state.tokens >= tokensToConsume) {
      state.tokens -= tokensToConsume;
      return {
        allowed: true,
        remainingTokens: state.tokens,
        resetTimeMs,
      };
    }

    const retryAfterSeconds = Math.max(1, Math.ceil((resetTimeMs - now) / 1000));
    // TASK: [Telemetry Integration] Increment business_rate_limit_exceeded_total counter (Component 10)
    // TASK: [Audit Integration] Log RATE_LIMIT_EXCEEDED security warning to AuditLogger (Component 10) on severe abuse
    logger.warn({ key, retryAfterSeconds }, 'TokenBucketLimiter: Limit exceeded');

    return {
      allowed: false,
      remainingTokens: state.tokens,
      resetTimeMs,
      retryAfterSeconds,
    };
  }

  public reset(key: string): void {
    this.inMemoryBuckets.delete(`rate:${key}`);
  }

  public clearAll(): void {
    this.inMemoryBuckets.clear();
  }
}
