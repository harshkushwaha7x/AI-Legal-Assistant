'use client';

import { useState, useMemo } from 'react';
import { Search, Book, ChevronDown, ChevronUp } from 'lucide-react';
import { LEGAL_GLOSSARY, searchGlossary, getGlossaryCategories, type GlossaryTerm } from '@/lib/legal-glossary';

const CATEGORY_LABELS: Record<string, string> = {
    court: 'Court & Litigation',
    contract: 'Contracts',
    'dispute-resolution': 'Dispute Resolution',
    business: 'Business',
    remedies: 'Remedies',
    general: 'General',
    transaction: 'Transactions',
    ip: 'Intellectual Property',
    property: 'Property',
};

export default function LegalGlossary() {
    const [query, setQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [expandedTerm, setExpandedTerm] = useState<string | null>(null);

    const categories = useMemo(() => getGlossaryCategories(), []);

    const filteredTerms = useMemo(() => {
        let results: GlossaryTerm[] = query ? searchGlossary(query) : LEGAL_GLOSSARY;
        if (selectedCategory) {
            results = results.filter((t) => t.category === selectedCategory);
        }
        return results;
    }, [query, selectedCategory]);

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Book className="h-4 w-4 text-primary-400" />
                <h3 className="text-sm font-semibold text-white">Legal Glossary</h3>
                <span className="text-[10px] text-surface-600">
                    {filteredTerms.length} terms
                </span>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-surface-500" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search legal terms..."
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

            {/* Terms list */}
            <div className="divide-y divide-white/5">
                {filteredTerms.map((term) => (
                    <div key={term.term} className="py-2">
                        <button
                            onClick={() =>
                                setExpandedTerm(expandedTerm === term.term ? null : term.term)
                            }
                            className="flex w-full items-center justify-between text-left"
                        >
                            <span className="text-sm font-medium text-white">{term.term}</span>
                            {expandedTerm === term.term ? (
                                <ChevronUp className="h-3.5 w-3.5 text-surface-600" />
                            ) : (
                                <ChevronDown className="h-3.5 w-3.5 text-surface-600" />
                            )}
                        </button>
                        {expandedTerm === term.term && (
                            <div className="mt-2 space-y-1.5">
                                <p className="text-xs leading-relaxed text-surface-400">
                                    {term.definition}
                                </p>
                                {term.relatedTerms && term.relatedTerms.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        <span className="text-[10px] text-surface-600">Related:</span>
                                        {term.relatedTerms.map((rt) => (
                                            <button
                                                key={rt}
                                                onClick={() => setQuery(rt)}
                                                className="text-[10px] text-primary-400 hover:underline"
                                            >
                                                {rt}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {filteredTerms.length === 0 && (
                <p className="py-4 text-center text-xs text-surface-600">
                    No terms found matching your search.
                </p>
            )}
        </div>
    );
}
