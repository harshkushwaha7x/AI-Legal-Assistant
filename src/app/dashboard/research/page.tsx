'use client';

import { useState } from 'react';
import {
    Search,
    Loader2,
    BookOpen,
    Scale,
    Sparkles,
    Globe,
} from 'lucide-react';
import ResearchSearchBar from '@/components/research/ResearchSearchBar';
import CategoryFilter from '@/components/research/CategoryFilter';
import ResearchResultCard from '@/components/research/ResearchResultCard';
import { JURISDICTIONS } from '@/lib/validations/research';

interface ResearchResult {
    title: string;
    content: string;
    category: string;
    relevanceScore: number;
    source: string;
    jurisdiction: string;
}

export default function ResearchPage() {
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('');
    const [jurisdiction, setJurisdiction] = useState('');
    const [searching, setSearching] = useState(false);
    const [results, setResults] = useState<ResearchResult[]>([]);
    const [answer, setAnswer] = useState('');
    const [hasSearched, setHasSearched] = useState(false);
    const [activeResult, setActiveResult] = useState<number | null>(null);

    const handleSearch = async () => {
        if (!query.trim() || searching) return;
        setSearching(true);
        setHasSearched(true);
        setActiveResult(null);

        try {
            const res = await fetch('/api/research', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: query.trim(),
                    ...(category && { category }),
                    ...(jurisdiction && { jurisdiction }),
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setResults(data.results || []);
            setAnswer(data.answer || '');
        } catch (error) {
            console.error('Research failed:', error);
            setResults([]);
            setAnswer('Research failed. Please try again.');
        } finally {
            setSearching(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white sm:text-3xl">Legal Research</h1>
                <p className="mt-1 text-sm text-surface-400">
                    AI-powered legal research — search statutes, case law, and legal principles.
                </p>
            </div>

            {/* Search bar */}
            <ResearchSearchBar
                value={query}
                onChange={setQuery}
                onSearch={handleSearch}
                loading={searching}
            />

            {/* Filters */}
            <div className="space-y-3">
                <CategoryFilter selected={category} onChange={setCategory} />
                <div className="flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5 text-surface-500" />
                    <select
                        value={jurisdiction}
                        onChange={(e) => setJurisdiction(e.target.value)}
                        className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white outline-none transition-all focus:border-primary-500"
                    >
                        <option value="">All Jurisdictions</option>
                        {JURISDICTIONS.map((j) => (
                            <option key={j} value={j}>{j}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Results */}
            {searching ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-primary-600/20 animate-pulse-glow" />
                        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary-600/10">
                            <Loader2 className="h-7 w-7 animate-spin text-primary-400" />
                        </div>
                    </div>
                    <p className="mt-4 text-sm font-medium text-white">Researching...</p>
                    <p className="mt-1 text-xs text-surface-500">Analyzing legal databases and case law</p>
                </div>
            ) : hasSearched ? (
                <div className="space-y-6">
                    {/* AI Answer */}
                    {answer && (
                        <div className="glass-card rounded-2xl p-6">
                            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                                <Sparkles className="h-4 w-4 text-primary-400" />
                                AI Research Summary
                            </div>
                            <div className="prose-sm max-h-96 overflow-y-auto text-sm leading-relaxed text-surface-300">
                                {answer.split('\n').map((line, i) => {
                                    if (line.startsWith('## ')) {
                                        return <h3 key={i} className="mt-4 mb-2 text-base font-bold text-white">{line.replace('## ', '')}</h3>;
                                    }
                                    if (line.startsWith('**') && line.endsWith('**')) {
                                        return <p key={i} className="mt-3 font-semibold text-surface-200">{line.replace(/\*\*/g, '')}</p>;
                                    }
                                    if (line.startsWith('- ') || line.startsWith('• ')) {
                                        return <p key={i} className="ml-4 before:content-['•'] before:mr-2 before:text-primary-400">{line.replace(/^[-•]\s*/, '')}</p>;
                                    }
                                    if (line.startsWith('⚖️') || line.startsWith('📚')) {
                                        return <p key={i} className="mt-2 font-medium text-amber-300">{line}</p>;
                                    }
                                    if (line === '---') {
                                        return <hr key={i} className="my-3 border-white/5" />;
                                    }
                                    if (line.trim() === '') return <div key={i} className="h-1.5" />;
                                    return <p key={i}>{line}</p>;
                                })}
                            </div>
                        </div>
                    )}

                    {/* Result cards */}
                    {results.length > 0 && (
                        <div>
                            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                                <BookOpen className="h-4 w-4 text-primary-400" />
                                Research Results
                                <span className="rounded-md bg-white/5 px-2 py-0.5 text-xs text-surface-500">
                                    {results.length} found
                                </span>
                            </h2>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {results.map((result, i) => (
                                    <ResearchResultCard
                                        key={i}
                                        {...result}
                                        onClick={() => setActiveResult(activeResult === i ? null : i)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Expanded result view */}
                    {activeResult !== null && results[activeResult] && (
                        <div className="glass-card rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white">{results[activeResult].title}</h3>
                            <div className="mt-1 flex items-center gap-2 text-xs text-surface-500">
                                <span className="rounded bg-primary-500/10 px-1.5 py-0.5 text-primary-400">
                                    {results[activeResult].category}
                                </span>
                                <span>{results[activeResult].jurisdiction}</span>
                                <span>•</span>
                                <span>{results[activeResult].source}</span>
                            </div>
                            <div className="mt-4 text-sm leading-relaxed text-surface-300 whitespace-pre-wrap">
                                {results[activeResult].content}
                            </div>
                        </div>
                    )}

                    {results.length === 0 && !answer && (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <Search className="mb-4 h-12 w-12 text-surface-600" />
                            <h3 className="text-lg font-medium text-surface-300">No results found</h3>
                            <p className="mt-1 text-sm text-surface-500">Try different keywords or broaden your search.</p>
                        </div>
                    )}
                </div>
            ) : (
                /* Empty state */
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 rounded-full bg-primary-600/15 animate-pulse-glow" />
                        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary-600/10 ring-1 ring-primary-500/20">
                            <Scale className="h-7 w-7 text-primary-400" />
                        </div>
                    </div>
                    <h2 className="text-xl font-bold text-white">AI Legal Research</h2>
                    <p className="mt-2 max-w-md text-sm text-surface-400">
                        Search case law, statutes, regulations, and legal principles with AI-powered analysis. Get comprehensive research reports in seconds.
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                        {['Statutes', 'Case Law', 'Regulations', 'Legal Principles', 'Comparisons'].map((tag) => (
                            <span key={tag} className="rounded-full bg-white/5 px-3 py-1 text-xs text-surface-400 ring-1 ring-white/5">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
