export interface CacheOptions {
  /** TTL in seconds */
  ttlSeconds?: number;
  /** Associated cache tags for bulk invalidation */
  tags?: string[];
  /** Enable XFetch probabilistic early refresh (beta parameter) */
  earlyRefreshBeta?: number;
}

/**
 * Low-Level Design (LLD): Generic Cache Provider Interface
 * Follows Dependency Inversion Principle (DIP) and supports tag-based invalidation.
 */
export interface ICacheProvider {
  /** Retrieves a value from the cache */
  get<T>(key: string): Promise<T | null>;

  /** Sets a value in the cache with optional TTL and tags */
  set(key: string, value: any, options?: CacheOptions | number): Promise<void>;

  /** Deletes a single key from the cache */
  delete(key: string): Promise<void>;

  /** Checks if a key exists */
  exists(key: string): Promise<boolean>;

  /** Atomically gets or fetches a value, preventing Cache Stampedes / Dogpiling */
  getOrSet<T>(key: string, fetcher: () => Promise<T>, options?: CacheOptions | number): Promise<T>;

  /** Invalidates all keys associated with a specific tag */
  invalidateByTag(tag: string): Promise<number>;

  /** Invalidates all keys associated with any of the provided tags */
  invalidateByTags(tags: string[]): Promise<number>;

  /** Invalidates keys matching a glob pattern (e.g. "matrimony:user:*") */
  invalidateByPattern(pattern: string): Promise<number>;

  /** Set operations */
  addToSet(key: string, member: string): Promise<void>;
  removeFromSet(key: string, member: string): Promise<void>;
  getSet(key: string): Promise<string[]>;
  expire(key: string, ttlSeconds: number): Promise<boolean | void>;
}

/**
 * Interface for Atomic Operations using Lua scripts or Redis native atomicity.
 */
export interface IAtomicProvider {
  /** Increments a counter atomically with TTL */
  increment(key: string, ttlSeconds: number): Promise<number>;

  /** Executes a custom Lua script */
  executeLua<T>(script: string, keys: string[], args: any[]): Promise<T>;
}
