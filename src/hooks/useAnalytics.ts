'use client';

import { useCallback, useEffect, useRef } from 'react';

/**
 * Hook to track page visibility and user engagement
 */
export function usePageVisibility(onVisible?: () => void, onHidden?: () => void) {
    useEffect(() => {
        const handler = () => {
            if (document.visibilityState === 'visible') {
                onVisible?.();
            } else {
                onHidden?.();
            }
        };

        document.addEventListener('visibilitychange', handler);
        return () => document.removeEventListener('visibilitychange', handler);
    }, [onVisible, onHidden]);
}

/**
 * Hook to detect when user scrolls to bottom of a container
 */
export function useInfiniteScroll(
    callback: () => void,
    threshold: number = 100
) {
    const observerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const element = observerRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    callback();
                }
            },
            { rootMargin: `${threshold}px` }
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, [callback, threshold]);

    return observerRef;
}

/**
 * Hook for tracking time spent on a page
 */
export function useTimeOnPage(onLeave?: (seconds: number) => void) {
    const startTime = useRef(Date.now());

    useEffect(() => {
        return () => {
            const elapsed = Math.floor((Date.now() - startTime.current) / 1000);
            onLeave?.(elapsed);
        };
    }, [onLeave]);
}

/**
 * Hook to prefetch data on hover
 */
export function usePrefetch(fetchFn: () => void, delay: number = 200) {
    const timer = useRef<NodeJS.Timeout | null>(null);

    const onMouseEnter = useCallback(() => {
        timer.current = setTimeout(fetchFn, delay);
    }, [fetchFn, delay]);

    const onMouseLeave = useCallback(() => {
        if (timer.current) {
            clearTimeout(timer.current);
            timer.current = null;
        }
    }, []);

    return { onMouseEnter, onMouseLeave };
}
