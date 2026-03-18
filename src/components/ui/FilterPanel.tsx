'use client';

import { useState, useMemo } from 'react';
import { Filter, ChevronDown, X } from 'lucide-react';

export interface FilterOption {
    label: string;
    value: string;
}

export interface FilterGroup {
    id: string;
    label: string;
    options: FilterOption[];
    multiSelect?: boolean;
}

interface FilterPanelProps {
    groups: FilterGroup[];
    activeFilters: Record<string, string[]>;
    onChange: (filters: Record<string, string[]>) => void;
}

export default function FilterPanel({ groups, activeFilters, onChange }: FilterPanelProps) {
    const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

    const activeCount = useMemo(
        () => Object.values(activeFilters).reduce((sum, arr) => sum + arr.length, 0),
        [activeFilters]
    );

    const handleToggleFilter = (groupId: string, value: string, multiSelect: boolean) => {
        const current = activeFilters[groupId] || [];
        let updated: string[];

        if (current.includes(value)) {
            updated = current.filter((v) => v !== value);
        } else {
            updated = multiSelect ? [...current, value] : [value];
        }

        onChange({ ...activeFilters, [groupId]: updated });
    };

    const handleClearAll = () => {
        const cleared: Record<string, string[]> = {};
        groups.forEach((g) => {
            cleared[g.id] = [];
        });
        onChange(cleared);
    };

    const handleClearGroup = (groupId: string) => {
        onChange({ ...activeFilters, [groupId]: [] });
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Filter className="h-3.5 w-3.5 text-surface-500" />
                    <span className="text-xs font-medium text-surface-400">Filters</span>
                    {activeCount > 0 && (
                        <span className="rounded-full bg-primary-500/20 px-1.5 py-0.5 text-[9px] font-medium text-primary-400">
                            {activeCount}
                        </span>
                    )}
                </div>
                {activeCount > 0 && (
                    <button
                        onClick={handleClearAll}
                        className="text-[10px] text-surface-600 hover:text-surface-300 transition-colors"
                    >
                        Clear all
                    </button>
                )}
            </div>

            {groups.map((group) => {
                const isExpanded = expandedGroup === group.id;
                const groupActive = activeFilters[group.id] || [];

                return (
                    <div key={group.id} className="rounded-lg border border-white/5">
                        <button
                            onClick={() => setExpandedGroup(isExpanded ? null : group.id)}
                            className="flex w-full items-center justify-between px-3 py-2"
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-surface-300">{group.label}</span>
                                {groupActive.length > 0 && (
                                    <span className="rounded bg-primary-500/15 px-1 py-0.5 text-[9px] text-primary-400">
                                        {groupActive.length}
                                    </span>
                                )}
                            </div>
                            <ChevronDown
                                className={`h-3 w-3 text-surface-600 transition-transform ${
                                    isExpanded ? 'rotate-180' : ''
                                }`}
                            />
                        </button>

                        {isExpanded && (
                            <div className="border-t border-white/5 px-3 py-2 space-y-1">
                                {group.options.map((option) => {
                                    const isActive = groupActive.includes(option.value);
                                    return (
                                        <button
                                            key={option.value}
                                            onClick={() =>
                                                handleToggleFilter(group.id, option.value, group.multiSelect ?? false)
                                            }
                                            className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-[11px] transition-colors ${
                                                isActive
                                                    ? 'bg-primary-500/15 text-primary-400'
                                                    : 'text-surface-500 hover:bg-white/5 hover:text-surface-300'
                                            }`}
                                        >
                                            <div
                                                className={`h-3 w-3 rounded border transition-colors ${
                                                    isActive
                                                        ? 'border-primary-500 bg-primary-500'
                                                        : 'border-surface-700'
                                                }`}
                                            >
                                                {isActive && (
                                                    <svg className="h-3 w-3 text-white" viewBox="0 0 12 12">
                                                        <path
                                                            fill="currentColor"
                                                            d="M10 3L4.5 8.5 2 6"
                                                            stroke="currentColor"
                                                            strokeWidth="1.5"
                                                            fill="none"
                                                        />
                                                    </svg>
                                                )}
                                            </div>
                                            {option.label}
                                        </button>
                                    );
                                })}
                                {groupActive.length > 0 && (
                                    <button
                                        onClick={() => handleClearGroup(group.id)}
                                        className="flex items-center gap-1 px-2 py-1 text-[10px] text-surface-600 hover:text-surface-400"
                                    >
                                        <X className="h-2.5 w-2.5" />
                                        Clear
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
