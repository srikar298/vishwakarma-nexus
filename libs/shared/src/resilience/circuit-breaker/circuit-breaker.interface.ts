export type CircuitBreakerState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface CircuitBreakerOptions {
  /** Percentage of failures (0-100) needed in sliding window to trip circuit to OPEN */
  failureRateThreshold: number;
  /** Minimum number of calls in window before error rate is evaluated */
  minimumNumberOfCalls: number;
  /** Duration in ms to stay in OPEN state before transitioning to HALF_OPEN probe state */
  resetTimeoutMs: number;
  /** Number of permitted trial calls in HALF_OPEN state */
  permittedNumberOfCallsInHalfOpenState: number;
  /** Success rate threshold (0-100) in HALF_OPEN to return to CLOSED */
  halfOpenSuccessThreshold: number;
  /** Sliding window evaluation type: COUNT or TIME */
  slidingWindowType: 'COUNT' | 'TIME';
  /** Size of the sliding window (count or time window ms) */
  slidingWindowSize: number;
  /** Duration in ms after which a call is classified as slow */
  slowCallDurationThresholdMs: number;
  /** Optional custom classifier to decide if an error should trip the circuit */
  isFailure?: (error: unknown) => boolean;
  /** Optional fallback executed when circuit is OPEN or rejects call */
  fallback?: <T>() => Promise<T> | T;
}

export interface CircuitBreakerMetrics {
  state: CircuitBreakerState;
  totalCalls: number;
  failureCount: number;
  successCount: number;
  slowCallCount: number;
  failureRatePercentage: number;
  slowCallRatePercentage: number;
  rejectedCalls: number;
  lastStateChangeTimestamp: number;
}

export type StateChangeCallback = (from: CircuitBreakerState, to: CircuitBreakerState, metrics: CircuitBreakerMetrics) => void;

/**
 * Low-Level Design (LLD): Circuit Breaker Contract
 */
export interface ICircuitBreaker {
  execute<T>(action: () => Promise<T>): Promise<T>;
  getState(): CircuitBreakerState;
  getMetrics(): CircuitBreakerMetrics;
  onStateChange(callback: StateChangeCallback): () => void;
  reset(): void;
  forceOpen(): void;
  forceClose(): void;
}
