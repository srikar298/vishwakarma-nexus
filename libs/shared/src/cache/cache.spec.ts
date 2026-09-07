import { describe, it, expect, beforeEach } from 'vitest';
import { 
  MemoryCacheProvider, 
  HybridCacheProvider,
  CacheFactory,
  cacheProvider 
} from './index';

describe('Caching Subsystem: Production Audit Test Suite', () => {
  describe('MemoryCacheProvider (LRU Eviction & TTL)', () => {
    let cache: MemoryCacheProvider;

    beforeEach(() => {
      cache = new MemoryCacheProvider({ maxEntries: 3 });
    });

    it('stores and retrieves items correctly', async () => {
      await cache.set('k1', { name: 'Vishwakarma' }, { ttlSeconds: 10 });
      const val = await cache.get<{ name: string }>('k1');
      expect(val).toEqual({ name: 'Vishwakarma' });
    });

    it('evicts expired items on access', async () => {
      await cache.set('k-exp', 'temp', { ttlSeconds: 0.05 }); // 50ms TTL
      expect(await cache.get('k-exp')).toBe('temp');

      await new Promise((r) => setTimeout(r, 70));
      expect(await cache.get('k-exp')).toBeNull();
    });

    it('enforces LRU capacity by evicting the least recently used key', async () => {
      await cache.set('a', 1);
      await cache.set('b', 2);
      await cache.set('c', 3);

      // Access 'a' to make it most recently used (LRU order becomes: b, c, a)
      await cache.get('a');

      // Insert 4th item (capacity is 3) -> 'b' must be evicted!
      await cache.set('d', 4);

      expect(await cache.get('b')).toBeNull();
      expect(await cache.get('a')).toBe(1);
      expect(await cache.get('c')).toBe(3);
      expect(await cache.get('d')).toBe(4);
      expect(cache.size()).toBe(3);
    });
  });

  describe('Cache Stampede / Dogpiling Guard (getOrSet)', () => {
    let cache: MemoryCacheProvider;

    beforeEach(() => {
      cache = new MemoryCacheProvider();
    });

    it('coalesces 40 simultaneous cache misses into exactly 1 fetcher call', async () => {
      let databaseQueryCount = 0;

      const fetchProfileFromDb = async () => {
        databaseQueryCount++;
        await new Promise((r) => setTimeout(r, 25)); // simulate 25ms Postgres query
        return { profileId: 'prof_999', name: 'Ravi Chary' };
      };

      // 40 parallel requests hitting cold cache simultaneously
      const parallelRequests = Array.from({ length: 40 }).map(() =>
        cache.getOrSet('profile:prof_999', fetchProfileFromDb, { ttlSeconds: 60 })
      );

      const results = await Promise.all(parallelRequests);

      expect(databaseQueryCount).toBe(1); // Crucial: ONLY 1 DB Query!
      for (const res of results) {
        expect(res).toEqual({ profileId: 'prof_999', name: 'Ravi Chary' });
      }

      // Subsequent call hits cache directly
      const cached = await cache.get<{ profileId: string }>('profile:prof_999');
      expect(cached?.profileId).toBe('prof_999');
    });
  });

  describe('Tag-Based & Pattern Invalidation', () => {
    let cache: MemoryCacheProvider;

    beforeEach(() => {
      cache = new MemoryCacheProvider();
    });

    it('invalidates all keys associated with a tag', async () => {
      await cache.set('member:101:profile', { id: 101 }, { tags: ['member:101', 'matrimony'] });
      await cache.set('member:101:reviews', ['good'], { tags: ['member:101', 'artisan'] });
      await cache.set('member:102:profile', { id: 102 }, { tags: ['member:102'] });

      // Invalidate member:101
      const count = await cache.invalidateByTag('member:101');
      expect(count).toBe(2);

      // member 101 keys are gone
      expect(await cache.get('member:101:profile')).toBeNull();
      expect(await cache.get('member:101:reviews')).toBeNull();

      // member 102 key is preserved untouched
      expect(await cache.get('member:102:profile')).toEqual({ id: 102 });
    });

    it('invalidates keys by wildcard pattern', async () => {
      await cache.set('directory:hyderabad:carpentry', 'c1');
      await cache.set('directory:hyderabad:sculpture', 's1');
      await cache.set('directory:bangalore:carpentry', 'c2');

      const evicted = await cache.invalidateByPattern('directory:hyderabad:*');
      expect(evicted).toBe(2);

      expect(await cache.get('directory:hyderabad:carpentry')).toBeNull();
      expect(await cache.get('directory:hyderabad:sculpture')).toBeNull();
      expect(await cache.get('directory:bangalore:carpentry')).toBe('c2');
    });
  });

  describe('HybridCacheProvider (Two-Tier L1 + L2)', () => {
    it('serves from L1 memory and backfills from L2', async () => {
      const l2Mock = new MemoryCacheProvider();
      const hybrid = new HybridCacheProvider(l2Mock);

      // Pre-populate L2 directly
      await l2Mock.set('hybrid-key', 'from-l2', { ttlSeconds: 100 });

      // 1st get reads from L2 and populates L1
      const res1 = await hybrid.get<string>('hybrid-key');
      expect(res1).toBe('from-l2');

      // Update L2 only to verify L1 fast hit
      await l2Mock.set('hybrid-key', 'changed-in-l2', { ttlSeconds: 100 });
      const res2 = await hybrid.get<string>('hybrid-key');
      expect(res2).toBe('from-l2'); // Served from fast L1!

      // Delete from hybrid clears both tiers
      await hybrid.delete('hybrid-key');
      expect(await hybrid.get('hybrid-key')).toBeNull();
      expect(await l2Mock.get('hybrid-key')).toBeNull();
    });
  });

  describe('CacheFactory', () => {
    it('provides a singleton cache provider', () => {
      const provider = CacheFactory.getProvider();
      expect(provider).toBeDefined();
      expect(typeof provider.get).toBe('function');
      expect(typeof provider.set).toBe('function');
      expect(typeof provider.getOrSet).toBe('function');
    });
  });
});
