/**
 * API Error Handler Utility
 * Centralized error handling for API routes
 */

export class ApiError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.name = 'ApiError';
        this.statusCode = statusCode;
    }
}

export class NotFoundError extends ApiError {
    constructor(resource: string = 'Resource') {
        super(`${resource} not found`, 404);
    }
}

export class UnauthorizedError extends ApiError {
    constructor(message: string = 'Unauthorized') {
        super(message, 401);
    }
}

export class ForbiddenError extends ApiError {
    constructor(message: string = 'Forbidden') {
        super(message, 403);
    }
}

export class ValidationError extends ApiError {
    details: unknown;

    constructor(message: string = 'Invalid input', details?: unknown) {
        super(message, 400);
        this.details = details;
    }
}

export function handleApiError(error: unknown): { body: Record<string, unknown>; status: number } {
    if (error instanceof ApiError) {
        const body: Record<string, unknown> = { error: error.message };
        if (error instanceof ValidationError && error.details) {
            body.details = error.details;
        }
        return { body, status: error.statusCode };
    }

    console.error('Unhandled API error:', error);
    return {
        body: { error: 'Internal server error' },
        status: 500,
    };
}

/**
 * Format date for API responses
 */
export function formatApiDate(date: Date | string): string {
    return new Date(date).toISOString();
}

/**
 * Parse pagination parameters from search params
 */
export function parsePagination(searchParams: URLSearchParams) {
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    const skip = (page - 1) * limit;

    return { page, limit, skip };
}
