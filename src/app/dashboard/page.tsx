'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
    Scale,
    Loader2,
    FileText,
    ShieldCheck,
    MessageSquare,
    Search,
    TrendingUp,
    Clock,
    ArrowUpRight,
    AlertTriangle,
    UserCheck,
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
    documents: number;
    reviews: number;
    chatSessions: number;
    escalations: number;
}

interface RecentDoc {
    id: string;
    title: string;
    type: string;
    status: string;
    createdAt: string;
}

interface RecentReview {
    id: string;
    fileName: string;
    status: string;
    riskScore: number | null;
    riskLevel: string | null;
    createdAt: string;
}

interface RecentEscalation {
    id: string;
    subject: string;
    status: string;
    priority: number;
    createdAt: string;
}

const riskColors: Record<string, string> = {
    LOW: 'text-emerald-400',
    MEDIUM: 'text-amber-400',
    HIGH: 'text-orange-400',
    CRITICAL: 'text-red-400',
};

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentDocs, setRecentDocs] = useState<RecentDoc[]>([]);
    const [recentReviews, setRecentReviews] = useState<RecentReview[]>([]);
    const [recentEscalations, setRecentEscalations] = useState<RecentEscalation[]>([]);
    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {
        if (status === 'authenticated') fetchStats();
    }, [status]);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/dashboard/stats');
            const data = await res.json();
            setStats(data.stats);
            setRecentDocs(data.recent?.documents || []);
            setRecentReviews(data.recent?.reviews || []);
            setRecentEscalations(data.recent?.escalations || []);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoadingStats(false);
        }
    };

    if (status === 'loading') {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
            </div>
        );
    }

    const statCards = [
        { label: 'Documents', value: stats?.documents ?? 0, icon: FileText, color: 'text-primary-400', bg: 'bg-primary-500/10', href: '/dashboard/documents' },
        { label: 'Reviews', value: stats?.reviews ?? 0, icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10', href: '/dashboard/reviews' },
        { label: 'Chat Sessions', value: stats?.chatSessions ?? 0, icon: MessageSquare, color: 'text-violet-400', bg: 'bg-violet-500/10', href: '/dashboard/chat' },
        { label: 'Escalations', value: stats?.escalations ?? 0, icon: UserCheck, color: 'text-amber-400', bg: 'bg-amber-500/10', href: '/dashboard/escalations' },
    ];

    const quickActions = [
        {
            icon: FileText,
            title: 'Generate Document',
            description: 'Create NDAs, contracts, leases, and employment agreements with AI.',
            href: '/dashboard/documents/new',
            gradient: 'from-primary-600 to-indigo-700',
        },
        {
            icon: ShieldCheck,
            title: 'Review Contract',
            description: 'Upload a contract for AI-powered risk analysis and clause breakdown.',
            href: '/dashboard/reviews/new',
            gradient: 'from-emerald-600 to-teal-700',
        },
        {
            icon: MessageSquare,
            title: 'AI Legal Chat',
            description: 'Ask legal questions in plain English and get instant answers.',
            href: '/dashboard/chat',
            gradient: 'from-violet-600 to-purple-700',
        },
        {
            icon: Search,
            title: 'Legal Research',
            description: 'Search case law, statutes, and regulations with AI-powered vector search.',
            href: '/dashboard/research',
            gradient: 'from-amber-600 to-orange-700',
        },
    ];

    // Combine recent items into a unified feed
    const activityItems = [
        ...recentDocs.map((d) => ({
            id: d.id,
            type: 'document' as const,
            title: d.title,
            subtitle: d.type.replace(/_/g, ' '),
            status: d.status,
            createdAt: d.createdAt,
            href: `/dashboard/documents/${d.id}`,
            icon: FileText,
            iconColor: 'text-primary-400',
            iconBg: 'bg-primary-500/10',
        })),
        ...recentReviews.map((r) => ({
            id: r.id,
            type: 'review' as const,
            title: r.fileName,
            subtitle: r.riskLevel ? `Risk: ${r.riskScore}/100` : 'Pending',
            status: r.status,
            createdAt: r.createdAt,
            href: `/dashboard/reviews/${r.id}`,
            icon: ShieldCheck,
            iconColor: r.riskLevel ? riskColors[r.riskLevel] || 'text-emerald-400' : 'text-surface-400',
            iconBg: 'bg-emerald-500/10',
        })),
        ...recentEscalations.map((e) => ({
            id: e.id,
            type: 'escalation' as const,
            title: e.subject,
            subtitle: `Priority: ${['Low', 'Medium', 'High', 'Urgent'][e.priority] || 'Low'}`,
            status: e.status,
            createdAt: e.createdAt,
            href: `/dashboard/escalations/${e.id}`,
            icon: UserCheck,
            iconColor: e.priority >= 2 ? 'text-orange-400' : 'text-amber-400',
            iconBg: 'bg-amber-500/10',
        })),
    ]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 6);

    return (
        <div className="space-y-8">
            {/* Welcome section */}
            <div>
                <h1 className="text-2xl font-bold text-white sm:text-3xl">
                    Welcome back, {session?.user?.name?.split(' ')[0] || 'there'} 👋
                </h1>
                <p className="mt-1 text-surface-400">
                    Here&apos;s an overview of your legal workspace.
                </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {statCards.map((stat) => (
                    <Link key={stat.label} href={stat.href} className="glass-card rounded-xl p-5 transition-all hover:-translate-y-0.5">
                        <div className="flex items-center justify-between">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
                                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                            </div>
                            {loadingStats ? (
                                <Loader2 className="h-4 w-4 animate-spin text-surface-600" />
                            ) : (
                                <span className="flex items-center gap-1 text-xs text-emerald-400">
                                    <TrendingUp className="h-3 w-3" />
                                    Active
                                </span>
                            )}
                        </div>
                        <p className="mt-3 text-2xl font-bold text-white">
                            {loadingStats ? '...' : stat.value}
                        </p>
                        <p className="text-sm text-surface-400">{stat.label}</p>
                    </Link>
                ))}
            </div>

            {/* Quick actions */}
            <div>
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    {quickActions.map((action) => (
                        <Link
                            key={action.title}
                            href={action.href}
                            className="glass-card group flex items-start gap-4 rounded-xl p-5 transition-all hover:-translate-y-0.5"
                        >
                            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${action.gradient}`}>
                                <action.icon className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-white">{action.title}</h3>
                                    <ArrowUpRight className="h-4 w-4 text-surface-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary-400" />
                                </div>
                                <p className="mt-1 text-sm leading-relaxed text-surface-400">{action.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div>
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
                </div>
                {activityItems.length === 0 ? (
                    <div className="glass-card flex flex-col items-center justify-center rounded-xl py-16 text-center">
                        <Scale className="mb-4 h-12 w-12 text-surface-600" />
                        <h3 className="text-lg font-medium text-surface-300">No activity yet</h3>
                        <p className="mt-1 max-w-sm text-sm text-surface-500">
                            Start by generating a document, reviewing a contract, or chatting with our legal AI assistant.
                        </p>
                        <Link
                            href="/dashboard/documents/new"
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-500"
                        >
                            <FileText className="h-4 w-4" />
                            Create Your First Document
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {activityItems.map((item) => (
                            <Link
                                key={`${item.type}-${item.id}`}
                                href={item.href}
                                className="glass-card group flex items-center gap-4 rounded-xl p-4 transition-all hover:-translate-y-0.5"
                            >
                                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.iconBg}`}>
                                    <item.icon className={`h-5 w-5 ${item.iconColor}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">{item.title}</p>
                                    <p className="text-xs text-surface-500">{item.subtitle}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <span className={`rounded-lg px-2 py-0.5 text-[10px] font-medium ${item.status === 'COMPLETED' ? 'bg-emerald-500/15 text-emerald-400' :
                                        item.status === 'FAILED' ? 'bg-red-500/15 text-red-400' :
                                            'bg-surface-500/15 text-surface-400'
                                        }`}>
                                        {item.status}
                                    </span>
                                    <p className="mt-1 flex items-center justify-end gap-1 text-[10px] text-surface-600">
                                        <Clock className="h-2.5 w-2.5" />
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
