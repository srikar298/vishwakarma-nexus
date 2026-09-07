import { logger } from '../../logger';

export type JitterType = 'FULL' | 'EQUAL' | 'DECORRELATED' | 'NONE';

export interface RetryOptions {
  maxRetries: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffFactor: number;
  jitter?: JitterType;
  signal?: AbortSignal;
  shouldRetry?: (error: unknown) => boolean;
  onRetry?: (attempt: number, error: unknown, nextDelayMs: number) => void;
}

const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 3,
  initialDelayMs: 200,
  maxDelayMs: 5000,
  backoffFactor: 2,
  jitter: 'FULL',
};

/**
 * Calculates backoff delay with configured jitter strategy
 */
function calculateDelay(attempt: number, opts: RetryOptions, previousDelayMs = 0): number {
  const baseDelay = Math.min(
    opts.maxDelayMs,
    opts.initialDelayMs * Math.pow(opts.backoffFactor, attempt - 1)
  );

  switch (opts.jitter) {
    case 'FULL':
      // Sleep = rand(0, baseDelay)
      return Math.floor(Math.random() * baseDelay);

    case 'EQUAL':
      // Sleep = (baseDelay / 2) + rand(0, baseDelay / 2)
      return Math.floor(baseDelay / 2 + Math.random() * (baseDelay / 2));

    case 'DECORRELATED':
      // Sleep = min(maxDelay, rand(initialDelay, previousDelay * 3))
      const low = opts.initialDelayMs;
      const high = Math.max(low, (previousDelayMs || opts.initialDelayMs) * 3);
      return Math.min(opts.maxDelayMs, Math.floor(low + Math.random() * (high - low)));

    case 'NONE':
    default:
      return baseDelay;
  }
}

/**
 * Low-Level Design (LLD): Production-Grade Retry with Exponential Backoff and Jitter
 * Supports AbortSignal cancellation and telemetry hooks.
 */
export async function retryWithBackoff<T>(
  action: (attempt: number, signal?: AbortSignal) => Promise<T>,
  options?: Partial<RetryOptions>
): Promise<T> {
  const opts: RetryOptions = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let attempt = 0;
  let previousDelay = opts.initialDelayMs;

  while (true) {
    attempt++;

    if (opts.signal?.aborted) {
      throw new Error('Retry operation aborted by signal.');
    }

    try {
      return await action(attempt, opts.signal);
    } catch (error) {
      const isRetriable = opts.shouldRetry ? opts.shouldRetry(error) : true;

      if (attempt > opts.maxRetries || !isRetriable || opts.signal?.aborted) {
        throw error;
      }

      const nextDelay = calculateDelay(attempt, opts, previousDelay);
      previousDelay = nextDelay;

      // TASK: [Telemetry Integration] Record retry count metric per operation name
      logger.debug(
        { attempt, maxRetries: opts.maxRetries, nextDelayMs: nextDelay, error: error instanceof Error ? error.message : String(error) },
        'RetryWithBackoff: Action failed. Retrying after backoff delay.'
      );

      if (opts.onRetry) {
        opts.onRetry(attempt, error, nextDelay);
      }

      await new Promise<void>((resolve, reject) => {
        const timer = setTimeout(resolve, nextDelay);

        if (opts.signal) {
          const abortHandler = () => {
            clearTimeout(timer);
            opts.signal?.removeEventListener('abort', abortHandler);
            reject(new Error('Retry wait aborted by signal.'));
          };
          opts.signal.addEventListener('abort', abortHandler, { once: true });
        }
      });
    }
  }
}
