'use client';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
    onPageChange: (page: number) => void;
    startIndex: number;
    endIndex: number;
    totalItems: number;
    pageSize?: number;
    onPageSizeChange?: (size: number) => void;
}

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export default function PaginationControls({
    currentPage,
    totalPages,
    hasNext,
    hasPrev,
    onPageChange,
    startIndex,
    endIndex,
    totalItems,
    pageSize,
    onPageSizeChange,
}: PaginationControlsProps) {
    // Build page numbers to show
    const getVisiblePages = (): number[] => {
        const pages: number[] = [];
        const maxVisible = 5;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        const end = Math.min(totalPages, start + maxVisible - 1);
        start = Math.max(1, end - maxVisible + 1);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Info */}
            <div className="flex items-center gap-3">
                <span className="text-[11px] text-surface-500">
                    Showing {startIndex + 1}-{endIndex} of {totalItems}
                </span>

                {onPageSizeChange && pageSize && (
                    <select
                        value={pageSize}
                        onChange={(e) => onPageSizeChange(Number(e.target.value))}
                        className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-surface-400 outline-none focus:border-primary-500"
                    >
                        {PAGE_SIZE_OPTIONS.map((size) => (
                            <option key={size} value={size}>
                                {size} per page
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(1)}
                    disabled={!hasPrev}
                    className="rounded-md p-1.5 text-surface-500 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="First page"
                >
                    <ChevronsLeft className="h-3.5 w-3.5" />
                </button>
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={!hasPrev}
                    className="rounded-md p-1.5 text-surface-500 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Previous page"
                >
                    <ChevronLeft className="h-3.5 w-3.5" />
                </button>

                {getVisiblePages().map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`min-w-[28px] rounded-md px-1.5 py-1 text-[11px] font-medium transition-colors ${
                            page === currentPage
                                ? 'bg-primary-600 text-white'
                                : 'text-surface-500 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                        {page}
                    </button>
                ))}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={!hasNext}
                    className="rounded-md p-1.5 text-surface-500 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Next page"
                >
                    <ChevronRight className="h-3.5 w-3.5" />
                </button>
                <button
                    onClick={() => onPageChange(totalPages)}
                    disabled={!hasNext}
                    className="rounded-md p-1.5 text-surface-500 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Last page"
                >
                    <ChevronsRight className="h-3.5 w-3.5" />
                </button>
            </div>
        </div>
    );
}
