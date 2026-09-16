import { cacheProvider, logger } from "@vishwakarma-k-c/shared";

/**
 * Low-Level Design (LLD): Atomic Monotonic Digital ID Sequencing Service
 * Replaces global distributed mutex locks with O(1) atomic counter primitives.
 * Eliminates Birthday Paradox collisions and cluster serialization bottlenecks.
 */
export class DigitalIdService {
  private static readonly BASE_OFFSET = 100000;

  /**
   * Generates a collision-proof, monotonically increasing Digital ID: VKC-{YEAR}-{SEQUENCE}
   * O(1) atomic operation across distributed clusters without distributed locks.
   */
  public static async nextId(year: number = new Date().getFullYear()): Promise<string> {
    const counterKey = `counters:digital_id:${year}`;

    // Atomic monotonic increment across distributed cluster (0 = persistent counter, no TTL)
    const currentSeq = await cacheProvider.increment(counterKey, 0);
    const sequenceNumber = this.BASE_OFFSET + currentSeq;

    const digitalId = `VKC-${year}-${sequenceNumber}`;
    logger.debug({ digitalId, year, currentSeq }, "Allocated monotonic Digital ID");
    return digitalId;
  }
}
