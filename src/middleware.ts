import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
    function middleware(req) {
        const { pathname } = req.nextUrl;
        const token = req.nextauth.token;

        // Redirect authenticated users away from auth pages
        if (token && (pathname === '/login' || pathname === '/signup')) {
            return NextResponse.redirect(new URL('/dashboard', req.url));
        }

        // Role-based access for admin routes
        if (pathname.startsWith('/admin') && token?.role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/dashboard', req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl;

                // Public routes - always accessible
                const publicRoutes = ['/', '/login', '/signup', '/api/auth'];
                if (publicRoutes.some((route) => pathname.startsWith(route))) {
                    return true;
                }

                // Protected routes - require auth
                return !!token;
            },
        },
    }
);

export const config = {
    matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/signup'],
};
