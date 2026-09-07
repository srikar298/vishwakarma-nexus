export class BulkheadFullError extends Error {
  constructor(message = 'Bulkhead execution queue is full. Request rejected.') {
    super(message);
    this.name = 'BulkheadFullError';
  }
}

export class BulkheadTimeoutError extends Error {
  constructor(message = 'Bulkhead queue wait time exceeded.') {
    super(message);
    this.name = 'BulkheadTimeoutError';
  }
}

export interface BulkheadOptions {
  /** Maximum number of concurrent executions permitted */
  maxConcurrent: number;
  /** Maximum number of requests allowed to wait in the queue */
  maxQueue: number;
  /** Maximum duration (ms) a request can wait in the queue before timing out */
  maxWaitTimeMs?: number;
}

export interface BulkheadMetrics {
  activeExecutions: number;
  queuedCount: number;
  totalAccepted: number;
  totalRejected: number;
  maxConcurrent: number;
  maxQueue: number;
}

/**
 * Low-Level Design (LLD): Bulkhead Pattern Contract
 * Isolates critical system resources by placing strict upper bounds
 * on concurrent execution capacity per external/downstream service.
 */
export interface IBulkhead {
  execute<T>(action: () => Promise<T>): Promise<T>;
  getMetrics(): BulkheadMetrics;
  clearQueue(): void;
}
