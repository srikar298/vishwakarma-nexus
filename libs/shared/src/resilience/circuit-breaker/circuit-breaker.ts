import { 
  CircuitBreakerOptions, 
  CircuitBreakerState, 
  CircuitBreakerMetrics, 
  ICircuitBreaker,
  StateChangeCallback
} from './circuit-breaker.interface';
import { SlidingWindow } from './sliding-window';
import { logger } from '../../logger';

const DEFAULT_OPTIONS: CircuitBreakerOptions = {
  failureRateThreshold: 50, // 50% error rate trips circuit
  minimumNumberOfCalls: 10,
  resetTimeoutMs: 15000, // 15 seconds cooldown
  permittedNumberOfCallsInHalfOpenState: 3, // Probe with 3 requests in HALF_OPEN
  halfOpenSuccessThreshold: 100, // 100% of probe calls must pass to close
  slidingWindowType: 'COUNT',
  slidingWindowSize: 20,
  slowCallDurationThresholdMs: 3000,
  isFailure: () => true, // By default all thrown exceptions count as failures
};

/**
 * Low-Level Design (LLD): Production-Grade Circuit Breaker
 * Features:
 * 1. Sliding Window (Count/Time) failure and latency rate tracking.
 * 2. Strict Half-Open concurrency throttle to prevent thundering herds on recovery.
 * 3. Configurable error classifier to ignore client 4xx validation errors.
 * 4. State change listeners for observability and telemetry.
 */
export class CircuitBreaker implements ICircuitBreaker {
  public readonly name: string;
  private state: CircuitBreakerState = 'CLOSED';
  private readonly options: CircuitBreakerOptions;
  private readonly slidingWindow: SlidingWindow;

  private lastStateChangeTimestamp: number = Date.now();
  private rejectedCalls = 0;
  private totalCalls = 0;

  // HALF_OPEN probe state management
  private halfOpenCallsActive = 0;
  private halfOpenTrialResults: { successes: number; failures: number } = { successes: 0, failures: 0 };

  private stateChangeListeners: Set<StateChangeCallback> = new Set();

  constructor(name: string, options?: Partial<CircuitBreakerOptions>) {
    this.name = name;
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.slidingWindow = new SlidingWindow({
      type: this.options.slidingWindowType,
      size: this.options.slidingWindowSize,
      timeWindowMs: this.options.slidingWindowSize,
      slowCallThresholdMs: this.options.slowCallDurationThresholdMs,
    });
  }

  public async execute<T>(action: () => Promise<T>): Promise<T> {
    this.totalCalls++;

    // 1. Evaluate State Transitions & Check if Allowed to Proceed
    this.evaluateState();

    if (this.state === 'OPEN') {
      this.rejectedCalls++;
      // TASK: [Telemetry Integration] Increment Prometheus circuit_breaker_rejected_total counter
      logger.warn({ circuit: this.name, state: this.state }, 'CircuitBreaker: Call rejected while OPEN');

      if (this.options.fallback) {
        return this.options.fallback();
      }
      throw new Error(`CircuitBreaker [${this.name}] is OPEN. Service temporarily unavailable.`);
    }

    if (this.state === 'HALF_OPEN') {
      if (this.halfOpenCallsActive >= this.options.permittedNumberOfCallsInHalfOpenState) {
        this.rejectedCalls++;
        logger.warn({ circuit: this.name, state: this.state }, 'CircuitBreaker: Call rejected in HALF_OPEN (Probe limit reached)');
        
        if (this.options.fallback) {
          return this.options.fallback();
        }
        throw new Error(`CircuitBreaker [${this.name}] is probing in HALF_OPEN. Additional traffic throttled.`);
      }
      this.halfOpenCallsActive++;
    }

    // 2. Execute Action with High-Resolution Timing
    const startTime = process.hrtime();

    try {
      const result = await action();
      const [seconds, nanoseconds] = process.hrtime(startTime);
      const durationMs = seconds * 1000 + nanoseconds / 1e6;

      this.onSuccess(durationMs);
      return result;
    } catch (error) {
      const [seconds, nanoseconds] = process.hrtime(startTime);
      const durationMs = seconds * 1000 + nanoseconds / 1e6;

      const isCountableFailure = this.options.isFailure ? this.options.isFailure(error) : true;
      if (isCountableFailure) {
        this.onFailure(error, durationMs);
      } else {
        // Ignored error (e.g. client validation 4xx) is recorded as success from downstream connectivity perspective
        this.onSuccess(durationMs);
      }

      throw error;
    } finally {
      if (this.state === 'HALF_OPEN') {
        this.halfOpenCallsActive--;
      }
    }
  }

