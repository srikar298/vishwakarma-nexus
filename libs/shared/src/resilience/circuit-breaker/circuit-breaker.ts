import { 
  CircuitBreakerOptions, 
  CircuitBreakerState, 
  CircuitBreakerMetrics, 
  ICircuitBreaker 
} from './circuit-breaker.interface';
import { logger } from '../../logger';

/**
 * Low-Level Design (LLD): Circuit Breaker State Machine
 * Prevents cascading failures when communicating with external/third-party services
 * 
 * States:
 * - CLOSED: Normal execution. Failures increment failure counter.
 * - OPEN: Failures exceeded threshold. Action fails immediately or runs fallback.
 * - HALF_OPEN: Reset timeout expired. Trial executions probe recovery.
 */
export class CircuitBreaker implements ICircuitBreaker {
  private state: CircuitBreakerState = 'CLOSED';
  private failureCount = 0;
  private successCount = 0;
  private lastFailureTime?: number;
  private totalCalls = 0;
  private rejectedCalls = 0;

  private readonly options: CircuitBreakerOptions;
  private readonly name: string;

  constructor(name: string, options?: Partial<CircuitBreakerOptions>) {
    this.name = name;
    this.options = {
      failureThreshold: options?.failureThreshold ?? 5,
      resetTimeoutMs: options?.resetTimeoutMs ?? 10000,
      successThreshold: options?.successThreshold ?? 2,
      fallback: options?.fallback,
    };
  }

  public async execute<T>(action: () => Promise<T>): Promise<T> {
    this.totalCalls++;

    // 1. Check if OPEN state has expired and should transition to HALF_OPEN
    if (this.state === 'OPEN') {
      const now = Date.now();
      if (this.lastFailureTime && now - this.lastFailureTime >= this.options.resetTimeoutMs) {
        this.transitionTo('HALF_OPEN');
      } else {
        this.rejectedCalls++;
        logger.warn({ circuit: this.name, state: this.state }, 'CircuitBreaker: Request rejected while OPEN');

        if (this.options.fallback) {
          return this.options.fallback();
        }
        throw new Error(`CircuitBreaker [${this.name}] is OPEN. Fast-failing request.`);
      }
    }

    // 2. Execute action within CLOSED or HALF_OPEN state
    try {
      const result = await action();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure(error);
      throw error;
    }
  }

  private onSuccess(): void {
    if (this.state === 'HALF_OPEN') {
      this.successCount++;
      if (this.successCount >= this.options.successThreshold) {
        this.transitionTo('CLOSED');
      }
    } else {
      this.failureCount = 0;
    }
  }

  private onFailure(error: any): void {
    this.lastFailureTime = Date.now();
    this.failureCount++;

    logger.error(
      { circuit: this.name, error: error?.message || error, failures: this.failureCount },
      'CircuitBreaker: Action failed'
    );

    if (this.state === 'HALF_OPEN' || this.failureCount >= this.options.failureThreshold) {
      this.transitionTo('OPEN');
    }
  }

  private transitionTo(newState: CircuitBreakerState): void {
    logger.info({ circuit: this.name, from: this.state, to: newState }, 'CircuitBreaker: State transition');
    this.state = newState;

    if (newState === 'CLOSED') {
      this.failureCount = 0;
      this.successCount = 0;
    } else if (newState === 'HALF_OPEN') {
      this.successCount = 0;
    }
  }

  public getState(): CircuitBreakerState {
    return this.state;
  }

  public getMetrics(): CircuitBreakerMetrics {
    return {
      state: this.state,
      failures: this.failureCount,
      successes: this.successCount,
      lastFailureTime: this.lastFailureTime,
      totalCalls: this.totalCalls,
      rejectedCalls: this.rejectedCalls,
    };
  }

  public reset(): void {
    this.transitionTo('CLOSED');
  }
}

const circuitBreakers = new Map<string, CircuitBreaker>();

export function getCircuitBreaker(name: string, options?: Partial<CircuitBreakerOptions>): CircuitBreaker {
  if (!circuitBreakers.has(name)) {
    circuitBreakers.set(name, new CircuitBreaker(name, options));
  }
  return circuitBreakers.get(name)!;
}

export async function withCircuitBreaker<T>(
  name: string,
  action: () => Promise<T>,
  options?: Partial<CircuitBreakerOptions>
): Promise<T> {
  const breaker = getCircuitBreaker(name, options);
  return breaker.execute(action);
}

