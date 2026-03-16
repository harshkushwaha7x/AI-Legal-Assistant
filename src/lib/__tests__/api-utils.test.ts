import {
    ApiError,
    NotFoundError,
    UnauthorizedError,
    ForbiddenError,
    ValidationError,
    handleApiError,
    formatApiDate,
    parsePagination,
} from '@/lib/api-utils';

describe('API Utils', () => {
    describe('ApiError', () => {
        it('creates error with status code', () => {
            const error = new ApiError('test', 400);
            expect(error.message).toBe('test');
            expect(error.statusCode).toBe(400);
            expect(error.name).toBe('ApiError');
        });

        it('defaults to 500', () => {
            const error = new ApiError('server error');
            expect(error.statusCode).toBe(500);
        });
    });

    describe('NotFoundError', () => {
        it('creates 404 error', () => {
            const error = new NotFoundError('Document');
            expect(error.statusCode).toBe(404);
            expect(error.message).toContain('Document');
        });
    });

    describe('UnauthorizedError', () => {
        it('creates 401 error', () => {
            const error = new UnauthorizedError();
            expect(error.statusCode).toBe(401);
        });
    });

    describe('ForbiddenError', () => {
        it('creates 403 error', () => {
            const error = new ForbiddenError();
            expect(error.statusCode).toBe(403);
        });
    });

    describe('ValidationError', () => {
        it('creates 400 error with details', () => {
            const error = new ValidationError('Bad input', { field: 'email' });
            expect(error.statusCode).toBe(400);
            expect(error.details).toEqual({ field: 'email' });
        });
    });

    describe('handleApiError', () => {
        it('handles ApiError correctly', () => {
            const error = new NotFoundError('User');
            const result = handleApiError(error);
            expect(result.status).toBe(404);
            expect(result.body.error).toContain('User');
        });

        it('handles unknown errors as 500', () => {
            const result = handleApiError(new Error('random error'));
            expect(result.status).toBe(500);
            expect(result.body.error).toBe('Internal server error');
        });

        it('includes validation details', () => {
            const error = new ValidationError('Invalid', { field: 'name' });
            const result = handleApiError(error);
            expect(result.body.details).toEqual({ field: 'name' });
        });
    });

    describe('formatApiDate', () => {
        it('converts Date to ISO string', () => {
            const date = new Date('2024-01-15T12:00:00Z');
            expect(formatApiDate(date)).toBe('2024-01-15T12:00:00.000Z');
        });

        it('converts string date to ISO string', () => {
            const result = formatApiDate('2024-01-15');
            expect(result).toContain('2024-01-15');
        });
    });

    describe('parsePagination', () => {
        it('parses page and limit from search params', () => {
            const params = new URLSearchParams('page=2&limit=10');
            const result = parsePagination(params);
            expect(result.page).toBe(2);
            expect(result.limit).toBe(10);
            expect(result.skip).toBe(10);
        });

        it('defaults to page 1, limit 20', () => {
            const params = new URLSearchParams();
            const result = parsePagination(params);
            expect(result.page).toBe(1);
            expect(result.limit).toBe(20);
            expect(result.skip).toBe(0);
        });

        it('clamps to valid ranges', () => {
            const params = new URLSearchParams('page=-1&limit=9999');
            const result = parsePagination(params);
            expect(result.page).toBe(1);
            expect(result.limit).toBe(100);
        });
    });
});
