import { logger } from '../../logger';

interface InFlightCall<T> {
  promise: Promise<T>;
  waitersCount: number;
}

/**
 * Low-Level Design (LLD): SingleFlight (In-Flight Request Deduplication / Coalescer)
 * Suppresses duplicate concurrent in-flight requests for the same key.
 * 
 * Example: If 100 clients request `matrimony:profile:999` at the exact same millisecond,
 * only 1 database query executes, and all 100 clients receive the single resolved value.
 */
export class SingleFlight {
  private inFlight = new Map<string, InFlightCall<any>>();

  public async do<T>(key: string, fn: () => Promise<T>): Promise<T> {
    const existing = this.inFlight.get(key);

    if (existing) {
      existing.waitersCount++;
      // TASK: [Telemetry Integration] Increment single_flight_deduplicated_total counter
      logger.debug({ key, waitersCount: existing.waitersCount }, 'SingleFlight: Coalescing in-flight duplicate call');
      return existing.promise as Promise<T>;
    }

    const callRecord: InFlightCall<T> = {
      promise: (async () => {
        try {
          return await fn();
        } finally {
          this.inFlight.delete(key);
        }
      })(),
      waitersCount: 1,
    };

    this.inFlight.set(key, callRecord);
    return callRecord.promise;
  }

  public getInFlightCount(): number {
    return this.inFlight.size;
  }

  public has(key: string): boolean {
    return this.inFlight.has(key);
  }
}

export const defaultSingleFlight = new SingleFlight();
