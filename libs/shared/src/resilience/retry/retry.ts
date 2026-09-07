export interface RetryOptions {
  maxRetries: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffFactor: number;
  shouldRetry?: (error: any) => boolean;
}

const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 3,
  initialDelayMs: 200,
  maxDelayMs: 3000,
  backoffFactor: 2,
};

/**
 * Exponential Backoff with Full Jitter
 * Sleep = rand(0, min(maxDelay, initialDelay * (factor ^ attempt)))
 */
export async function retryWithBackoff<T>(
  action: (attempt: number) => Promise<T>,
  options?: Partial<RetryOptions>
): Promise<T> {
  const opts: RetryOptions = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let attempt = 0;

  while (true) {
    attempt++;
    try {
      return await action(attempt);
    } catch (error) {
      if (attempt > opts.maxRetries || (opts.shouldRetry && !opts.shouldRetry(error))) {
        throw error;
      }

      // Calculate exponential delay with full jitter to avoid thundering herd
      const exponentialDelay = Math.min(
        opts.maxDelayMs,
        opts.initialDelayMs * Math.pow(opts.backoffFactor, attempt - 1)
      );
      const jitteredDelay = Math.floor(Math.random() * exponentialDelay);

      await new Promise((resolve) => setTimeout(resolve, jitteredDelay));
    }
  }
}
