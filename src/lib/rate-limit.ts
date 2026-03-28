/**
 * In-memory sliding window rate limiter
 */

interface RateLimitEntry {
    count: number;
    resetAt: number;
}

const cache = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of cache.entries()) {
        if (now > entry.resetAt) {
            cache.delete(key);
        }
    }
}, 5 * 60 * 1000);

interface RateLimitConfig {
    maxRequests: number;
    windowMs: number;
}

interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetAt: number;
}

/**
 * Check if a request is within rate limits
 * @param identifier - Unique key (e.g., userId or IP)
 * @param config - Rate limit configuration
 */
export function checkRateLimit(
    identifier: string,
    config: RateLimitConfig = { maxRequests: 60, windowMs: 60 * 1000 }
): RateLimitResult {
    const now = Date.now();
    const entry = cache.get(identifier);

    if (!entry || now > entry.resetAt) {
        // New window
        cache.set(identifier, {
            count: 1,
            resetAt: now + config.windowMs,
        });
        return { allowed: true, remaining: config.maxRequests - 1, resetAt: now + config.windowMs };
    }

    if (entry.count >= config.maxRequests) {
        return { allowed: false, remaining: 0, resetAt: entry.resetAt };
    }

    entry.count++;
    return { allowed: true, remaining: config.maxRequests - entry.count, resetAt: entry.resetAt };
}

/**
 * Rate limit headers for API responses
 */
export function rateLimitHeaders(result: RateLimitResult, limit?: number): Record<string, string> {
    return {
        'X-RateLimit-Limit': (limit || 60).toString(),
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': new Date(result.resetAt).toISOString(),
    };
}

/**
 * Reset rate limit for an identifier (for testing/admin)
 */
export function resetRateLimit(identifier: string): void {
    cache.delete(identifier);
}
