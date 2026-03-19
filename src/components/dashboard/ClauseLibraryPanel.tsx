'use client';

import { useState, useMemo } from 'react';
import { Library, Search, Copy, Check, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import {
    CLAUSE_LIBRARY,
    searchClauses,
    getClauseCategories,
    type ClauseTemplate,
} from '@/lib/clause-library';

const CATEGORY_LABELS: Record<string, string> = {
    confidentiality: 'Confidentiality',
    indemnification: 'Indemnification',
    liability: 'Liability',
    termination: 'Termination',
    general: 'General',
    'intellectual-property': 'Intellectual Property',
    'restrictive-covenants': 'Restrictive Covenants',
};

const RISK_STYLES: Record<string, { color: string; bg: string }> = {
    low: { color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    medium: { color: 'text-amber-400', bg: 'bg-amber-500/10' },
    high: { color: 'text-red-400', bg: 'bg-red-500/10' },
};

export default function ClauseLibraryPanel() {
    const [query, setQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [expandedClause, setExpandedClause] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const categories = useMemo(() => getClauseCategories(), []);

    const filteredClauses = useMemo(() => {
        let results: ClauseTemplate[] = query ? searchClauses(query) : CLAUSE_LIBRARY;
        if (selectedCategory) {
            results = results.filter((c) => c.category === selectedCategory);
        }
        return results;
    }, [query, selectedCategory]);

    const handleCopy = async (clause: ClauseTemplate) => {
        try {
            await navigator.clipboard.writeText(clause.content);
            setCopiedId(clause.id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch {
            // Fallback
        }
    };

    return (
        <div className="glass-card rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2">
                <Library className="h-4 w-4 text-primary-400" />
                <h3 className="text-sm font-semibold text-white">Clause Library</h3>
                <span className="text-[10px] text-surface-600">
                    {filteredClauses.length} clauses
                </span>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-surface-500" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search clauses..."
                    className="w-full rounded-lg border border-white/10 bg-white/5 pl-9 pr-3 py-2 text-sm text-white placeholder-surface-600 outline-none focus:border-primary-500"
                />
            </div>

            {/* Category filter */}
            <div className="flex flex-wrap gap-1.5">
                <button
                    onClick={() => setSelectedCategory(null)}
                    className={`rounded-md px-2 py-1 text-[10px] font-medium transition-colors ${
                        !selectedCategory
                            ? 'bg-primary-500/20 text-primary-400'
                            : 'bg-white/5 text-surface-500 hover:text-surface-300'
                    }`}
                >
                    All
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                        className={`rounded-md px-2 py-1 text-[10px] font-medium transition-colors ${
                            selectedCategory === cat
                                ? 'bg-primary-500/20 text-primary-400'
                                : 'bg-white/5 text-surface-500 hover:text-surface-300'
                        }`}
                    >
                        {CATEGORY_LABELS[cat] || cat}
                    </button>
                ))}
            </div>

            {/* Clause list */}
            <div className="space-y-2">
                {filteredClauses.map((clause) => {
                    const isExpanded = expandedClause === clause.id;
                    const risk = RISK_STYLES[clause.riskLevel];

                    return (
                        <div
                            key={clause.id}
                            className="rounded-lg border border-white/5 bg-white/[2%]"
                        >
                            <button
                                onClick={() => setExpandedClause(isExpanded ? null : clause.id)}
                                className="flex w-full items-center gap-3 px-3 py-2.5 text-left"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-medium text-white">
                                            {clause.name}
                                        </span>
                                        <span className={`rounded px-1.5 py-0.5 text-[9px] font-medium ${risk.bg} ${risk.color}`}>
                                            {clause.riskLevel}
                                        </span>
                                    </div>
                                    <p className="mt-0.5 text-[10px] text-surface-500 truncate">
                                        {clause.description}
                                    </p>
                                </div>
                                {isExpanded ? (
                                    <ChevronUp className="h-3.5 w-3.5 shrink-0 text-surface-600" />
                                ) : (
                                    <ChevronDown className="h-3.5 w-3.5 shrink-0 text-surface-600" />
                                )}
                            </button>

                            {isExpanded && (
                                <div className="border-t border-white/5 px-3 py-3 space-y-3">
                                    <p className="text-[11px] leading-relaxed text-surface-400">
                                        {clause.content}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 text-[9px] text-surface-600">
                                            <Shield className="h-2.5 w-2.5" />
                                            {CATEGORY_LABELS[clause.category] || clause.category}
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCopy(clause);
                                            }}
                                            className="flex items-center gap-1.5 rounded-md bg-primary-600 px-2.5 py-1 text-[10px] font-medium text-white transition-colors hover:bg-primary-500"
                                        >
                                            {copiedId === clause.id ? (
                                                <>
                                                    <Check className="h-3 w-3" />
                                                    Copied
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="h-3 w-3" />
                                                    Copy Clause
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}

                {filteredClauses.length === 0 && (
                    <p className="py-4 text-center text-xs text-surface-600">
                        No clauses match your search.
                    </p>
                )}
            </div>
        </div>
    );
}
