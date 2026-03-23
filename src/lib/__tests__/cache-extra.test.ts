import { createCache } from '@/lib/cache';

describe('Cache Utility', () => {
    describe('createCache', () => {
        it('creates a cache instance', () => {
            const cache = createCache<string>();
            expect(cache).toBeDefined();
            expect(cache.get).toBeDefined();
            expect(cache.set).toBeDefined();
            expect(cache.has).toBeDefined();
            expect(cache.delete).toBeDefined();
            expect(cache.clear).toBeDefined();
        });

        it('stores and retrieves values', () => {
            const cache = createCache<number>();
            cache.set('key1', 42);
            expect(cache.get('key1')).toBe(42);
        });

        it('returns undefined for missing keys', () => {
            const cache = createCache<string>();
            expect(cache.get('missing')).toBeUndefined();
        });

        it('checks existence with has()', () => {
            const cache = createCache<string>();
            cache.set('present', 'value');
            expect(cache.has('present')).toBe(true);
            expect(cache.has('absent')).toBe(false);
        });

        it('deletes entries', () => {
            const cache = createCache<string>();
            cache.set('key', 'value');
            cache.delete('key');
            expect(cache.has('key')).toBe(false);
        });

        it('clears all entries', () => {
            const cache = createCache<number>();
            cache.set('a', 1);
            cache.set('b', 2);
            cache.clear();
            expect(cache.has('a')).toBe(false);
            expect(cache.has('b')).toBe(false);
        });

        it('overwrites existing values', () => {
            const cache = createCache<string>();
            cache.set('key', 'old');
            cache.set('key', 'new');
            expect(cache.get('key')).toBe('new');
        });
    });
});
