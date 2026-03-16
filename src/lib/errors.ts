/**
 * Custom error classes for application-level errors
 */

/**
 * Base application error with code and metadata
 */
export class AppError extends Error {
    code: string;
    statusCode: number;
    isOperational: boolean;
    metadata?: Record<string, unknown>;

    constructor(
        message: string,
        code: string,
        statusCode: number = 500,
        isOperational: boolean = true,
        metadata?: Record<string, unknown>
    ) {
        super(message);
        this.name = 'AppError';
        this.code = code;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.metadata = metadata;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

/**
 * Authentication error - user is not authenticated
 */
export class AuthenticationError extends AppError {
    constructor(message: string = 'Authentication required') {
        super(message, 'AUTH_REQUIRED', 401);
        this.name = 'AuthenticationError';
    }
}

/**
 * Authorization error - user lacks permissions
 */
export class AuthorizationError extends AppError {
    constructor(message: string = 'Insufficient permissions') {
        super(message, 'FORBIDDEN', 403);
        this.name = 'AuthorizationError';
    }
}

/**
 * Resource not found error
 */
export class ResourceNotFoundError extends AppError {
    constructor(resource: string, id?: string) {
        const msg = id ? `${resource} with ID ${id} not found` : `${resource} not found`;
        super(msg, 'NOT_FOUND', 404);
        this.name = 'ResourceNotFoundError';
    }
}

/**
 * Rate limit exceeded error
 */
export class RateLimitError extends AppError {
    retryAfter: number;

    constructor(retryAfterSeconds: number = 60) {
        super('Rate limit exceeded. Please try again later.', 'RATE_LIMITED', 429);
        this.name = 'RateLimitError';
        this.retryAfter = retryAfterSeconds;
    }
}

/**
 * Input validation error with field-level details
 */
export class InputValidationError extends AppError {
    fields: Record<string, string[]>;

    constructor(fields: Record<string, string[]>) {
        super('Validation failed', 'VALIDATION_ERROR', 400);
        this.name = 'InputValidationError';
        this.fields = fields;
    }
}

/**
 * External service error (e.g., OpenAI API failure)
 */
export class ExternalServiceError extends AppError {
    service: string;

    constructor(service: string, message?: string) {
        super(
            message || `External service "${service}" is unavailable`,
            'SERVICE_UNAVAILABLE',
            503
        );
        this.name = 'ExternalServiceError';
        this.service = service;
    }
}

/**
 * Check if an error is an operational (expected) error
 */
export function isOperationalError(error: unknown): boolean {
    return error instanceof AppError && error.isOperational;
}
