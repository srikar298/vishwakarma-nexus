import { ICacheProvider, IAtomicProvider } from '../interfaces/cache-provider.interface';

interface CacheEntry<T> {
  value: T;
  expiresAt: number | null;
}

/**
 * Low-Level Design (LLD): In-Memory Cache Provider
 * Zero-dependency cache with TTL expiration and atomic increments for local dev, testing, and fallback.
 */
export class MemoryCacheProvider implements ICacheProvider, IAtomicProvider {
  private store = new Map<string, CacheEntry<any>>();

  public async get<T>(key: string): Promise<T | null> {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (entry.expiresAt && entry.expiresAt <= Date.now()) {
      this.store.delete(key);
      return null;
    }

    return entry.value as T;
  }

  public async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
    this.store.set(key, { value, expiresAt });
  }

  public async delete(key: string): Promise<void> {
    this.store.delete(key);
  }

  public async exists(key: string): Promise<boolean> {
    const val = await this.get(key);
    return val !== null;
  }

  public async increment(key: string, ttlSeconds: number): Promise<number> {
    const current = (await this.get<number>(key)) || 0;
    const next = current + 1;
    await this.set(key, next, ttlSeconds);
    return next;
  }

  public async executeLua<T>(_script: string, _keys: string[], _args: any[]): Promise<T> {
    // In-memory fallback simulation for custom Lua scripts
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
  }
}
