'use client';

import { FileText, MessageSquare, Scale, AlertTriangle, Search } from 'lucide-react';
import { SearchResult, SearchRecord, highlightMatches } from '@/lib/search-index';

type ResultType = 'document' | 'chat' | 'review' | 'escalation';

interface TypedRecord extends SearchRecord {
    type?: ResultType;
    title?: string;
    description?: string;
    status?: string;
}

const TYPE_CONFIG: Record<ResultType, { icon: React.ElementType; color: string; label: string }> = {
    document: { icon: FileText, color: 'text-blue-400', label: 'Document' },
    chat: { icon: MessageSquare, color: 'text-violet-400', label: 'Chat' },
    review: { icon: Scale, color: 'text-emerald-400', label: 'Review' },
    escalation: { icon: AlertTriangle, color: 'text-amber-400', label: 'Escalation' },
};

interface SearchQueryResultsProps {
    results: SearchResult<TypedRecord>[];
    query: string;
    isSearching?: boolean;
    onSelect?: (record: TypedRecord) => void;
    emptyMessage?: string;
}

function HighlightedText({ text, query }: { text: string; query: string }) {
    const tokenized = tokenizeQuery(query);
    if (!tokenized.length) return <span>{text}</span>;

    const parts: { text: string; highlight: boolean }[] = [];
    let remaining = text;

    for (const term of tokenized) {
        const idx = remaining.toLowerCase().indexOf(term.toLowerCase());
        if (idx === -1) continue;
        if (idx > 0) parts.push({ text: remaining.slice(0, idx), highlight: false });
        parts.push({ text: remaining.slice(idx, idx + term.length), highlight: true });
        remaining = remaining.slice(idx + term.length);
    }

    if (remaining) parts.push({ text: remaining, highlight: false });

    return (
        <span>
            {parts.map((p, i) =>
                p.highlight ? (
                    <mark key={i} className="rounded bg-primary-500/20 text-primary-300 not-italic">
                        {p.text}
                    </mark>
                ) : (
                    <span key={i}>{p.text}</span>
                )
            )}
        </span>
    );
}

function tokenizeQuery(q: string): string[] {
    return q
        .toLowerCase()
        .split(/\s+/)
        .filter((t) => t.length > 1);
}

export default function SearchQueryResults({
    results,
    query,
    isSearching = false,
    onSelect,
    emptyMessage = 'No results found.',
}: SearchQueryResultsProps) {
    if (isSearching) {
        return (
            <div className="flex items-center justify-center gap-2 py-6 text-xs text-surface-500">
                <Search className="h-3.5 w-3.5 animate-pulse" />
                Searching...
            </div>
        );
    }

    if (!query.trim()) return null;

    if (results.length === 0) {
        return (
            <div className="py-6 text-center text-xs text-surface-600">{emptyMessage}</div>
        );
    }

    return (
        <div className="space-y-1">
            <p className="px-1 pb-1 text-[10px] text-surface-600">
                {results.length} result{results.length !== 1 ? 's' : ''}
            </p>

            {results.map(({ record, score, matchedFields }) => {
                const type = (record.type as ResultType) || 'document';
                const config = TYPE_CONFIG[type] || TYPE_CONFIG.document;
                const Icon = config.icon;
                const title = String(record.title || record.id || '');
                const description = String(record.description || '');

                return (
                    <button
                        key={record.id}
                        onClick={() => onSelect?.(record)}
                        className="flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-white/5"
                    >
                        <div className={`mt-0.5 shrink-0 ${config.color}`}>
                            <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-white truncate">
                                <HighlightedText text={title} query={query} />
                            </p>
                            {description && (
                                <p className="mt-0.5 truncate text-[10px] text-surface-500">
                                    <HighlightedText text={description} query={query} />
                                </p>
                            )}
                            <div className="mt-1 flex items-center gap-2">
                                <span className="text-[9px] text-surface-600">{config.label}</span>
                                {record.status && (
                                    <span className="text-[9px] text-surface-700">
                                        {String(record.status)}
                                    </span>
                                )}
                            </div>
                        </div>
                        <span className="shrink-0 text-[9px] text-surface-700 mt-1">
                            {score.toFixed(1)}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
