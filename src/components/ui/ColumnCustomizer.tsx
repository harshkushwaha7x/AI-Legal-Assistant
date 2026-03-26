'use client';

import { useState } from 'react';
import { Columns3, GripVertical, X, Plus, Settings2 } from 'lucide-react';

interface ColumnConfig {
    key: string;
    label: string;
    visible: boolean;
    width?: number;
}

interface ColumnCustomizerProps {
    columns: ColumnConfig[];
    onChange: (columns: ColumnConfig[]) => void;
    maxVisible?: number;
}

export default function ColumnCustomizer({
    columns,
    onChange,
    maxVisible = 10,
}: ColumnCustomizerProps) {
    const [isOpen, setIsOpen] = useState(false);

    const visibleCount = columns.filter((c) => c.visible).length;

    const toggleColumn = (key: string) => {
        const col = columns.find((c) => c.key === key);
        if (!col) return;

        // Don't allow hiding if only 1 visible
        if (col.visible && visibleCount <= 1) return;
        // Don't allow showing if at max
        if (!col.visible && visibleCount >= maxVisible) return;

        onChange(
            columns.map((c) => (c.key === key ? { ...c, visible: !c.visible } : c))
        );
    };

    const moveColumn = (index: number, direction: 'up' | 'down') => {
        const target = direction === 'up' ? index - 1 : index + 1;
        if (target < 0 || target >= columns.length) return;

        const updated = [...columns];
        [updated[index], updated[target]] = [updated[target], updated[index]];
        onChange(updated);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-[10px] text-surface-400 hover:text-surface-200 transition-colors"
            >
                <Settings2 className="h-3 w-3" />
                Columns ({visibleCount})
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full z-20 mt-1 w-56 rounded-xl border border-white/10 bg-surface-900 py-2 shadow-2xl">
                    <div className="px-3 pb-2 text-[10px] font-medium text-surface-500">
                        Configure Columns
                    </div>

                    <div className="max-h-64 overflow-y-auto">
                        {columns.map((col, i) => (
                            <div
                                key={col.key}
                                className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/5"
                            >
                                <GripVertical className="h-3 w-3 text-surface-700 shrink-0 cursor-grab" />

                                <button
                                    onClick={() => toggleColumn(col.key)}
                                    className={`flex-1 text-left text-xs truncate ${
                                        col.visible ? 'text-white' : 'text-surface-600'
                                    }`}
                                >
                                    {col.label}
                                </button>

                                <div className="flex items-center gap-0.5">
                                    {i > 0 && (
                                        <button
                                            onClick={() => moveColumn(i, 'up')}
                                            className="rounded p-0.5 text-surface-700 hover:text-surface-400 text-[9px]"
                                        >
                                            ▲
                                        </button>
                                    )}
                                    {i < columns.length - 1 && (
                                        <button
                                            onClick={() => moveColumn(i, 'down')}
                                            className="rounded p-0.5 text-surface-700 hover:text-surface-400 text-[9px]"
                                        >
                                            ▼
                                        </button>
                                    )}
                                </div>

                                <span className={`h-2 w-2 rounded-full shrink-0 ${
                                    col.visible ? 'bg-emerald-500' : 'bg-surface-700'
                                }`} />
                            </div>
                        ))}
                    </div>

                    <div className="mt-1 border-t border-white/5 px-3 pt-2">
                        <button
                            onClick={() => onChange(columns.map((c) => ({ ...c, visible: true })))}
                            className="text-[10px] text-primary-400 hover:text-primary-300 transition-colors"
                        >
                            Show All
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
