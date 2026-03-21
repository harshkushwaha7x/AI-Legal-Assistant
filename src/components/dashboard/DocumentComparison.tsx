'use client';

import { useMemo } from 'react';
import { GitCompare, Plus, Minus, Equal } from 'lucide-react';
import { compareDocuments, formatDiffSummary } from '@/lib/document-diff';

interface DocumentComparisonProps {
    originalTitle?: string;
    modifiedTitle?: string;
    original: string;
    modified: string;
}

type ChunkType = 'added' | 'removed' | 'unchanged';

const CHUNK_STYLES: Record<ChunkType, { bg: string; border: string; lineStyle: string; icon: React.ElementType; iconColor: string }> = {
    added: {
        bg: 'bg-green-500/5',
        border: 'border-l-2 border-green-500/40',
        lineStyle: 'text-green-300',
        icon: Plus,
        iconColor: 'text-green-500',
    },
    removed: {
        bg: 'bg-red-500/5',
        border: 'border-l-2 border-red-500/40',
        lineStyle: 'text-red-300',
        icon: Minus,
        iconColor: 'text-red-500',
    },
    unchanged: {
        bg: '',
        border: '',
        lineStyle: 'text-surface-500',
        icon: Equal,
        iconColor: 'text-surface-700',
    },
};

export default function DocumentComparison({
    originalTitle = 'Original',
    modifiedTitle = 'Modified',
    original,
    modified,
}: DocumentComparisonProps) {
    const diff = useMemo(() => compareDocuments(original, modified), [original, modified]);
    const summary = useMemo(() => formatDiffSummary(diff), [diff]);

    return (
        <div className="glass-card rounded-2xl p-5 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <GitCompare className="h-4 w-4 text-primary-400" />
                    <h3 className="text-sm font-semibold text-white">Document Comparison</h3>
                </div>
                <div className="flex items-center gap-3 text-[10px]">
                    <span className="flex items-center gap-1 text-green-400">
                        <Plus className="h-2.5 w-2.5" />
                        {diff.additions} added
                    </span>
                    <span className="flex items-center gap-1 text-red-400">
                        <Minus className="h-2.5 w-2.5" />
                        {diff.deletions} removed
                    </span>
                    <span className="text-surface-600">
                        {(diff.similarity * 100).toFixed(0)}% similar
                    </span>
                </div>
            </div>

            {/* Summary bar */}
            <p className="text-[10px] text-surface-500">{summary}</p>

            {/* Similarity bar */}
            <div className="h-1 overflow-hidden rounded-full bg-white/5">
                <div
                    className="h-full rounded-full bg-primary-500/50 transition-all"
                    style={{ width: `${diff.similarity * 100}%` }}
                />
            </div>

            {/* Column headers */}
            <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-white/5 bg-white/[2%] px-3 py-1.5">
                    <span className="text-[10px] font-medium text-surface-400">{originalTitle}</span>
                </div>
                <div className="rounded-lg border border-white/5 bg-white/[2%] px-3 py-1.5">
                    <span className="text-[10px] font-medium text-surface-400">{modifiedTitle}</span>
                </div>
            </div>

            {/* Diff chunks */}
            <div className="max-h-[400px] overflow-y-auto rounded-lg border border-white/5 font-mono text-[11px]">
                {diff.chunks.map((chunk, i) => {
                    const style = CHUNK_STYLES[chunk.type];
                    const Icon = style.icon;
                    const lines = chunk.content.split('\n');

                    return (
                        <div
                            key={i}
                            className={`${style.bg} ${style.border} flex gap-2 px-3 py-1 ${
                                chunk.type === 'unchanged' ? 'opacity-50' : ''
                            }`}
                        >
                            <Icon className={`mt-0.5 h-3 w-3 shrink-0 ${style.iconColor}`} />
                            <div className="flex-1 min-w-0">
                                {lines.map((line, j) => (
                                    <p
                                        key={j}
                                        className={`leading-5 ${style.lineStyle} ${
                                            !line.trim() ? 'h-5' : ''
                                        }`}
                                    >
                                        {line || '\u00A0'}
                                    </p>
                                ))}
                            </div>
                        </div>
                    );
                })}

                {diff.chunks.length === 0 && (
                    <div className="py-6 text-center text-[11px] text-surface-600">
                        Documents are identical.
                    </div>
                )}
            </div>
        </div>
    );
}
