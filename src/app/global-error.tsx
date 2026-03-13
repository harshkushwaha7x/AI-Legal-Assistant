'use client';

import { Scale, RefreshCw } from 'lucide-react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="en">
            <body className="bg-surface-950 text-white">
                <div className="flex min-h-screen flex-col items-center justify-center px-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
                        <Scale className="h-8 w-8 text-red-400" />
                    </div>
                    <h1 className="mt-6 text-2xl font-bold">Application Error</h1>
                    <p className="mt-2 max-w-md text-center text-sm text-gray-400">
                        A critical error occurred. This has been logged and our team will investigate.
                    </p>
                    {error.digest && (
                        <p className="mt-3 text-xs text-gray-600">
                            Error ID: {error.digest}
                        </p>
                    )}
                    <button
                        onClick={reset}
                        className="mt-8 flex items-center gap-2 rounded-lg bg-white/10 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-white/20"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Try Again
                    </button>
                </div>
            </body>
        </html>
    );
}
