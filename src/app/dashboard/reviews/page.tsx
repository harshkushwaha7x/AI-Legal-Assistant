'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    ShieldCheck,
    Plus,
    Search,
    Filter,
    Clock,
    MoreVertical,
    Eye,
    Trash2,
    Loader2,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Timer,
} from 'lucide-react';

interface Review {
    id: string;
    fileName: string;
    fileSize: number;
    status: string;
    riskScore: number | null;
    riskLevel: string | null;
    summary: string | null;
    createdAt: string;
}

const statusConfig: Record<string, { icon: React.ElementType; label: string; color: string }> = {
    PENDING: { icon: Timer, label: 'Pending', color: 'bg-surface-500/15 text-surface-400' },
    ANALYZING: { icon: Loader2, label: 'Analyzing', color: 'bg-blue-500/15 text-blue-400' },
    COMPLETED: { icon: CheckCircle2, label: 'Completed', color: 'bg-emerald-500/15 text-emerald-400' },
    FAILED: { icon: XCircle, label: 'Failed', color: 'bg-red-500/15 text-red-400' },
};

const riskColors: Record<string, string> = {
    LOW: 'text-emerald-400',
    MEDIUM: 'text-amber-400',
    HIGH: 'text-orange-400',
    CRITICAL: 'text-red-400',
};

const riskBgColors: Record<string, string> = {
    LOW: 'bg-emerald-500/15 text-emerald-400',
    MEDIUM: 'bg-amber-500/15 text-amber-400',
    HIGH: 'bg-orange-500/15 text-orange-400',
    CRITICAL: 'bg-red-500/15 text-red-400',
};

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function RiskScoreRing({ score, level }: { score: number; level: string }) {
    const radius = 18;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    const color = riskColors[level] || 'text-surface-500';

    return (
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center">
            <svg className="h-12 w-12 -rotate-90" viewBox="0 0 44 44">
                <circle cx="22" cy="22" r={radius} fill="none" stroke="currentColor" strokeWidth="3" className="text-white/5" />
                <circle
                    cx="22" cy="22" r={radius} fill="none" stroke="currentColor" strokeWidth="3"
                    strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
                    className={`${color} transition-all duration-700`}
                />
            </svg>
            <span className={`absolute text-xs font-bold ${color}`}>{score}</span>
        </div>
    );
}

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [openMenu, setOpenMenu] = useState<string | null>(null);

    useEffect(() => {
        fetchReviews();
    }, [filterStatus]);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filterStatus) params.set('status', filterStatus);
            const res = await fetch(`/api/reviews?${params.toString()}`);
            const data = await res.json();
            setReviews(data.reviews || []);
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteReview = async (id: string) => {
        if (!confirm('Delete this review? This action cannot be undone.')) return;
        try {
            await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
            setReviews((prev) => prev.filter((r) => r.id !== id));
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    const filtered = reviews.filter((r) =>
        r.fileName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Contract Reviews</h1>
                    <p className="mt-1 text-sm text-surface-400">
                        Upload contracts for AI-powered risk analysis and clause review.
                    </p>
                </div>
                <Link
                    href="/dashboard/reviews/new"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition-all hover:bg-primary-500"
                >
                    <Plus className="h-4 w-4" />
                    New Review
                </Link>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-500" />
                    <input
                        type="text"
                        placeholder="Search reviews..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-surface-500 outline-none transition-all focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50"
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-500" />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="appearance-none rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-10 text-sm text-white outline-none transition-all focus:border-primary-500"
                    >
                        <option value="">All Statuses</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="ANALYZING">Analyzing</option>
                        <option value="PENDING">Pending</option>
                        <option value="FAILED">Failed</option>
                    </select>
                </div>
            </div>

            {/* Reviews list */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="glass-card flex flex-col items-center justify-center rounded-xl py-20 text-center">
                    <ShieldCheck className="mb-4 h-14 w-14 text-surface-600" />
                    <h3 className="text-lg font-medium text-surface-300">
                        {reviews.length === 0 ? 'No reviews yet' : 'No matching reviews'}
                    </h3>
                    <p className="mt-1 max-w-sm text-sm text-surface-500">
                        {reviews.length === 0
                            ? 'Upload a contract to get AI-powered risk analysis.'
                            : 'Try adjusting your search or filters.'}
                    </p>
                    {reviews.length === 0 && (
                        <Link
                            href="/dashboard/reviews/new"
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-500"
                        >
                            <Plus className="h-4 w-4" />
                            Upload Contract
                        </Link>
                    )}
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map((review) => {
                        const statusCfg = statusConfig[review.status] || statusConfig.PENDING;
                        const StatusIcon = statusCfg.icon;

                        return (
                            <div
                                key={review.id}
                                className="glass-card group flex items-center gap-4 rounded-xl p-4 transition-all hover:-translate-y-0.5"
                            >
                                {/* Risk score ring or status icon */}
                                {review.status === 'COMPLETED' && review.riskScore !== null && review.riskLevel ? (
                                    <RiskScoreRing score={review.riskScore} level={review.riskLevel} />
                                ) : (
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-500/10">
                                        <StatusIcon className={`h-5 w-5 ${review.status === 'ANALYZING' ? 'animate-spin text-blue-400' : 'text-primary-400'}`} />
                                    </div>
                                )}

                                <div className="flex-1 min-w-0">
                                    <Link
                                        href={`/dashboard/reviews/${review.id}`}
                                        className="text-sm font-semibold text-white hover:text-primary-300 transition-colors truncate block"
                                    >
                                        {review.fileName}
                                    </Link>
                                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-surface-500">
                                        <span>{formatFileSize(review.fileSize)}</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                        {review.summary && (
                                            <>
                                                <span>•</span>
                                                <span className="truncate max-w-[200px]">{review.summary}</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Risk level badge */}
                                {review.riskLevel && (
                                    <span className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium ${riskBgColors[review.riskLevel]}`}>
                                        <AlertTriangle className="h-3 w-3" />
                                        {review.riskLevel}
                                    </span>
                                )}

                                {/* Status badge */}
                                <span className={`rounded-lg px-2.5 py-1 text-xs font-medium ${statusCfg.color}`}>
                                    {statusCfg.label}
                                </span>

                                {/* Actions */}
                                <div className="relative">
                                    <button
                                        onClick={() => setOpenMenu(openMenu === review.id ? null : review.id)}
                                        className="flex h-8 w-8 items-center justify-center rounded-lg text-surface-500 transition-colors hover:bg-white/5 hover:text-white"
                                    >
                                        <MoreVertical className="h-4 w-4" />
                                    </button>
                                    {openMenu === review.id && (
                                        <div className="absolute right-0 top-full z-10 mt-1 w-40 animate-fade-in rounded-xl border border-white/5 bg-surface-900 p-1 shadow-xl">
                                            <Link
                                                href={`/dashboard/reviews/${review.id}`}
                                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-surface-300 hover:bg-white/5 hover:text-white"
                                            >
                                                <Eye className="h-4 w-4" />
                                                View Report
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    setOpenMenu(null);
                                                    deleteReview(review.id);
                                                }}
                                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
