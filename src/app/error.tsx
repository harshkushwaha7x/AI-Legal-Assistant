'use client';

import { Scale, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function AppError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
            <div className="relative mb-6">
                <div className="absolute inset-0 rounded-full bg-red-500/15 animate-pulse" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 ring-1 ring-red-500/20">
                    <Scale className="h-7 w-7 text-red-400" />
                </div>
            </div>
            <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
            <p className="mt-2 max-w-md text-center text-sm text-surface-400">
                An unexpected error occurred while loading this page. Please try again or return to the home page.
            </p>
            {error.digest && (
                <p className="mt-3 rounded-md bg-white/5 px-3 py-1 text-xs text-surface-600">
                    Reference: {error.digest}
                </p>
            )}
            <div className="mt-8 flex gap-3">
                <button
                    onClick={reset}
                    className="flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-500"
                >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Try Again
                </button>
                <Link
                    href="/"
                    className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-surface-300 transition-colors hover:bg-white/10"
                >
                    <Home className="h-3.5 w-3.5" />
                    Home
                </Link>
            </div>
        </div>
    );
}
