'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Search,
    FileText,
    ShieldCheck,
    UserCheck,
    BookOpen,
    Loader2,
    ArrowRight,
    X,
} from 'lucide-react';
import Link from 'next/link';

interface SearchResult {
    id: string;
    _type: string;
    title?: string;
    contractTitle?: string;
    subject?: string;
    status?: string;
    type?: string;
    category?: string;
    riskLevel?: string;
    priority?: number;
    createdAt: string;
}

const TYPE_CONFIG: Record<string, { icon: React.ElementType; color: string; label: string; href: string }> = {
    document: { icon: FileText, color: 'text-primary-400', label: 'Document', href: '/dashboard/documents' },
    review: { icon: ShieldCheck, color: 'text-emerald-400', label: 'Review', href: '/dashboard/reviews' },
    escalation: { icon: UserCheck, color: 'text-amber-400', label: 'Escalation', href: '/dashboard/escalations' },
    knowledge: { icon: BookOpen, color: 'text-violet-400', label: 'Knowledge', href: '/dashboard/research' },
};

export default function SearchResults() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Record<string, SearchResult[]>>({});
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async () => {
        if (query.trim().length < 2) return;
        setLoading(true);
        setSearched(true);

        try {
            const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
            if (res.ok) {
                const data = await res.json();
                setResults({
                    documents: data.documents || [],
                    reviews: data.reviews || [],
                    escalations: data.escalations || [],
                    knowledge: data.knowledge || [],
                });
                setTotal(data.total || 0);
            }
        } catch {
            console.error('Search failed');
        } finally {
            setLoading(false);
        }
    };

    const getTitle = (item: SearchResult): string => {
        return item.title || item.contractTitle || item.subject || 'Untitled';
    };

    return (
        <div>
            {/* Search bar */}
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-surface-500" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search documents, reviews, escalations..."
                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-28 text-sm text-white outline-none transition-all focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 placeholder-surface-500"
                />
                {query && (
                    <button
                        onClick={() => { setQuery(''); setSearched(false); setResults({}); }}
                        className="absolute right-20 top-1/2 -translate-y-1/2 rounded-lg p-1 text-surface-500 hover:text-white"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
                <button
                    onClick={handleSearch}
                    disabled={query.trim().length < 2 || loading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-primary-600 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-primary-500 disabled:opacity-40"
                >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
                </button>
            </div>

            {/* Results */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-primary-400" />
                </div>
            )}

            {!loading && searched && total === 0 && (
                <div className="py-12 text-center">
                    <Search className="mx-auto h-10 w-10 text-surface-600" />
                    <p className="mt-3 text-sm text-surface-400">No results found for &quot;{query}&quot;</p>
                    <p className="text-xs text-surface-600">Try different keywords</p>
                </div>
            )}

            {!loading && total > 0 && (
                <div className="space-y-6">
                    <p className="text-xs text-surface-500">
                        Found <span className="font-semibold text-white">{total}</span> result{total !== 1 ? 's' : ''}
                    </p>

                    {Object.entries(results).map(([type, items]) => {
                        if (items.length === 0) return null;
                        const config = TYPE_CONFIG[type] || TYPE_CONFIG.document;

                        return (
                            <div key={type}>
                                <div className="mb-2 flex items-center gap-2">
                                    <config.icon className={`h-4 w-4 ${config.color}`} />
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-surface-400">
                                        {config.label}s ({items.length})
                                    </h3>
                                </div>
                                <div className="space-y-1.5">
                                    {items.map((item) => (
                                        <Link
                                            key={item.id}
                                            href={`${config.href}/${item.id}`}
                                            className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all hover:bg-white/5 group"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-surface-200 truncate group-hover:text-white">
                                                    {getTitle(item)}
                                                </p>
                                                <p className="text-[11px] text-surface-500">
                                                    {new Date(item.createdAt).toLocaleDateString()}
                                                    {item.status && ` · ${item.status}`}
                                                </p>
                                            </div>
                                            <ArrowRight className="h-3.5 w-3.5 text-surface-600 opacity-0 transition-opacity group-hover:opacity-100" />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
