import { createHash } from 'crypto';
import { 
  IdempotencyCheckResult, 
  IdempotencyOptions, 
  IdempotencyRecord 
} from './idempotency.interface';
import { ICacheProvider } from '../../cache/interfaces/cache-provider.interface';
import { cacheProvider } from '../../cache/cache.factory';
import { IDistributedLockProvider } from '../../concurrency/interfaces/distributed-lock.interface';
import { lockProvider } from '../../concurrency/lock.factory';
import { logger } from '../../logger';

/**
 * Low-Level Design (LLD): Enterprise Idempotency Engine
 * Implements IETF / Stripe RFC standard idempotency with SHA-256 request fingerprinting,
 * atomic in-progress locking, and response replay.
 */
export class IdempotencyEngine {
  constructor(
    private cache: ICacheProvider = cacheProvider,
    private lock: IDistributedLockProvider = lockProvider
  ) {}

  /**
   * Computes a deterministic SHA-256 checksum of the incoming HTTP request.
   */
  public computeFingerprint(method: string, url: string, body: any): string {
    const canonicalBody = body ? JSON.stringify(body, Object.keys(body).sort()) : '';
    const rawPayload = `${method.toUpperCase()}:${url.toLowerCase()}:${canonicalBody}`;
    return createHash('sha256').update(rawPayload).digest('hex');
  }

  /**
   * Atomically checks for an existing record or acquires the in-progress slot.
   */
  public async checkAndAcquire(
    userId: string,
    idempotencyKey: string,
    fingerprint: string,
    options?: IdempotencyOptions
  ): Promise<IdempotencyCheckResult> {
    const cacheKey = `idemp:${userId}:${idempotencyKey}`;
    const lockKey = `lock:${cacheKey}`;
    const inProgressTtlSeconds = options?.lockTtlSeconds ?? 30;

    return this.lock.withLock(lockKey, async () => {
      // 1. Check if record already exists in cache
      const existing = await this.cache.get<IdempotencyRecord>(cacheKey);

      if (existing) {
        // Security Check: Verify that payload fingerprint matches the original request
        if (existing.fingerprint !== fingerprint) {
          // TASK: [Telemetry Integration] Increment idempotency_fingerprint_mismatch_total counter
          logger.warn(
            { cacheKey, expected: existing.fingerprint, actual: fingerprint },
            'IdempotencyEngine: Request payload fingerprint mismatch'
          );
          return {
            state: 'FINGERPRINT_MISMATCH',
            expectedFingerprint: existing.fingerprint,
            actualFingerprint: fingerprint,
          };
        }

        if (existing.status === 'IN_PROGRESS') {
          return {
            state: 'IN_PROGRESS',
            retryAfterSeconds: 2,
          };
        }

        if (existing.status === 'COMPLETED') {
          return {
            state: 'REPLAY_READY',
            record: existing,
          };
        }
      }

      // 2. No record exists: Atomically register IN_PROGRESS state
      const initialRecord: IdempotencyRecord = {
        idempotencyKey,
        fingerprint,
        status: 'IN_PROGRESS',
        createdAt: Date.now(),
      };

      await this.cache.set(cacheKey, initialRecord, { ttlSeconds: inProgressTtlSeconds });

      return {
        state: 'NEW_ACQUIRED',
        lockToken: cacheKey,
      };
    }, { ttlMs: 5000 });
  }

  /**
   * Caches the completed HTTP response for 24h replay.
   */
  public async saveCompleted(
    userId: string,
    idempotencyKey: string,
    fingerprint: string,
    responseStatus: number,
    responseBody: any,
    responseHeaders?: Record<string, string>,
    options?: IdempotencyOptions
  ): Promise<void> {
    const cacheKey = `idemp:${userId}:${idempotencyKey}`;
    const ttlSeconds = options?.ttlSeconds ?? 86400; // 24 hours

    const completedRecord: IdempotencyRecord = {
      idempotencyKey,
      fingerprint,
      status: 'COMPLETED',
      responseStatus,
      responseBody,
      responseHeaders,
      createdAt: Date.now(),
      completedAt: Date.now(),
    };

    await this.cache.set(cacheKey, completedRecord, { ttlSeconds });
    logger.debug({ cacheKey, responseStatus }, 'IdempotencyEngine: Response successfully saved for replay');
  }

  /**
   * Releases an in-progress lock on unexpected server failure.
   */
  public async releaseLock(userId: string, idempotencyKey: string): Promise<void> {
    const cacheKey = `idemp:${userId}:${idempotencyKey}`;
    const existing = await this.cache.get<IdempotencyRecord>(cacheKey);
    if (existing && existing.status === 'IN_PROGRESS') {
      await this.cache.delete(cacheKey);
      logger.debug({ cacheKey }, 'IdempotencyEngine: In-progress lock released on error');
    }
  }
}

export const defaultIdempotencyEngine = new IdempotencyEngine();
