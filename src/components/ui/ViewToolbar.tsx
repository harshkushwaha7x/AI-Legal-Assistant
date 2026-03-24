'use client';

import { useState } from 'react';
import { LayoutGrid, List, SortAsc, SortDesc, Filter } from 'lucide-react';

export type ViewMode = 'grid' | 'list';
export type SortDirection = 'asc' | 'desc';

export interface SortOption {
    key: string;
    label: string;
}

interface ViewToolbarProps {
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
    sortOptions: SortOption[];
    currentSort: string;
    sortDirection: SortDirection;
    onSortChange: (key: string) => void;
    onDirectionChange: (direction: SortDirection) => void;
    resultCount?: number;
    children?: React.ReactNode;
}

export default function ViewToolbar({
    viewMode,
    onViewModeChange,
    sortOptions,
    currentSort,
    sortDirection,
    onSortChange,
    onDirectionChange,
    resultCount,
    children,
}: ViewToolbarProps) {
    return (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-white/5 bg-white/[2%] px-3 py-2">
            <div className="flex items-center gap-2">
                {/* View mode toggle */}
                <div className="flex rounded-md border border-white/10">
                    <button
                        onClick={() => onViewModeChange('grid')}
                        className={`rounded-l-md p-1.5 transition-colors ${
                            viewMode === 'grid'
                                ? 'bg-primary-500/20 text-primary-400'
                                : 'text-surface-600 hover:text-surface-300'
                        }`}
                        aria-label="Grid view"
                    >
                        <LayoutGrid className="h-3.5 w-3.5" />
                    </button>
                    <button
                        onClick={() => onViewModeChange('list')}
                        className={`rounded-r-md p-1.5 transition-colors ${
                            viewMode === 'list'
                                ? 'bg-primary-500/20 text-primary-400'
                                : 'text-surface-600 hover:text-surface-300'
                        }`}
                        aria-label="List view"
                    >
                        <List className="h-3.5 w-3.5" />
                    </button>
                </div>

                {/* Sort controls */}
                <div className="flex items-center gap-1">
                    <select
                        value={currentSort}
                        onChange={(e) => onSortChange(e.target.value)}
                        className="rounded-md border border-white/10 bg-transparent px-2 py-1 text-[10px] text-surface-300 outline-none"
                    >
                        {sortOptions.map((opt) => (
                            <option key={opt.key} value={opt.key} className="bg-surface-900">
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={() => onDirectionChange(sortDirection === 'asc' ? 'desc' : 'asc')}
                        className="rounded-md p-1.5 text-surface-600 hover:text-surface-300 transition-colors"
                        aria-label={sortDirection === 'asc' ? 'Sort descending' : 'Sort ascending'}
                    >
                        {sortDirection === 'asc' ? (
                            <SortAsc className="h-3.5 w-3.5" />
                        ) : (
                            <SortDesc className="h-3.5 w-3.5" />
                        )}
                    </button>
                </div>

                {/* Extra controls slot */}
                {children}
            </div>

            {/* Result count */}
            {resultCount !== undefined && (
                <span className="text-[10px] text-surface-600">
                    {resultCount} result{resultCount !== 1 ? 's' : ''}
                </span>
            )}
        </div>
    );
}
