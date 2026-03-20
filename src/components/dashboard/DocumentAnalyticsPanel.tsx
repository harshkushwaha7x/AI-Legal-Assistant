'use client';

import { useMemo } from 'react';
import { BarChart3, FileText, BookOpen, Clock, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
    calculateDocumentStats,
    assessReadability,
    extractLegalTerms,
} from '@/lib/document-analytics';

interface DocumentAnalyticsPanelProps {
    content: string;
    previousContent?: string;
}

function TrendIndicator({ current, previous }: { current: number; previous?: number }) {
    if (previous === undefined) return null;
    const diff = current - previous;
    if (diff > 0) return <TrendingUp className="h-3 w-3 text-green-400" />;
    if (diff < 0) return <TrendingDown className="h-3 w-3 text-red-400" />;
    return <Minus className="h-3 w-3 text-surface-600" />;
}

export default function DocumentAnalyticsPanel({ content, previousContent }: DocumentAnalyticsPanelProps) {
    const stats = useMemo(() => calculateDocumentStats(content), [content]);
    const prevStats = useMemo(
        () => (previousContent ? calculateDocumentStats(previousContent) : null),
        [previousContent]
    );
    const readability = useMemo(() => assessReadability(content), [content]);
    const legalTerms = useMemo(() => extractLegalTerms(content), [content]);

    const readabilityColors = {
        simple: 'text-emerald-400 bg-emerald-500/10',
        moderate: 'text-blue-400 bg-blue-500/10',
        complex: 'text-amber-400 bg-amber-500/10',
        expert: 'text-red-400 bg-red-500/10',
    };

    return (
        <div className="glass-card rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary-400" />
                <h3 className="text-sm font-semibold text-white">Document Analytics</h3>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-white/[3%] px-3 py-2">
                    <div className="flex items-center gap-1.5 text-[10px] text-surface-500">
                        <FileText className="h-3 w-3" />
                        Words
                    </div>
                    <div className="mt-1 flex items-center gap-1.5">
                        <span className="text-lg font-semibold text-white">
                            {stats.wordCount.toLocaleString()}
                        </span>
                        <TrendIndicator current={stats.wordCount} previous={prevStats?.wordCount} />
                    </div>
                </div>

                <div className="rounded-lg bg-white/[3%] px-3 py-2">
                    <div className="flex items-center gap-1.5 text-[10px] text-surface-500">
                        <BookOpen className="h-3 w-3" />
                        Sentences
                    </div>
                    <div className="mt-1 flex items-center gap-1.5">
                        <span className="text-lg font-semibold text-white">
                            {stats.sentenceCount}
                        </span>
                        <TrendIndicator current={stats.sentenceCount} previous={prevStats?.sentenceCount} />
                    </div>
                </div>

                <div className="rounded-lg bg-white/[3%] px-3 py-2">
                    <div className="flex items-center gap-1.5 text-[10px] text-surface-500">
                        <Clock className="h-3 w-3" />
                        Reading Time
                    </div>
                    <div className="mt-1">
                        <span className="text-lg font-semibold text-white">
                            {stats.readingTimeMinutes}
                        </span>
                        <span className="ml-1 text-xs text-surface-500">min</span>
                    </div>
                </div>

                <div className="rounded-lg bg-white/[3%] px-3 py-2">
                    <div className="text-[10px] text-surface-500">Avg Sentence</div>
                    <div className="mt-1">
                        <span className="text-lg font-semibold text-white">
                            {stats.avgWordsPerSentence}
                        </span>
                        <span className="ml-1 text-xs text-surface-500">words</span>
                    </div>
                </div>
            </div>

            {/* Readability */}
            <div className="rounded-lg border border-white/5 p-3">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-medium uppercase tracking-wider text-surface-500">
                        Readability
                    </span>
                    <span className={`rounded px-2 py-0.5 text-[10px] font-medium ${readabilityColors[readability.level]}`}>
                        {readability.level} ({readability.score}/10)
                    </span>
                </div>
                <p className="mt-1.5 text-[10px] text-surface-500">{readability.description}</p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
                    <div
                        className={`h-full rounded-full transition-all ${
                            readability.score <= 3 ? 'bg-emerald-500' :
                            readability.score <= 5 ? 'bg-blue-500' :
                            readability.score <= 7 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${readability.score * 10}%` }}
                    />
                </div>
            </div>

            {/* Legal terms */}
            {legalTerms.length > 0 && (
                <div>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-surface-500">
                        Legal Terms Found ({legalTerms.length})
                    </span>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                        {legalTerms.slice(0, 12).map((term) => (
                            <span
                                key={term}
                                className="rounded bg-primary-500/10 px-1.5 py-0.5 text-[9px] text-primary-400"
                            >
                                {term}
                            </span>
                        ))}
                        {legalTerms.length > 12 && (
                            <span className="rounded bg-white/5 px-1.5 py-0.5 text-[9px] text-surface-600">
                                +{legalTerms.length - 12} more
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
