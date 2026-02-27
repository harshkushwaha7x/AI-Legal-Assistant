'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    Download,
    Trash2,
    Loader2,
    ShieldCheck,
    ShieldAlert,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    ChevronDown,
    ChevronUp,
    Clock,
    FileText,
    AlertCircle,
} from 'lucide-react';

interface ReviewFinding {
    id: string;
    title: string;
    description: string;
    severity: string;
    clause: string;
    suggestion: string;
}

interface ReviewClause {
    id: string;
    title: string;
    content: string;
    riskLevel: string;
    analysis: string;
}

interface ReviewData {
    id: string;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    status: string;
    riskScore: number | null;
    riskLevel: string | null;
    summary: string | null;
    findings: ReviewFinding[] | null;
    clauses: ReviewClause[] | null;
    createdAt: string;
    updatedAt: string;
}

const riskConfig: Record<string, { color: string; bg: string; icon: React.ElementType; gradient: string }> = {
    LOW: { color: 'text-emerald-400', bg: 'bg-emerald-500/15', icon: CheckCircle2, gradient: 'from-emerald-500 to-emerald-400' },
    MEDIUM: { color: 'text-amber-400', bg: 'bg-amber-500/15', icon: AlertTriangle, gradient: 'from-amber-500 to-amber-400' },
    HIGH: { color: 'text-orange-400', bg: 'bg-orange-500/15', icon: ShieldAlert, gradient: 'from-orange-500 to-orange-400' },
    CRITICAL: { color: 'text-red-400', bg: 'bg-red-500/15', icon: XCircle, gradient: 'from-red-500 to-red-400' },
};

const severityOrder: Record<string, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };

function RiskGauge({ score, level }: { score: number; level: string }) {
    const config = riskConfig[level] || riskConfig.LOW;
    const radius = 52;
    const circumference = Math.PI * radius; // semi-circle
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="relative flex flex-col items-center">
            <svg className="h-36 w-36" viewBox="0 0 120 70">
                {/* Background arc */}
                <path
                    d="M 10 60 A 50 50 0 0 1 110 60"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeLinecap="round"
                    className="text-white/5"
                />
                {/* Score arc */}
                <path
                    d="M 10 60 A 50 50 0 0 1 110 60"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className={`${config.color} transition-all duration-1000 ease-out`}
                />
            </svg>
            <div className="absolute bottom-2 flex flex-col items-center">
                <span className={`text-3xl font-bold ${config.color}`}>{score}</span>
                <span className="text-xs text-surface-500">/100</span>
            </div>
        </div>
    );
}

