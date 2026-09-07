/**
 * LLD: Generic Interface for Cache Providers
 * Follows the Dependency Inversion Principle (DIP).
 */
export interface ICacheProvider {
  /**
   * Retrieves a value from the cache.
   */
  get<T>(key: string): Promise<T | null>;

  /**
   * Sets a value in the cache with an optional TTL (Time To Live).
   * @param ttlSeconds TTL in seconds. Recommended to add jitter in implementation.
   */
  set(key: string, value: any, ttlSeconds?: number): Promise<void>;

  /**
   * Deletes a value from the cache.
   */
  delete(key: string): Promise<void>;

  /**
   * Checks if a key exists.
   */
  exists(key: string): Promise<boolean>;

  /**
   * Set operations and TTL expiration.
   */
  addToSet(key: string, member: string): Promise<void>;
  removeFromSet(key: string, member: string): Promise<void>;
  getSet(key: string): Promise<string[]>;
  expire(key: string, ttlSeconds: number): Promise<boolean | void>;
}

/**
 * Interface for Atomic Operations using Lua scripts or Redis native atomicity.
 */
export interface IAtomicProvider {
  /**
   * Increments a counter and returns the new value.
   * Useful for rate limiting or attempt counting.
   */
  increment(key: string, ttlSeconds: number): Promise<number>;

  /**
   * Executes a custom Lua script.
   */
  executeLua<T>(script: string, keys: string[], args: any[]): Promise<T>;
}
