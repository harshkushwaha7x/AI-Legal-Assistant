import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { checkRateLimit, rateLimitHeaders } from '@/lib/rate-limit';

type ApiHandler = (
    req: NextRequest,
    context: { userId: string }
) => Promise<NextResponse>;

/**
 * Wrap an API route handler with authentication
 */
export function withAuth(handler: ApiHandler) {
    return async (req: NextRequest) => {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        return handler(req, { userId: session.user.id });
    };
}

/**
 * Wrap an API route handler with rate limiting
 */
export function withRateLimit(
    handler: (req: NextRequest) => Promise<NextResponse>,
    maxRequests: number = 60,
    windowMs: number = 60 * 1000
) {
    return async (req: NextRequest) => {
        const ip =
            req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
            req.headers.get('x-real-ip') ||
            'unknown';

        const result = checkRateLimit(ip, { maxRequests, windowMs });

        if (!result.allowed) {
            return NextResponse.json(
                { error: 'Too many requests. Please try again later.' },
                {
                    status: 429,
                    headers: rateLimitHeaders(result),
                }
            );
        }

        const response = await handler(req);

        // Attach rate limit headers
        const headers = rateLimitHeaders(result);
        Object.entries(headers).forEach(([key, value]) => {
            response.headers.set(key, value);
        });

        return response;
    };
}

/**
 * Wrap an API route with both auth and rate limiting
 */
export function withAuthAndRateLimit(
    handler: ApiHandler,
    maxRequests: number = 30,
    windowMs: number = 60 * 1000
) {
    return withRateLimit(
        withAuth(handler),
        maxRequests,
        windowMs
    );
}
