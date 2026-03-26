/**
 * Retry utility with exponential backoff
 * Handles transient failures in API calls and async operations
 */

export interface RetryOptions {
    maxAttempts?: number;
    baseDelayMs?: number;
    maxDelayMs?: number;
    backoffMultiplier?: number;
    retryOn?: (error: unknown) => boolean;
    onRetry?: (attempt: number, error: unknown, delayMs: number) => void;
}

export interface RetryResult<T> {
    success: boolean;
    data?: T;
    error?: unknown;
    attempts: number;
    totalTimeMs: number;
}

const DEFAULT_OPTIONS: Required<Omit<RetryOptions, 'retryOn' | 'onRetry'>> = {
    maxAttempts: 3,
    baseDelayMs: 1000,
    maxDelayMs: 30000,
    backoffMultiplier: 2,
};

/**
 * Calculate delay with exponential backoff and jitter
 */
export function calculateDelay(
    attempt: number,
    baseDelay: number,
    maxDelay: number,
    multiplier: number
): number {
    const exponential = baseDelay * Math.pow(multiplier, attempt - 1);
    const capped = Math.min(exponential, maxDelay);
    // Add 0-25% jitter
    const jitter = capped * Math.random() * 0.25;
    return Math.round(capped + jitter);
}

/**
 * Sleep for given milliseconds
 */
function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Execute a function with retry logic
 */
export async function withRetry<T>(
    fn: () => Promise<T>,
    options: RetryOptions = {}
): Promise<RetryResult<T>> {
    const {
        maxAttempts = DEFAULT_OPTIONS.maxAttempts,
        baseDelayMs = DEFAULT_OPTIONS.baseDelayMs,
        maxDelayMs = DEFAULT_OPTIONS.maxDelayMs,
        backoffMultiplier = DEFAULT_OPTIONS.backoffMultiplier,
        retryOn,
        onRetry,
    } = options;

    const startTime = Date.now();

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const data = await fn();
            return {
                success: true,
                data,
                attempts: attempt,
                totalTimeMs: Date.now() - startTime,
            };
        } catch (error) {
            // Check if we should retry
            if (attempt === maxAttempts) {
                return {
                    success: false,
                    error,
                    attempts: attempt,
                    totalTimeMs: Date.now() - startTime,
                };
            }

            if (retryOn && !retryOn(error)) {
                return {
                    success: false,
                    error,
                    attempts: attempt,
                    totalTimeMs: Date.now() - startTime,
                };
            }

            const delay = calculateDelay(attempt, baseDelayMs, maxDelayMs, backoffMultiplier);
            onRetry?.(attempt, error, delay);
            await sleep(delay);
        }
    }

    return {
        success: false,
        attempts: maxAttempts,
        totalTimeMs: Date.now() - startTime,
    };
}

/**
 * Check if an error is retryable (network/server errors)
 */
export function isRetryableError(error: unknown): boolean {
    if (error instanceof Error) {
        const msg = error.message.toLowerCase();
        if (msg.includes('network') || msg.includes('timeout') || msg.includes('econnreset')) {
            return true;
        }
    }

    // HTTP status codes
    if (typeof error === 'object' && error !== null && 'status' in error) {
        const status = (error as { status: number }).status;
        return status >= 500 || status === 429 || status === 408;
    }

    return false;
}
