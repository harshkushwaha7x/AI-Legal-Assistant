import {
    checkRateLimit,
    rateLimitHeaders,
} from '@/lib/rate-limit';

describe('Rate Limiter', () => {
    describe('checkRateLimit', () => {
        it('allows first request', () => {
            const result = checkRateLimit('test-user-1', { maxRequests: 5, windowMs: 60000 });
            expect(result.allowed).toBe(true);
            expect(result.remaining).toBe(4);
        });

        it('tracks request count', () => {
            const id = 'test-user-2';
            const config = { maxRequests: 3, windowMs: 60000 };

            checkRateLimit(id, config); // 1
            checkRateLimit(id, config); // 2
            const result = checkRateLimit(id, config); // 3
            expect(result.allowed).toBe(true);
            expect(result.remaining).toBe(0);
        });

        it('blocks when limit exceeded', () => {
            const id = 'test-user-3';
            const config = { maxRequests: 2, windowMs: 60000 };

            checkRateLimit(id, config); // 1
            checkRateLimit(id, config); // 2
            const result = checkRateLimit(id, config); // 3 - should be blocked
            expect(result.allowed).toBe(false);
            expect(result.remaining).toBe(0);
        });

        it('uses default config if none provided', () => {
            const result = checkRateLimit('test-user-4');
            expect(result.allowed).toBe(true);
            expect(result.remaining).toBe(59); // default is 60
        });

        it('returns reset time', () => {
            const result = checkRateLimit('test-user-5', { maxRequests: 10, windowMs: 30000 });
            expect(result.resetAt).toBeGreaterThan(Date.now());
        });
    });

    describe('rateLimitHeaders', () => {
        it('generates correct headers', () => {
            const result = checkRateLimit('test-user-6', { maxRequests: 10, windowMs: 60000 });
            const headers = rateLimitHeaders(result);
            expect(headers['X-RateLimit-Remaining']).toBe('9');
            expect(headers['X-RateLimit-Reset']).toBeTruthy();
        });
    });
});
