import {
    AppError,
    AuthenticationError,
    AuthorizationError,
    ResourceNotFoundError,
    RateLimitError,
    InputValidationError,
    ExternalServiceError,
    isOperationalError,
} from '@/lib/errors';

describe('Custom Error Classes', () => {
    describe('AppError', () => {
        it('creates error with defaults', () => {
            const error = new AppError('test error', 'TEST_CODE');
            expect(error.message).toBe('test error');
            expect(error.code).toBe('TEST_CODE');
            expect(error.statusCode).toBe(500);
            expect(error.isOperational).toBe(true);
        });

        it('supports custom status code and metadata', () => {
            const error = new AppError('custom', 'CUSTOM', 418, true, { detail: 'value' });
            expect(error.statusCode).toBe(418);
            expect(error.metadata).toEqual({ detail: 'value' });
        });

        it('is instance of Error', () => {
            const error = new AppError('test', 'TEST');
            expect(error instanceof Error).toBe(true);
            expect(error instanceof AppError).toBe(true);
        });
    });

    describe('AuthenticationError', () => {
        it('has 401 status', () => {
            const error = new AuthenticationError();
            expect(error.statusCode).toBe(401);
            expect(error.code).toBe('AUTH_REQUIRED');
        });

        it('supports custom message', () => {
            const error = new AuthenticationError('Session expired');
            expect(error.message).toBe('Session expired');
        });
    });

    describe('AuthorizationError', () => {
        it('has 403 status', () => {
            const error = new AuthorizationError();
            expect(error.statusCode).toBe(403);
            expect(error.code).toBe('FORBIDDEN');
        });
    });

    describe('ResourceNotFoundError', () => {
        it('has 404 status with resource name', () => {
            const error = new ResourceNotFoundError('Document');
            expect(error.statusCode).toBe(404);
            expect(error.message).toBe('Document not found');
        });

        it('includes ID in message when provided', () => {
            const error = new ResourceNotFoundError('Document', 'abc-123');
            expect(error.message).toContain('abc-123');
        });
    });

    describe('RateLimitError', () => {
        it('has 429 status and retryAfter', () => {
            const error = new RateLimitError(30);
            expect(error.statusCode).toBe(429);
            expect(error.retryAfter).toBe(30);
        });
    });

    describe('InputValidationError', () => {
        it('has 400 status and field details', () => {
            const error = new InputValidationError({
                email: ['Invalid email format'],
                name: ['Name is required'],
            });
            expect(error.statusCode).toBe(400);
            expect(error.fields.email).toContain('Invalid email format');
        });
    });

    describe('ExternalServiceError', () => {
        it('has 503 status and service name', () => {
            const error = new ExternalServiceError('OpenAI');
            expect(error.statusCode).toBe(503);
            expect(error.service).toBe('OpenAI');
        });
    });

    describe('isOperationalError', () => {
        it('returns true for AppError', () => {
            expect(isOperationalError(new AppError('test', 'TEST'))).toBe(true);
        });

        it('returns false for regular Error', () => {
            expect(isOperationalError(new Error('test'))).toBe(false);
        });

        it('returns false for non-Error values', () => {
            expect(isOperationalError('string error')).toBe(false);
            expect(isOperationalError(null)).toBe(false);
        });
    });
});
