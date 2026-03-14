'use client';

import { FileText, Download, Trash2, Eye, Clock } from 'lucide-react';

interface DocumentPreviewProps {
    id: string;
    title: string;
    type: string;
    status: string;
    wordCount?: number;
    excerpt?: string;
    updatedAt: string;
    onView?: (id: string) => void;
    onDownload?: (id: string) => void;
    onDelete?: (id: string) => void;
}

const TYPE_COLORS: Record<string, string> = {
    NDA: 'bg-blue-500/10 text-blue-400',
    LEASE: 'bg-green-500/10 text-green-400',
    EMPLOYMENT: 'bg-purple-500/10 text-purple-400',
    CONTRACT: 'bg-amber-500/10 text-amber-400',
    TEMPLATE: 'bg-cyan-500/10 text-cyan-400',
    CUSTOM: 'bg-surface-500/10 text-surface-400',
};

export default function DocumentPreview({
    id,
    title,
    type,
    status,
    wordCount,
    excerpt,
    updatedAt,
    onView,
    onDownload,
    onDelete,
}: DocumentPreviewProps) {
    const typeColor = TYPE_COLORS[type] || TYPE_COLORS.CUSTOM;

    return (
        <div className="group glass-card rounded-xl p-4 transition-all hover:border-primary-500/20 hover:bg-white/[3%]">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-500/10">
                        <FileText className="h-4 w-4 text-primary-400" />
                    </div>
                    <div className="min-w-0">
                        <h4 className="truncate text-sm font-medium text-white">{title}</h4>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                            <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${typeColor}`}>
                                {type}
                            </span>
                            {wordCount !== undefined && (
                                <span className="text-[10px] text-surface-600">
                                    {wordCount.toLocaleString()} words
                                </span>
                            )}
                            <span className="flex items-center gap-1 text-[10px] text-surface-600">
                                <Clock className="h-2.5 w-2.5" />
                                {new Date(updatedAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Actions - visible on hover */}
                <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    {onView && (
                        <button
                            onClick={() => onView(id)}
                            className="rounded-lg p-1.5 text-surface-500 transition-colors hover:bg-white/5 hover:text-white"
                            title="View"
                        >
                            <Eye className="h-3.5 w-3.5" />
                        </button>
                    )}
                    {onDownload && (
                        <button
                            onClick={() => onDownload(id)}
                            className="rounded-lg p-1.5 text-surface-500 transition-colors hover:bg-white/5 hover:text-white"
                            title="Download"
                        >
                            <Download className="h-3.5 w-3.5" />
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={() => onDelete(id)}
                            className="rounded-lg p-1.5 text-surface-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                            title="Delete"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>
            </div>

            {excerpt && (
                <p className="mt-3 text-xs leading-relaxed text-surface-500 line-clamp-2">
                    {excerpt}
                </p>
            )}
        </div>
    );
}
