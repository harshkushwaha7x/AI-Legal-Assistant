'use client';

import { BookOpen, ExternalLink, MapPin, Tag } from 'lucide-react';

interface ResearchResultCardProps {
    title: string;
    content: string;
    category: string;
    relevanceScore: number;
    source: string;
    jurisdiction: string;
    onClick?: () => void;
}

export default function ResearchResultCard({
    title,
    content,
    category,
    relevanceScore,
    source,
    jurisdiction,
    onClick,
}: ResearchResultCardProps) {
    // Truncate content for preview
    const preview = content.length > 300 ? content.slice(0, 297) + '...' : content;

    // Score color
    const scoreColor =
        relevanceScore >= 90
            ? 'text-emerald-400 bg-emerald-500/15'
            : relevanceScore >= 75
                ? 'text-amber-400 bg-amber-500/15'
                : 'text-surface-400 bg-surface-500/15';

    return (
        <button
            onClick={onClick}
            className="glass-card group w-full rounded-xl p-5 text-left transition-all hover:-translate-y-0.5"
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white group-hover:text-primary-300 transition-colors line-clamp-2">
                        {title}
                    </h3>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
                        <span className="inline-flex items-center gap-1 rounded-md bg-primary-500/10 px-1.5 py-0.5 text-primary-400">
                            <Tag className="h-2.5 w-2.5" />
                            {category}
                        </span>
                        <span className="inline-flex items-center gap-1 text-surface-500">
                            <MapPin className="h-2.5 w-2.5" />
                            {jurisdiction}
                        </span>
                    </div>
                </div>
                <span className={`shrink-0 rounded-lg px-2 py-1 text-xs font-bold ${scoreColor}`}>
                    {relevanceScore}%
                </span>
            </div>

            {/* Preview */}
            <div className="mt-3 text-sm leading-relaxed text-surface-400 line-clamp-4">
                {preview.split('\n').map((line, i) => {
                    if (line.startsWith('**') && line.endsWith('**')) {
                        return <span key={i} className="font-medium text-surface-300">{line.replace(/\*\*/g, '')} </span>;
                    }
                    return <span key={i}>{line} </span>;
                })}
            </div>

            {/* Footer */}
            <div className="mt-3 flex items-center justify-between text-[10px] text-surface-600">
                <span className="flex items-center gap-1">
                    <BookOpen className="h-2.5 w-2.5" />
                    {source}
                </span>
                <span className="flex items-center gap-1 text-primary-500 opacity-0 transition-opacity group-hover:opacity-100">
                    View full research
                    <ExternalLink className="h-2.5 w-2.5" />
                </span>
            </div>
        </button>
    );
}
