/**
 * Performance utilities for async operations
 */

/**
 * Measure the execution time of an async function
 */
export async function measureAsync<T>(
    label: string,
    fn: () => Promise<T>
): Promise<{ result: T; durationMs: number }> {
    const start = performance.now();
    const result = await fn();
    const durationMs = Math.round(performance.now() - start);
    console.log(`[perf] ${label}: ${durationMs}ms`);
    return { result, durationMs };
}

/**
 * Retry an async operation with exponential backoff
 */
export async function retryAsync<T>(
    fn: () => Promise<T>,
    options: {
        maxRetries?: number;
        baseDelayMs?: number;
        maxDelayMs?: number;
    } = {}
): Promise<T> {
    const { maxRetries = 3, baseDelayMs = 500, maxDelayMs = 10000 } = options;
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (err) {
            lastError = err instanceof Error ? err : new Error(String(err));
            if (attempt < maxRetries) {
                const delay = Math.min(baseDelayMs * Math.pow(2, attempt), maxDelayMs);
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }
    }

    throw lastError;
}

/**
 * Debounce a promise-returning function
 */
export function debouncePromise<T extends (...args: unknown[]) => Promise<unknown>>(
    fn: T,
    delayMs: number
): T {
    let timer: NodeJS.Timeout | null = null;

    return ((...args: unknown[]) => {
        return new Promise((resolve, reject) => {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                fn(...args).then(resolve).catch(reject);
            }, delayMs);
        });
    }) as T;
}

/**
 * Simple memoization for expensive pure functions
 */
export function memoize<T extends (...args: unknown[]) => unknown>(
    fn: T,
    keyFn?: (...args: Parameters<T>) => string
): T {
    const cache = new Map<string, unknown>();

    return ((...args: unknown[]) => {
        const key = keyFn
            ? keyFn(...(args as Parameters<T>))
            : JSON.stringify(args);
        if (cache.has(key)) return cache.get(key);
        const result = fn(...args);
        cache.set(key, result);
        return result;
    }) as T;
}
