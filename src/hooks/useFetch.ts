'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface FetchState<T> {
    data: T | null;
    error: string | null;
    loading: boolean;
}

interface UseFetchOptions {
    pollInterval?: number;
    enabled?: boolean;
}

/**
 * Generic data fetching hook with loading, error, refetch, and polling
 */
export function useFetch<T>(
    url: string,
    options: UseFetchOptions = {}
): FetchState<T> & { refetch: () => void } {
    const { pollInterval, enabled = true } = options;
    const [state, setState] = useState<FetchState<T>>({
        data: null,
        error: null,
        loading: true,
    });
    const abortRef = useRef<AbortController | null>(null);

    const fetchData = useCallback(async () => {
        if (!enabled) return;

        // Cancel previous request
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        setState((prev) => ({ ...prev, loading: true, error: null }));

        try {
            const res = await fetch(url, { signal: controller.signal });
            if (!res.ok) {
                throw new Error(`Request failed with status ${res.status}`);
            }
            const data = await res.json();
            if (!controller.signal.aborted) {
                setState({ data, error: null, loading: false });
            }
        } catch (err) {
            if (err instanceof Error && err.name === 'AbortError') return;
            setState({
                data: null,
                error: err instanceof Error ? err.message : 'An error occurred',
                loading: false,
            });
        }
    }, [url, enabled]);

    useEffect(() => {
        fetchData();
        return () => abortRef.current?.abort();
    }, [fetchData]);

    // Polling
    useEffect(() => {
        if (!pollInterval || !enabled) return;
        const timer = setInterval(fetchData, pollInterval);
        return () => clearInterval(timer);
    }, [fetchData, pollInterval, enabled]);

    return { ...state, refetch: fetchData };
}
