/**
 * In-memory cache with TTL support
 */

interface CacheEntry<T> {
    value: T;
    expiresAt: number;
}

class Cache {
    private store = new Map<string, CacheEntry<unknown>>();
    private maxSize: number;

    constructor(maxSize: number = 500) {
        this.maxSize = maxSize;
    }

    get<T>(key: string): T | null {
        const entry = this.store.get(key) as CacheEntry<T> | undefined;
        if (!entry) return null;

        if (Date.now() > entry.expiresAt) {
            this.store.delete(key);
            return null;
        }

        return entry.value;
    }

    set<T>(key: string, value: T, ttlMs: number = 60 * 1000): void {
        // Evict oldest if at capacity
        if (this.store.size >= this.maxSize) {
            const firstKey = this.store.keys().next().value;
            if (firstKey) this.store.delete(firstKey);
        }

        this.store.set(key, {
            value,
            expiresAt: Date.now() + ttlMs,
        });
    }

    has(key: string): boolean {
        return this.get(key) !== null;
    }

    delete(key: string): void {
        this.store.delete(key);
    }

    clear(): void {
        this.store.clear();
    }

    get size(): number {
        return this.store.size;
    }

    /**
     * Get all valid (non-expired) keys
     */
    keys(): string[] {
        const now = Date.now();
        const validKeys: string[] = [];
        for (const [key, entry] of this.store) {
            if (now <= entry.expiresAt) validKeys.push(key);
        }
        return validKeys;
    }

    /**
     * Get cached value or compute and cache it
     */
    getOrSet<T>(key: string, factory: () => T, ttlMs: number = 60 * 1000): T {
        const cached = this.get<T>(key);
        if (cached !== null) return cached;
        const value = factory();
        this.set(key, value, ttlMs);
        return value;
    }

    /**
     * Remove all expired entries
     */
    cleanup(): number {
        let removed = 0;
        const now = Date.now();
        for (const [key, entry] of this.store) {
            if (now > entry.expiresAt) {
                this.store.delete(key);
                removed++;
            }
        }
        return removed;
    }
}

// Singleton instance for API response caching
export const apiCache = new Cache(200);

// Singleton instance for search result caching
export const searchCache = new Cache(100);

// Singleton instance for document caching
export const documentCache = new Cache(50);

export default Cache;
