'use client';

import { Scale, Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
    message?: string;
    fullPage?: boolean;
}

export default function LoadingSpinner({
    message = 'Loading...',
    fullPage = false,
}: LoadingSpinnerProps) {
    const content = (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary-600/20 animate-pulse-glow" />
                <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary-600/10 ring-1 ring-primary-500/20">
                    <Loader2 className="h-6 w-6 animate-spin text-primary-400" />
                </div>
            </div>
            <div className="text-center">
                <p className="text-sm font-medium text-white">{message}</p>
                <p className="mt-0.5 text-xs text-surface-500">Please wait a moment</p>
            </div>
        </div>
    );

    if (fullPage) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                {content}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center py-20">
            {content}
        </div>
    );
}
