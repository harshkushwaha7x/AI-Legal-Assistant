'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { SearchIndex, SearchResult, SearchRecord } from '@/lib/search-index';

interface UseSearchOptions<T extends SearchRecord> {
    records: T[];
    fields: string[];
    boosts?: Partial<Record<string, number>>;
    debounceMs?: number;
    maxResults?: number;
}

interface UseSearchResult<T extends SearchRecord> {
    query: string;
    setQuery: (q: string) => void;
    results: SearchResult<T>[];
    isSearching: boolean;
    clear: () => void;
    hasQuery: boolean;
}

/**
 * Reactive search hook backed by SearchIndex for instant client-side search
 */
export function useSearch<T extends SearchRecord>({
    records,
    fields,
    boosts,
    debounceMs = 150,
    maxResults = 20,
}: UseSearchOptions<T>): UseSearchResult<T> {
    const [query, setQueryState] = useState('');
    const [results, setResults] = useState<SearchResult<T>[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const indexRef = useRef<SearchIndex<T> | null>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Rebuild index when records or field config changes
    useEffect(() => {
        const index = new SearchIndex<T>({ fields, boosts });
        index.addAll(records);
        indexRef.current = index;

        // Re-run current query against new index
        if (query.trim()) {
            setResults(index.search(query, maxResults));
        }
    }, [records, fields, boosts, maxResults]); // eslint-disable-line react-hooks/exhaustive-deps

    const setQuery = useCallback(
        (q: string) => {
            setQueryState(q);

            if (debounceRef.current) clearTimeout(debounceRef.current);

            if (!q.trim()) {
                setResults([]);
                setIsSearching(false);
                return;
            }

            setIsSearching(true);

            debounceRef.current = setTimeout(() => {
                const index = indexRef.current;
                if (index) {
                    setResults(index.search(q, maxResults));
                }
                setIsSearching(false);
            }, debounceMs);
        },
        [debounceMs, maxResults]
    );

    const clear = useCallback(() => {
        setQueryState('');
        setResults([]);
        setIsSearching(false);
        if (debounceRef.current) clearTimeout(debounceRef.current);
    }, []);

    return {
        query,
        setQuery,
        results,
        isSearching,
        clear,
        hasQuery: query.trim().length > 0,
    };
}
