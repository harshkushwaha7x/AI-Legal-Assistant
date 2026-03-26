import {
    calculateDelay,
    withRetry,
    isRetryableError,
} from '@/lib/retry';

describe('Retry Utility', () => {
    describe('calculateDelay', () => {
        it('increases with each attempt', () => {
            const d1 = calculateDelay(1, 1000, 30000, 2);
            const d2 = calculateDelay(2, 1000, 30000, 2);
            const d3 = calculateDelay(3, 1000, 30000, 2);
            // Base delay grows, but jitter makes exact comparison unreliable
            expect(d2).toBeGreaterThanOrEqual(d1);
            expect(d3).toBeGreaterThanOrEqual(d2);
        });

        it('does not exceed max delay', () => {
            const delay = calculateDelay(10, 1000, 5000, 2);
            // Max + 25% jitter = 6250 max
            expect(delay).toBeLessThanOrEqual(6250);
        });

        it('returns a positive number', () => {
            expect(calculateDelay(1, 100, 1000, 2)).toBeGreaterThan(0);
        });
    });

    describe('withRetry', () => {
        it('returns immediately on success', async () => {
            const result = await withRetry(() => Promise.resolve('ok'), { maxAttempts: 3 });
            expect(result.success).toBe(true);
            expect(result.data).toBe('ok');
            expect(result.attempts).toBe(1);
        });

        it('retries on failure', async () => {
            let calls = 0;
            const result = await withRetry(
                () => {
                    calls++;
                    if (calls < 3) throw new Error('fail');
                    return Promise.resolve('recovered');
                },
                { maxAttempts: 3, baseDelayMs: 10 }
            );
            expect(result.success).toBe(true);
            expect(result.data).toBe('recovered');
            expect(result.attempts).toBe(3);
        });

        it('gives up after max attempts', async () => {
            const result = await withRetry(
                () => Promise.reject(new Error('always fails')),
                { maxAttempts: 2, baseDelayMs: 10 }
            );
            expect(result.success).toBe(false);
            expect(result.attempts).toBe(2);
        });

        it('respects retryOn filter', async () => {
            const result = await withRetry(
                () => Promise.reject(new Error('not retryable')),
                { maxAttempts: 3, baseDelayMs: 10, retryOn: () => false }
            );
            expect(result.success).toBe(false);
            expect(result.attempts).toBe(1); // gave up immediately
        });

        it('calls onRetry callback', async () => {
            const retries: number[] = [];
            await withRetry(
                () => Promise.reject(new Error('fail')),
                {
                    maxAttempts: 3,
                    baseDelayMs: 10,
                    onRetry: (attempt) => retries.push(attempt),
                }
            );
            expect(retries).toEqual([1, 2]);
        });

        it('tracks total time', async () => {
            const result = await withRetry(() => Promise.resolve('fast'));
            expect(result.totalTimeMs).toBeGreaterThanOrEqual(0);
        });
    });

    describe('isRetryableError', () => {
        it('retries network errors', () => {
            expect(isRetryableError(new Error('network failure'))).toBe(true);
        });

        it('retries timeout errors', () => {
            expect(isRetryableError(new Error('Request timeout'))).toBe(true);
        });

        it('retries 500 status', () => {
            expect(isRetryableError({ status: 500 })).toBe(true);
        });

        it('retries 429 status', () => {
            expect(isRetryableError({ status: 429 })).toBe(true);
        });

        it('does not retry 400 status', () => {
            expect(isRetryableError({ status: 400 })).toBe(false);
        });

        it('does not retry generic errors', () => {
            expect(isRetryableError(new Error('validation failed'))).toBe(false);
        });
    });
});
