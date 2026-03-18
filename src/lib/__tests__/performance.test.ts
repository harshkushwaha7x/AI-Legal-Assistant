import {
    measureAsync,
    retryAsync,
    memoize,
} from '@/lib/performance';

describe('Performance Utilities', () => {
    describe('measureAsync', () => {
        it('returns result and duration', async () => {
            const { result, durationMs } = await measureAsync('test', async () => {
                return 42;
            });
            expect(result).toBe(42);
            expect(typeof durationMs).toBe('number');
            expect(durationMs).toBeGreaterThanOrEqual(0);
        });

        it('measures async operations', async () => {
            const { durationMs } = await measureAsync('delay', async () => {
                await new Promise((resolve) => setTimeout(resolve, 50));
                return 'done';
            });
            expect(durationMs).toBeGreaterThanOrEqual(40);
        });
    });

    describe('retryAsync', () => {
        it('returns on first success', async () => {
            const fn = jest.fn().mockResolvedValue('ok');
            const result = await retryAsync(fn, { maxRetries: 3, baseDelayMs: 10 });
            expect(result).toBe('ok');
            expect(fn).toHaveBeenCalledTimes(1);
        });

        it('retries on failure', async () => {
            const fn = jest
                .fn()
                .mockRejectedValueOnce(new Error('fail'))
                .mockResolvedValue('ok');
            const result = await retryAsync(fn, { maxRetries: 3, baseDelayMs: 10 });
            expect(result).toBe('ok');
            expect(fn).toHaveBeenCalledTimes(2);
        });

        it('throws after max retries', async () => {
            const fn = jest.fn().mockRejectedValue(new Error('always fails'));
            await expect(
                retryAsync(fn, { maxRetries: 2, baseDelayMs: 10 })
            ).rejects.toThrow('always fails');
            expect(fn).toHaveBeenCalledTimes(3); // initial + 2 retries
        });
    });

    describe('memoize', () => {
        it('caches results', () => {
            let callCount = 0;
            const expensive = memoize((x: unknown) => {
                callCount++;
                return (x as number) * 2;
            });
            expect(expensive(5)).toBe(10);
            expect(expensive(5)).toBe(10);
            expect(callCount).toBe(1);
        });

        it('returns different results for different inputs', () => {
            const fn = memoize((x: unknown) => (x as number) * 2);
            expect(fn(3)).toBe(6);
            expect(fn(4)).toBe(8);
        });
    });
});
