import { CircuitBreakerOptions, ICircuitBreaker } from '../circuit-breaker/circuit-breaker.interface';
import { getCircuitBreaker } from '../circuit-breaker/circuit-breaker';
import { BulkheadOptions, IBulkhead } from '../bulkhead/bulkhead.interface';
import { getBulkhead } from '../bulkhead/bulkhead';
import { RetryOptions, retryWithBackoff } from '../retry/retry';
import { withTimeout } from '../timeout/timeout';

/**
 * Low-Level Design (LLD): Declarative Resilience Policy Pipeline
 * Coordinates multiple resilience policies (Bulkhead -> Circuit Breaker -> Retry -> Timeout)
 * into a single unified execution pipeline.
 */
export class ResiliencePipeline {
  private bulkheadInstance?: IBulkhead;
  private circuitBreakerInstance?: ICircuitBreaker;
  private retryConfig?: Partial<RetryOptions>;
  private timeoutDurationMs?: number;

  public withBulkhead(nameOrInstance: string | IBulkhead, options?: Partial<BulkheadOptions>): this {
    if (typeof nameOrInstance === 'string') {
      this.bulkheadInstance = getBulkhead(nameOrInstance, options);
    } else {
      this.bulkheadInstance = nameOrInstance;
    }
    return this;
  }

  public withCircuitBreaker(nameOrInstance: string | ICircuitBreaker, options?: Partial<CircuitBreakerOptions>): this {
    if (typeof nameOrInstance === 'string') {
      this.circuitBreakerInstance = getCircuitBreaker(nameOrInstance, options);
    } else {
      this.circuitBreakerInstance = nameOrInstance;
    }
    return this;
  }

  public withRetry(options: Partial<RetryOptions>): this {
    this.retryConfig = options;
    return this;
  }

  public withTimeout(timeoutMs: number): this {
    this.timeoutDurationMs = timeoutMs;
    return this;
  }

  public async execute<T>(action: (signal?: AbortSignal) => Promise<T>): Promise<T> {
    // Pipeline nesting order:
    // Bulkhead (outermost) -> CircuitBreaker -> Retry -> Timeout -> Action (innermost)

    const executeTimeout = (signal?: AbortSignal): Promise<T> => {
      if (this.timeoutDurationMs && this.timeoutDurationMs > 0) {
        return withTimeout((timeoutSignal) => action(timeoutSignal), this.timeoutDurationMs);
      }
      return action(signal);
    };

    const executeRetry = (): Promise<T> => {
      if (this.retryConfig) {
        return retryWithBackoff((_, signal) => executeTimeout(signal), this.retryConfig);
      }
      return executeTimeout();
    };

    const executeCircuitBreaker = (): Promise<T> => {
      if (this.circuitBreakerInstance) {
        return this.circuitBreakerInstance.execute(() => executeRetry());
      }
      return executeRetry();
    };

    const executeBulkhead = (): Promise<T> => {
      if (this.bulkheadInstance) {
        return this.bulkheadInstance.execute(() => executeCircuitBreaker());
      }
      return executeCircuitBreaker();
    };

    return executeBulkhead();
  }
}

export function createResiliencePipeline(): ResiliencePipeline {
  return new ResiliencePipeline();
}
