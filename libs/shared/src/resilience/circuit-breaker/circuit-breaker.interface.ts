export type CircuitBreakerState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface CircuitBreakerOptions {
  failureThreshold: number;       // Number of failures before tripping (e.g. 5)
  resetTimeoutMs: number;         // Time to wait before testing recovery in HALF_OPEN (e.g. 10000ms)
  successThreshold: number;       // Number of successful calls in HALF_OPEN to transition to CLOSED (e.g. 2)
  fallback?: <T>() => Promise<T> | T; // Optional fallback when circuit is OPEN
}

export interface CircuitBreakerMetrics {
  state: CircuitBreakerState;
  failures: number;
  successes: number;
  lastFailureTime?: number;
  totalCalls: number;
  rejectedCalls: number;
}

export interface ICircuitBreaker {
  execute<T>(action: () => Promise<T>): Promise<T>;
  getState(): CircuitBreakerState;
  getMetrics(): CircuitBreakerMetrics;
  reset(): void;
}
