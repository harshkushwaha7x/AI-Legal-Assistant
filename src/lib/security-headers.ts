import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Security headers middleware.
 * Apply to all responses via Next.js middleware chain.
 */
/**
 * Get all security headers as a plain object
 */
export function getSecurityHeaders(): Record<string, string> {
    return {
        'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https:;",
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
        'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    };
}

export function applySecurityHeaders(response: NextResponse): NextResponse {
    const headers = getSecurityHeaders();
    for (const [key, value] of Object.entries(headers)) {
        // Skip HSTS in development
        if (key === 'Strict-Transport-Security' && process.env.NODE_ENV !== 'production') continue;
        response.headers.set(key, value);
    }
    return response;
}

/**
 * CORS headers for API routes
 */
export function applyCorsHeaders(
    response: NextResponse,
    origin?: string
): NextResponse {
    const allowedOrigins = [
        process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    ];

    if (origin && allowedOrigins.includes(origin)) {
        response.headers.set('Access-Control-Allow-Origin', origin);
    }

    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Max-Age', '86400');

    return response;
}
