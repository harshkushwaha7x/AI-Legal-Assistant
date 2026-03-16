'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to detect online/offline status
 */
export function useOnlineStatus(): boolean {
    const [isOnline, setIsOnline] = useState(
        typeof navigator !== 'undefined' ? navigator.onLine : true
    );

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return isOnline;
}

/**
 * Hook to detect if document is visible or hidden
 */
export function useDocumentTitle(title: string, restoreOnUnmount: boolean = true) {
    useEffect(() => {
        const previousTitle = document.title;
        document.title = title;

        return () => {
            if (restoreOnUnmount) {
                document.title = previousTitle;
            }
        };
    }, [title, restoreOnUnmount]);
}

/**
 * Hook to detect scroll position
 */
export function useScrollPosition(): { x: number; y: number } {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleScroll = () => {
            setPosition({ x: window.scrollX, y: window.scrollY });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return position;
}

/**
 * Hook to detect window dimensions
 */
export function useWindowSize(): { width: number; height: number } {
    const [size, setSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
    });

    useEffect(() => {
        const handleResize = () => {
            setSize({ width: window.innerWidth, height: window.innerHeight });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return size;
}
