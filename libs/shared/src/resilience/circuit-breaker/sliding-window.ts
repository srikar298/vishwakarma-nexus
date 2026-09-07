export interface WindowSnapshot {
  totalCalls: number;
  failureCount: number;
  successCount: number;
  slowCallCount: number;
  failureRatePercentage: number;
  slowCallRatePercentage: number;
}

interface CallRecord {
  timestamp: number;
  isFailure: boolean;
  isSlow: boolean;
}

/**
 * Low-Level Design (LLD): Sliding Window Metric Tracker
 * Tracks request outcomes over a rolling count or time window
 * to compute real-time error rates and latency anomalies without unbounded memory growth.
 */
export class SlidingWindow {
  private records: CallRecord[] = [];
  private readonly windowSize: number;
  private readonly type: 'COUNT' | 'TIME';
  private readonly timeWindowMs: number;
  private readonly slowCallThresholdMs: number;

  constructor(options: {
    type?: 'COUNT' | 'TIME';
    size?: number;
    timeWindowMs?: number;
    slowCallThresholdMs?: number;
  } = {}) {
    this.type = options.type || 'COUNT';
    this.windowSize = options.size || 20;
    this.timeWindowMs = options.timeWindowMs || 10000;
    this.slowCallThresholdMs = options.slowCallThresholdMs || 2000;
  }

  public recordSuccess(durationMs: number): void {
    this.recordOutcome(false, durationMs);
  }

  public recordFailure(durationMs: number): void {
    this.recordOutcome(true, durationMs);
  }

  private recordOutcome(isFailure: boolean, durationMs: number): void {
    const now = Date.now();
    const isSlow = durationMs >= this.slowCallThresholdMs;

    this.records.push({
      timestamp: now,
      isFailure,
      isSlow,
    });

    this.prune(now);
  }

  private prune(now: number): void {
    if (this.type === 'COUNT') {
      if (this.records.length > this.windowSize) {
        this.records.splice(0, this.records.length - this.windowSize);
      }
    } else {
      const cutoff = now - this.timeWindowMs;
      while (this.records.length > 0 && this.records[0].timestamp < cutoff) {
        this.records.shift();
      }
    }
  }

  public getSnapshot(): WindowSnapshot {
    const now = Date.now();
    this.prune(now);

    const totalCalls = this.records.length;
    if (totalCalls === 0) {
      return {
        totalCalls: 0,
        failureCount: 0,
        successCount: 0,
        slowCallCount: 0,
        failureRatePercentage: 0,
        slowCallRatePercentage: 0,
      };
    }

    let failureCount = 0;
    let slowCallCount = 0;

    for (const record of this.records) {
      if (record.isFailure) failureCount++;
      if (record.isSlow) slowCallCount++;
    }

    const successCount = totalCalls - failureCount;
    const failureRatePercentage = (failureCount / totalCalls) * 100;
    const slowCallRatePercentage = (slowCallCount / totalCalls) * 100;

    return {
      totalCalls,
      failureCount,
      successCount,
      slowCallCount,
      failureRatePercentage: Math.round(failureRatePercentage * 100) / 100,
      slowCallRatePercentage: Math.round(slowCallRatePercentage * 100) / 100,
    };
  }

  public reset(): void {
    this.records = [];
  }
}