function SeverityBadge({ severity }: { severity: string }) {
    const config = riskConfig[severity] || riskConfig.LOW;
    return (
        <span className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs font-medium ${config.bg} ${config.color}`}>
            <AlertTriangle className="h-3 w-3" />
            {severity}
        </span>
    );
}

export default function ReviewDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [review, setReview] = useState<ReviewData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedFindings, setExpandedFindings] = useState<Set<string>>(new Set());
    const [showContract, setShowContract] = useState(false);

    useEffect(() => {
        fetchReview();
    }, [id]);

    const fetchReview = async () => {
        try {
            const res = await fetch(`/api/reviews/${id}`);
            if (!res.ok) throw new Error('Review not found');
            const data = await res.json();
            setReview(data.review);
            // Auto-expand first 3 findings
            if (data.review.findings) {
                setExpandedFindings(new Set(data.review.findings.slice(0, 3).map((f: ReviewFinding) => f.id)));
            }
        } catch {
            setError('Review not found or access denied.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Permanently delete this review and all findings?')) return;
        try {
            await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
            router.push('/dashboard/reviews');
        } catch {
            setError('Failed to delete review.');
        }
    };

    const toggleFinding = (findingId: string) => {
        setExpandedFindings((prev) => {
            const next = new Set(prev);
            if (next.has(findingId)) next.delete(findingId);
            else next.add(findingId);
            return next;
        });
    };

    const handleDownloadReport = () => {
        if (!review) return;
        const lines: string[] = [];
        lines.push(`CONTRACT REVIEW REPORT`);
        lines.push(`${'='.repeat(50)}`);
        lines.push(`File: ${review.fileName}`);
        lines.push(`Date: ${new Date(review.createdAt).toLocaleDateString()}`);
        lines.push(`Risk Score: ${review.riskScore}/100 (${review.riskLevel})`);
        lines.push('');
        lines.push(`SUMMARY`);
        lines.push(`${'-'.repeat(50)}`);
        lines.push(review.summary || 'No summary available.');
        lines.push('');
        if (review.findings && review.findings.length > 0) {
            lines.push(`FINDINGS (${review.findings.length})`);
            lines.push(`${'-'.repeat(50)}`);
            review.findings.forEach((f, i) => {
                lines.push(`${i + 1}. [${f.severity}] ${f.title}`);
                lines.push(`   ${f.description}`);
                lines.push(`   Clause: ${f.clause}`);
                lines.push(`   Suggestion: ${f.suggestion}`);
                lines.push('');
            });
        }
        if (review.clauses && review.clauses.length > 0) {
            lines.push(`CLAUSE ANALYSIS (${review.clauses.length})`);
            lines.push(`${'-'.repeat(50)}`);
            review.clauses.forEach((c, i) => {
                lines.push(`${i + 1}. [${c.riskLevel}] ${c.title}`);
                lines.push(`   ${c.analysis}`);
                lines.push('');
            });
        }

        const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${review.fileName}_review_report.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    /* ── Loading ──────────────────────────────────────────── */
    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
            </div>
        );
    }

    /* ── Error ────────────────────────────────────────────── */
    if (error && !review) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
                <AlertCircle className="mb-4 h-12 w-12 text-red-400" />
                <h2 className="text-lg font-medium text-white">{error}</h2>
                <Link
                    href="/dashboard/reviews"
                    className="mt-4 inline-flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Reviews
                </Link>
            </div>
        );
    }

    if (!review) return null;

    const riskCfg = riskConfig[review.riskLevel || 'LOW'] || riskConfig.LOW;
    const RiskIcon = riskCfg.icon;
    const sortedFindings = [...(review.findings || [])].sort(
        (a, b) => (severityOrder[a.severity] ?? 9) - (severityOrder[b.severity] ?? 9)
    );
    const criticalCount = sortedFindings.filter((f) => f.severity === 'CRITICAL').length;
    const highCount = sortedFindings.filter((f) => f.severity === 'HIGH').length;

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <Link
                        href="/dashboard/reviews"
                        className="mb-3 inline-flex items-center gap-1.5 text-sm text-surface-400 transition-colors hover:text-white"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Reviews
                    </Link>
                    <h1 className="text-xl font-bold text-white sm:text-2xl">{review.fileName}</h1>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-surface-500">
                        <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {(review.fileSize / 1024).toFixed(1)} KB
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleDownloadReport}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white transition-all hover:bg-white/10"
                    >
                        <Download className="h-3.5 w-3.5" />
                        Download Report
                    </button>
                    <button
                        onClick={handleDelete}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-500/20 text-red-400 transition-colors hover:bg-red-500/10"
                        title="Delete"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Risk Overview Card */}
            <div className="glass-card rounded-2xl p-6 sm:p-8">
                <div className="flex flex-col items-center gap-6 sm:flex-row">
                    {/* Gauge */}
                    {review.riskScore !== null && review.riskLevel && (
                        <RiskGauge score={review.riskScore} level={review.riskLevel} />
                    )}

                    <div className="flex-1 text-center sm:text-left">
                        <div className="mb-2 flex items-center justify-center gap-2 sm:justify-start">
                            <RiskIcon className={`h-5 w-5 ${riskCfg.color}`} />
                            <span className={`text-lg font-bold ${riskCfg.color}`}>
                                {review.riskLevel} RISK
                            </span>
                        </div>
                        <p className="text-sm leading-relaxed text-surface-300">
                            {review.summary}
                        </p>

                        {/* Quick stats */}
                        <div className="mt-4 flex flex-wrap gap-4">
                            <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 text-xs">
                                <span className="text-surface-500">Findings:</span>
                                <span className="font-medium text-white">{sortedFindings.length}</span>
                            </div>
                            {criticalCount > 0 && (
                                <div className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-1.5 text-xs">
                                    <span className="text-red-400">Critical:</span>
                                    <span className="font-medium text-red-300">{criticalCount}</span>
                                </div>
                            )}
                            {highCount > 0 && (
                                <div className="flex items-center gap-2 rounded-lg bg-orange-500/10 px-3 py-1.5 text-xs">
                                    <span className="text-orange-400">High:</span>
                                    <span className="font-medium text-orange-300">{highCount}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 text-xs">
                                <span className="text-surface-500">Clauses:</span>
                                <span className="font-medium text-white">{review.clauses?.length || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Findings */}
            {sortedFindings.length > 0 && (
                <div>
                    <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-white">
                        <ShieldAlert className="h-5 w-5 text-primary-400" />
                        Findings
                        <span className="ml-1 rounded-lg bg-white/5 px-2 py-0.5 text-xs font-medium text-surface-400">
                            {sortedFindings.length}
                        </span>
                    </h2>
                    <div className="space-y-2">
                        {sortedFindings.map((finding) => {
                            const isExpanded = expandedFindings.has(finding.id);
                            return (
                                <div key={finding.id} className="glass-card overflow-hidden rounded-xl">
                                    <button
                                        onClick={() => toggleFinding(finding.id)}
                                        className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-white/[0.02]"
                                    >
                                        <SeverityBadge severity={finding.severity} />
                                        <span className="flex-1 text-sm font-medium text-white">{finding.title}</span>
                                        {isExpanded ? (
                                            <ChevronUp className="h-4 w-4 text-surface-500" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4 text-surface-500" />
                                        )}
                                    </button>

                                    {isExpanded && (
                                        <div className="border-t border-white/5 px-4 pb-4 pt-3 space-y-3 animate-fade-in">
                                            <div>
                                                <p className="text-xs font-medium uppercase tracking-wider text-surface-500 mb-1">Description</p>
                                                <p className="text-sm text-surface-300">{finding.description}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium uppercase tracking-wider text-surface-500 mb-1">Relevant Clause</p>
                                                <p className="rounded-lg bg-white/[0.03] px-3 py-2 text-sm italic text-surface-400 border-l-2 border-primary-500/30">
                                                    {finding.clause}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium uppercase tracking-wider text-surface-500 mb-1">Recommendation</p>
                                                <p className="text-sm text-accent-400">{finding.suggestion}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Clause Analysis */}
            {review.clauses && review.clauses.length > 0 && (
                <div>
                    <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-white">
                        <FileText className="h-5 w-5 text-primary-400" />
                        Clause Analysis
                        <span className="ml-1 rounded-lg bg-white/5 px-2 py-0.5 text-xs font-medium text-surface-400">
                            {review.clauses.length}
                        </span>
                    </h2>
                    <div className="glass-card overflow-hidden rounded-xl divide-y divide-white/5">
                        {review.clauses.map((clause) => {
                            const clauseRiskCfg = riskConfig[clause.riskLevel] || riskConfig.LOW;
                            return (
                                <div key={clause.id} className="flex items-start gap-4 p-4">
                                    <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${clauseRiskCfg.bg}`}>
                                        <clauseRiskCfg.icon className={`h-4 w-4 ${clauseRiskCfg.color}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-sm font-semibold text-white">{clause.title}</h3>
                                            <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${clauseRiskCfg.bg} ${clauseRiskCfg.color}`}>
                                                {clause.riskLevel}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-sm text-surface-400">{clause.analysis}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Original Contract Text */}
            <div>
                <button
                    onClick={() => setShowContract(!showContract)}
                    className="mb-3 flex items-center gap-2 text-sm font-medium text-surface-400 transition-colors hover:text-white"
                >
                    {showContract ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    {showContract ? 'Hide' : 'Show'} Original Contract Text
                </button>
                {showContract && (
                    <div className="glass-card rounded-xl p-6 animate-fade-in">
                        <pre className="max-h-[60vh] overflow-auto whitespace-pre-wrap font-mono text-xs leading-relaxed text-surface-400">
                            {review.fileUrl}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
}
