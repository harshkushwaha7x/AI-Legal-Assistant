'use client';

import { useEffect, useRef, useState } from 'react';

interface UseDebounceReturn<T> {
    debouncedValue: T;
}

/**
 * Hook to debounce a value with a specified delay
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}

/**
 * Hook to detect clicks outside a ref element
 */
export function useClickOutside(
    ref: React.RefObject<HTMLElement | null>,
    handler: () => void
) {
    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            if (!ref.current || ref.current.contains(event.target as Node)) return;
            handler();
        };

        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler]);
}

/**
 * Hook to detect if component is mounted (SSR safety)
 */
export function useMounted(): boolean {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return mounted;
}

/**
 * Hook to toggle between states
 */
export function useToggle(
    initialValue: boolean = false
): [boolean, () => void, (value: boolean) => void] {
    const [value, setValue] = useState(initialValue);
    const toggle = () => setValue((v) => !v);
    return [value, toggle, setValue];
}
