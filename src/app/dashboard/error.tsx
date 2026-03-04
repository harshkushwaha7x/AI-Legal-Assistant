'use client';

import { useEffect } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Dashboard error:', error);
    }, [error]);

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 ring-1 ring-red-500/20">
                <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Something went wrong</h2>
            <p className="mt-2 max-w-md text-sm text-surface-400">
                An unexpected error occurred. This has been logged and our team will look into it.
            </p>
            {error.message && (
                <p className="mt-3 max-w-md rounded-lg bg-red-500/10 px-4 py-2 text-xs text-red-300 font-mono">
                    {error.message}
                </p>
            )}
            <div className="mt-6 flex items-center gap-3">
                <button
                    onClick={reset}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-500"
                >
                    <RotateCcw className="h-4 w-4" />
                    Try Again
                </button>
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-surface-300 transition-all hover:bg-white/5 hover:text-white"
                >
                    <Home className="h-4 w-4" />
                    Dashboard
                </Link>
            </div>
        </div>
    );
}
