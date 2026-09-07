import { CacheOptions, ICacheProvider } from './interfaces/cache-provider.interface';
import { defaultSingleFlight, SingleFlight } from '../concurrency/single-flight/single-flight';
import { logger } from '../logger';

/**
 * Low-Level Design (LLD): Cache-Aside Helper with Cache Stampede / Dogpiling Guard
 * Coalesces parallel cache misses using SingleFlight so that only 1 underlying database fetch runs.
 */
export async function getOrSetWithStampedeGuard<T>(
  cache: ICacheProvider,
  key: string,
  fetcher: () => Promise<T>,
  options?: CacheOptions | number,
  singleFlight: SingleFlight = defaultSingleFlight
): Promise<T> {
  // 1. Fast path: Read from cache directly
  const cachedValue = await cache.get<T>(key);
  if (cachedValue !== null && cachedValue !== undefined) {
    return cachedValue;
  }

  // 2. Cache miss: Coalesce parallel fetcher executions using SingleFlight
  const result = await singleFlight.do(`stampede:${key}`, async () => {
    // Re-check cache inside SingleFlight in case a previous parallel execution already populated it
    const secondCheck = await cache.get<T>(key);
    if (secondCheck !== null && secondCheck !== undefined) {
      return secondCheck;
    }

    // TASK: [Telemetry Integration] Increment cache_stampede_guarded_total counter
    logger.debug({ key }, 'CacheAside: Executing underlying fetcher on cache miss');
    const freshValue = await fetcher();

    // 3. Write back to cache with configured TTL and tags
    await cache.set(key, freshValue, options);
    return freshValue;
  });

  return result;
}
