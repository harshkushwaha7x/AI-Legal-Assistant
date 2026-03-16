'use client';

import { Wifi, WifiOff, ArrowUp } from 'lucide-react';
import { useOnlineStatus, useScrollPosition } from '@/hooks/useBrowser';

/**
 * Offline indicator bar shown when browser loses connection
 */
export function OfflineBanner() {
    const isOnline = useOnlineStatus();

    if (isOnline) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-[200] flex items-center justify-center gap-2 bg-red-600 px-4 py-2 text-sm font-medium text-white">
            <WifiOff className="h-4 w-4" />
            <span>You are currently offline. Some features may be unavailable.</span>
        </div>
    );
}

/**
 * Online restored notification (brief flash)
 */
export function OnlineRestoredBanner() {
    const isOnline = useOnlineStatus();

    if (!isOnline) return null;

    // This would typically only show after a transition from offline to online
    return null;
}

/**
 * Scroll-to-top button that appears after scrolling down
 */
export function ScrollToTop() {
    const { y } = useScrollPosition();
    const showButton = y > 400;

    if (!showButton) return null;

    return (
        <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg transition-all hover:bg-primary-500 hover:scale-110"
            aria-label="Scroll to top"
        >
            <ArrowUp className="h-4 w-4" />
        </button>
    );
}

/**
 * Connection status indicator dot
 */
export function ConnectionStatus() {
    const isOnline = useOnlineStatus();

    return (
        <div className="flex items-center gap-1.5">
            <div
                className={`h-2 w-2 rounded-full ${
                    isOnline ? 'bg-green-400' : 'bg-red-400 animate-pulse'
                }`}
            />
            <span className="text-[10px] text-surface-500">
                {isOnline ? 'Connected' : 'Offline'}
            </span>
        </div>
    );
}
