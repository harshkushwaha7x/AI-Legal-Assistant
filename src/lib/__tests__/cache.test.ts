import Cache from '@/lib/cache';

describe('Cache', () => {
    let cache: Cache;

    beforeEach(() => {
        cache = new Cache(10);
    });

    describe('get/set', () => {
        it('stores and retrieves values', () => {
            cache.set('key1', 'value1');
            expect(cache.get('key1')).toBe('value1');
        });

        it('returns null for missing keys', () => {
            expect(cache.get('nonexistent')).toBeNull();
        });

        it('returns null for expired entries', () => {
            cache.set('key1', 'value1', 0);
            // TTL of 0ms means it expires immediately
            expect(cache.get('key1')).toBeNull();
        });
    });

    describe('has', () => {
        it('returns true for existing keys', () => {
            cache.set('key1', 'value1');
            expect(cache.has('key1')).toBe(true);
        });

        it('returns false for missing keys', () => {
            expect(cache.has('nonexistent')).toBe(false);
        });
    });

    describe('delete', () => {
        it('removes entries', () => {
            cache.set('key1', 'value1');
            cache.delete('key1');
            expect(cache.get('key1')).toBeNull();
        });
    });

    describe('clear', () => {
        it('removes all entries', () => {
            cache.set('key1', 'value1');
            cache.set('key2', 'value2');
            cache.clear();
            expect(cache.size).toBe(0);
        });
    });

    describe('size', () => {
        it('tracks the number of entries', () => {
            expect(cache.size).toBe(0);
            cache.set('key1', 'value1');
            expect(cache.size).toBe(1);
            cache.set('key2', 'value2');
            expect(cache.size).toBe(2);
        });
    });

    describe('max size eviction', () => {
        it('evicts oldest entry when at capacity', () => {
            const smallCache = new Cache(2);
            smallCache.set('first', 1);
            smallCache.set('second', 2);
            smallCache.set('third', 3);
            expect(smallCache.get('first')).toBeNull();
            expect(smallCache.get('second')).toBe(2);
            expect(smallCache.get('third')).toBe(3);
        });
    });

    describe('cleanup', () => {
        it('removes expired entries and returns count', () => {
            cache.set('expired1', 'val', 0);
            cache.set('expired2', 'val', 0);
            cache.set('valid', 'val', 60000);
            const removed = cache.cleanup();
            expect(removed).toBe(2);
            expect(cache.size).toBe(1);
        });
    });
});
