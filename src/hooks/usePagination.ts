'use client';

import { useState, useMemo, useCallback } from 'react';

interface PaginationOptions {
    initialPage?: number;
    initialPageSize?: number;
}

interface PaginationResult<T> {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
    paginatedData: T[];
    hasNext: boolean;
    hasPrev: boolean;
    goToPage: (page: number) => void;
    nextPage: () => void;
    prevPage: () => void;
    setPageSize: (size: number) => void;
    startIndex: number;
    endIndex: number;
}

/**
 * Hook for client-side pagination of data arrays
 */
export function usePagination<T>(
    data: T[],
    options: PaginationOptions = {}
): PaginationResult<T> {
    const { initialPage = 1, initialPageSize = 10 } = options;
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [pageSize, setPageSizeState] = useState(initialPageSize);

    const totalItems = data.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

    // Clamp current page to valid range when data or page size changes
    const safePage = Math.min(currentPage, totalPages);

    const startIndex = (safePage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);

    const paginatedData = useMemo(
        () => data.slice(startIndex, endIndex),
        [data, startIndex, endIndex]
    );

    const goToPage = useCallback(
        (page: number) => {
            setCurrentPage(Math.max(1, Math.min(page, totalPages)));
        },
        [totalPages]
    );

    const nextPage = useCallback(() => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    }, [totalPages]);

    const prevPage = useCallback(() => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    }, []);

    const setPageSize = useCallback((size: number) => {
        setPageSizeState(size);
        setCurrentPage(1);
    }, []);

    return {
        currentPage: safePage,
        pageSize,
        totalPages,
        totalItems,
        paginatedData,
        hasNext: safePage < totalPages,
        hasPrev: safePage > 1,
        goToPage,
        nextPage,
        prevPage,
        setPageSize,
        startIndex,
        endIndex,
    };
}
