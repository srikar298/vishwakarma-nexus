import { ICacheProvider, IAtomicProvider, CacheOptions } from '../interfaces/cache-provider.interface';
import { getOrSetWithStampedeGuard } from '../cache-aside';

interface CacheEntry<T> {
  value: T;
  expiresAt: number | null;
  tags?: string[];
}

/**
 * Low-Level Design (LLD): Production O(1) LRU In-Memory Cache Provider
 * Uses JavaScript Map insertion-order mechanics for true O(1) LRU eviction,
 * combined with Tag-Based Invalidation and Cache Stampede protection.
 */
export class MemoryCacheProvider implements ICacheProvider, IAtomicProvider {
  private store = new Map<string, CacheEntry<any>>();
  private tagIndex = new Map<string, Set<string>>(); // tag -> Set of keys
  private readonly maxEntries: number;

  constructor(options: { maxEntries?: number } = {}) {
    this.maxEntries = options.maxEntries || 5000;
  }

  public async get<T>(key: string): Promise<T | null> {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (entry.expiresAt && entry.expiresAt <= Date.now()) {
      this.deleteInternal(key);
      return null;
    }

    // Refresh LRU position by re-inserting at the end of the Map
    this.store.delete(key);
    this.store.set(key, entry);

    return entry.value as T;
  }

  public async set(key: string, value: any, options?: CacheOptions | number): Promise<void> {
    const ttlSeconds = typeof options === 'number' ? options : options?.ttlSeconds;
    const tags = typeof options === 'object' ? options?.tags : undefined;

    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;

    // If key exists, delete first to refresh its LRU position and tags
    if (this.store.has(key)) {
      this.deleteInternal(key);
    } else if (this.store.size >= this.maxEntries) {
      // Evict least recently used (first key in Map)
      const oldestKey = this.store.keys().next().value;
      if (oldestKey) {
        this.deleteInternal(oldestKey);
      }
    }

    // Register new tags
    if (tags && tags.length > 0) {
      for (const tag of tags) {
        if (!this.tagIndex.has(tag)) {
          this.tagIndex.set(tag, new Set());
        }
        this.tagIndex.get(tag)!.add(key);
      }
    }

    this.store.set(key, {
      value,
      expiresAt,
      tags,
    });
  }

  public async delete(key: string): Promise<void> {
    this.deleteInternal(key);
  }

  private deleteInternal(key: string): void {
    const entry = this.store.get(key);
    if (entry?.tags) {
      for (const tag of entry.tags) {
        const set = this.tagIndex.get(tag);
        if (set) {
          set.delete(key);
          if (set.size === 0) {
            this.tagIndex.delete(tag);
          }
        }
      }
    }
    this.store.delete(key);
  }

  public async exists(key: string): Promise<boolean> {
    const val = await this.get(key);
    return val !== null;
  }

  public async getOrSet<T>(
    key: string, 
    fetcher: () => Promise<T>, 
    options?: CacheOptions | number
  ): Promise<T> {
    return getOrSetWithStampedeGuard(this, key, fetcher, options);
  }

  public async invalidateByTag(tag: string): Promise<number> {
    const keys = this.tagIndex.get(tag);
    if (!keys || keys.size === 0) return 0;

    let count = 0;
    const keyList = Array.from(keys);
    for (const key of keyList) {
      this.deleteInternal(key);
      count++;
    }

    this.tagIndex.delete(tag);
    return count;
  }

  public async invalidateByTags(tags: string[]): Promise<number> {
    let count = 0;
    for (const tag of tags) {
      count += await this.invalidateByTag(tag);
    }
    return count;
  }

  public async invalidateByPattern(pattern: string): Promise<number> {
    const regexPattern = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    let count = 0;

    for (const key of Array.from(this.store.keys())) {
      if (regexPattern.test(key)) {
        this.deleteInternal(key);
        count++;
      }
    }

    return count;
  }

  public async increment(key: string, ttlSeconds: number): Promise<number> {
    const current = (await this.get<number>(key)) || 0;
    const next = current + 1;
    await this.set(key, next, ttlSeconds);
    return next;
  }

  public async executeLua<T>(_script: string, _keys: string[], _args: any[]): Promise<T> {
    return null as any;
  }

  public async addToSet(key: string, member: string): Promise<void> {
    const existing = (await this.get<string[]>(key)) || [];
    if (!existing.includes(member)) {
      existing.push(member);
      await this.set(key, existing);
    }
  }

  public async removeFromSet(key: string, member: string): Promise<void> {
    const existing = (await this.get<string[]>(key)) || [];
    const filtered = existing.filter((m) => m !== member);
    await this.set(key, filtered);
  }

  public async getSet(key: string): Promise<string[]> {
    return (await this.get<string[]>(key)) || [];
  }

  public async expire(key: string, ttlSeconds: number): Promise<boolean> {
    const entry = this.store.get(key);
    if (!entry) return false;
    entry.expiresAt = Date.now() + ttlSeconds * 1000;
    return true;
  }

  public clear(): void {
    this.store.clear();
    this.tagIndex.clear();
  }

  public size(): number {
    return this.store.size;
  }
}
