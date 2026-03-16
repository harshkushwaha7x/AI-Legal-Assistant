import { NextResponse } from 'next/server';
import { AppError, isOperationalError } from './errors';

/**
 * API response builder utilities
 * Standardized response format for all API endpoints
 */

/**
 * Build a successful JSON response
 */
export function success<T>(data: T, status: number = 200): NextResponse {
    return NextResponse.json({ data, error: null }, { status });
}

/**
 * Build a created (201) response
 */
export function created<T>(data: T): NextResponse {
    return NextResponse.json({ data, error: null }, { status: 201 });
}

/**
 * Build a no-content (204) response
 */
export function noContent(): NextResponse {
    return new NextResponse(null, { status: 204 });
}

/**
 * Build a paginated response
 */
export function paginated<T>(
    data: T[],
    total: number,
    page: number,
    pageSize: number
): NextResponse {
    return NextResponse.json({
        data,
        pagination: {
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
            hasMore: page * pageSize < total,
        },
        error: null,
    });
}

/**
 * Build an error response from an Error object
 */
export function errorResponse(error: unknown): NextResponse {
    if (error instanceof AppError) {
        const body: Record<string, unknown> = {
            data: null,
            error: error.message,
            code: error.code,
        };

        if ('fields' in error) {
            body.fields = (error as { fields: Record<string, string[]> }).fields;
        }

        if ('retryAfter' in error) {
            body.retryAfter = (error as { retryAfter: number }).retryAfter;
        }

        return NextResponse.json(body, { status: error.statusCode });
    }

    // Log non-operational errors
    if (!isOperationalError(error)) {
        console.error('[API] Unhandled error:', error);
    }

    return NextResponse.json(
        {
            data: null,
            error: 'An unexpected error occurred',
            code: 'INTERNAL_ERROR',
        },
        { status: 500 }
    );
}

/**
 * Wrap an API handler with automatic error handling
 */
export function withErrorHandling(
    handler: (req: Request) => Promise<NextResponse>
): (req: Request) => Promise<NextResponse> {
    return async (req: Request) => {
        try {
            return await handler(req);
        } catch (error) {
            return errorResponse(error);
        }
    };
}
