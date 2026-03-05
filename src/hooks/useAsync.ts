'use client';

import { useState, useCallback } from 'react';

interface UseAsyncReturn<T> {
    data: T | null;
    error: string | null;
    loading: boolean;
    execute: (...args: unknown[]) => Promise<T | null>;
    reset: () => void;
}

/**
 * Hook to manage async operations with loading, error, and data states
 */
export function useAsync<T>(
    asyncFn: (...args: unknown[]) => Promise<T>
): UseAsyncReturn<T> {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const execute = useCallback(
        async (...args: unknown[]): Promise<T | null> => {
            setLoading(true);
            setError(null);
            try {
                const result = await asyncFn(...args);
                setData(result);
                return result;
            } catch (err) {
                const message = err instanceof Error ? err.message : 'An error occurred';
                setError(message);
                return null;
            } finally {
                setLoading(false);
            }
        },
        [asyncFn]
    );

    const reset = useCallback(() => {
        setData(null);
        setError(null);
        setLoading(false);
    }, []);

    return { data, error, loading, execute, reset };
}
