'use client';

import { useEffect, useCallback } from 'react';

type KeyCombo = {
    key: string;
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    meta?: boolean;
};

/**
 * Hook to register keyboard shortcuts
 */
export function useKeyboardShortcut(
    combo: KeyCombo,
    callback: (e: KeyboardEvent) => void,
    enabled: boolean = true
) {
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (!enabled) return;

            // Skip if user is typing in an input
            const target = e.target as HTMLElement;
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
            if (target.isContentEditable) return;

            const keyMatch = e.key.toLowerCase() === combo.key.toLowerCase();
            const ctrlMatch = combo.ctrl ? e.ctrlKey || e.metaKey : !e.ctrlKey && !e.metaKey;
            const shiftMatch = combo.shift ? e.shiftKey : !e.shiftKey;
            const altMatch = combo.alt ? e.altKey : !e.altKey;

            if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
                e.preventDefault();
                callback(e);
            }
        },
        [combo, callback, enabled]
    );

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
}

/**
 * Hook to detect current media query match
 */
export function useMediaQuery(query: string): boolean {
    const { useState, useEffect } = require('react');
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const mql = window.matchMedia(query);
        setMatches(mql.matches);

        const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
        mql.addEventListener('change', handler);
        return () => mql.removeEventListener('change', handler);
    }, [query]);

    return matches;
}