  private evaluateState(): void {
    const now = Date.now();
    if (this.state === 'OPEN') {
      if (now - this.lastStateChangeTimestamp >= this.options.resetTimeoutMs) {
        this.transitionTo('HALF_OPEN');
      }
    }
  }

  private onSuccess(durationMs: number): void {
    if (this.state === 'HALF_OPEN') {
      this.halfOpenTrialResults.successes++;
      const totalTrials = this.halfOpenTrialResults.successes + this.halfOpenTrialResults.failures;

      if (totalTrials >= this.options.permittedNumberOfCallsInHalfOpenState) {
        const successRate = (this.halfOpenTrialResults.successes / totalTrials) * 100;
        if (successRate >= this.options.halfOpenSuccessThreshold) {
          this.transitionTo('CLOSED');
        } else {
          this.transitionTo('OPEN');
        }
      }
    } else if (this.state === 'CLOSED') {
      this.slidingWindow.recordSuccess(durationMs);
    }
  }

  private onFailure(error: unknown, durationMs: number): void {
    // TASK: [Telemetry Integration] Record failure metric with error classifier tags
    logger.error(
      { circuit: this.name, state: this.state, error: error instanceof Error ? error.message : String(error) },
      'CircuitBreaker: Action execution failed'
    );

    if (this.state === 'HALF_OPEN') {
      this.halfOpenTrialResults.failures++;
      // Any trial failure during HALF_OPEN immediately trips back to OPEN
      this.transitionTo('OPEN');
    } else if (this.state === 'CLOSED') {
      this.slidingWindow.recordFailure(durationMs);

      const snapshot = this.slidingWindow.getSnapshot();
      if (snapshot.totalCalls >= this.options.minimumNumberOfCalls) {
        if (snapshot.failureRatePercentage >= this.options.failureRateThreshold) {
          logger.warn(
            { 
              circuit: this.name, 
              failureRate: `${snapshot.failureRatePercentage}%`, 
              threshold: `${this.options.failureRateThreshold}%` 
            }, 
            'CircuitBreaker: Failure threshold exceeded. Tripping circuit to OPEN.'
          );
          this.transitionTo('OPEN');
        }
      }
    }
  }

  private transitionTo(newState: CircuitBreakerState): void {
    if (this.state === newState) return;

    const fromState = this.state;
    this.state = newState;
    this.lastStateChangeTimestamp = Date.now();

    if (newState === 'HALF_OPEN') {
      this.halfOpenCallsActive = 0;
      this.halfOpenTrialResults = { successes: 0, failures: 0 };
    } else if (newState === 'CLOSED') {
      this.slidingWindow.reset();
      this.halfOpenCallsActive = 0;
      this.halfOpenTrialResults = { successes: 0, failures: 0 };
    }

    logger.info({ circuit: this.name, from: fromState, to: newState }, 'CircuitBreaker: State transition occurred');

    // TASK: [Telemetry Integration] Emit OpenTelemetry span event and Prometheus gauge update for circuit state (Component 10)
    // TASK: [EventBus Integration] Emit CircuitStateChangedEvent onto EventBus (Component 5) for cluster-wide awareness
    // TASK: [Lifecycle Integration] Register circuit breaker reset/drain hook in GracefulShutdownManager (Component 11)
    const metrics = this.getMetrics();
    for (const listener of this.stateChangeListeners) {
      try {
        listener(fromState, newState, metrics);
      } catch (err) {
        logger.error({ circuit: this.name, error: err }, 'CircuitBreaker: Error in state change listener');
      }
    }
  }

  public getState(): CircuitBreakerState {
    this.evaluateState();
    return this.state;
  }

  public getMetrics(): CircuitBreakerMetrics {
    const snapshot = this.slidingWindow.getSnapshot();
    return {
      state: this.state,
      totalCalls: this.totalCalls,
      failureCount: snapshot.failureCount,
      successCount: snapshot.successCount,
      slowCallCount: snapshot.slowCallCount,
      failureRatePercentage: snapshot.failureRatePercentage,
      slowCallRatePercentage: snapshot.slowCallRatePercentage,
      rejectedCalls: this.rejectedCalls,
      lastStateChangeTimestamp: this.lastStateChangeTimestamp,
    };
  }

  public onStateChange(callback: StateChangeCallback): () => void {
    this.stateChangeListeners.add(callback);
    return () => {
      this.stateChangeListeners.delete(callback);
    };
  }

  public reset(): void {
    this.transitionTo('CLOSED');
    this.slidingWindow.reset();
    this.rejectedCalls = 0;
    this.totalCalls = 0;
  }

  public forceOpen(): void {
    this.transitionTo('OPEN');
  }

  public forceClose(): void {
    this.transitionTo('CLOSED');
  }
}

// Global Circuit Breaker Registry
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
