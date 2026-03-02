'use client';

import { Search, Sparkles, ArrowRight } from 'lucide-react';

const SUGGESTIONS = [
    'What are the elements of a valid contract?',
    'Explain the Fair Labor Standards Act overtime rules',
    'How does copyright protection work for software?',
    'LLC vs S-Corp tax implications',
    'Tenant rights when landlord fails to make repairs',
    'GDPR compliance requirements for US companies',
    'At-will employment exceptions by state',
    'Statute of frauds requirements',
];

interface ResearchSearchBarProps {
    value: string;
    onChange: (value: string) => void;
    onSearch: () => void;
    loading?: boolean;
}

export default function ResearchSearchBar({
    value,
    onChange,
    onSearch,
    loading,
}: ResearchSearchBarProps) {
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !loading && value.trim()) {
            onSearch();
        }
    };

    return (
        <div className="space-y-3">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-surface-500" />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search legal topics, statutes, case law..."
                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-32 text-sm text-white placeholder-surface-500 outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                />
                <button
                    onClick={onSearch}
                    disabled={!value.trim() || loading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-primary-500 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <Sparkles className="h-3.5 w-3.5" />
                    Research
                </button>
            </div>

            {/* Quick suggestions */}
            {!value && (
                <div className="flex flex-wrap gap-1.5">
                    {SUGGESTIONS.slice(0, 4).map((suggestion) => (
                        <button
                            key={suggestion}
                            onClick={() => {
                                onChange(suggestion);
                                setTimeout(onSearch, 100);
                            }}
                            className="group inline-flex items-center gap-1 rounded-lg bg-white/[0.03] px-2.5 py-1.5 text-[11px] text-surface-400 ring-1 ring-white/5 transition-all hover:bg-white/5 hover:text-white hover:ring-primary-500/20"
                        >
                            {suggestion}
                            <ArrowRight className="h-2.5 w-2.5 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
