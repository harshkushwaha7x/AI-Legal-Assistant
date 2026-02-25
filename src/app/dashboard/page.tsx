'use client';

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
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
    const { data: session, status } = useSession();

    if (status === 'loading') {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
            </div>
        );
    }

    const stats = [
        { label: 'Documents', value: '0', change: '+0%', icon: FileText, color: 'text-primary-400', bg: 'bg-primary-500/10' },
        { label: 'Reviews', value: '0', change: '+0%', icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { label: 'Chat Sessions', value: '0', change: '+0%', icon: MessageSquare, color: 'text-violet-400', bg: 'bg-violet-500/10' },
        { label: 'Research Queries', value: '0', change: '+0%', icon: Search, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    ];

    const quickActions = [
        {
            icon: FileText,
            title: 'Generate Document',
            description: 'Create NDAs, contracts, leases, and employment agreements with AI.',
            href: '/dashboard/documents',
            gradient: 'from-primary-600 to-indigo-700',
        },
        {
            icon: ShieldCheck,
            title: 'Review Contract',
            description: 'Upload a contract for AI-powered risk analysis and clause breakdown.',
            href: '/dashboard/reviews',
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
                {stats.map((stat) => (
                    <div key={stat.label} className="glass-card rounded-xl p-5">
                        <div className="flex items-center justify-between">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
                                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                            </div>
                            <span className="flex items-center gap-1 text-xs text-emerald-400">
                                <TrendingUp className="h-3 w-3" />
                                {stat.change}
                            </span>
                        </div>
                        <p className="mt-3 text-2xl font-bold text-white">{stat.value}</p>
                        <p className="text-sm text-surface-400">{stat.label}</p>
                    </div>
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

            {/* Recent activity */}
            <div>
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
                    <button className="flex items-center gap-1.5 text-sm text-primary-400 transition-colors hover:text-primary-300">
                        <Clock className="h-3.5 w-3.5" />
                        View all
                    </button>
                </div>
                <div className="glass-card flex flex-col items-center justify-center rounded-xl py-16 text-center">
                    <Scale className="mb-4 h-12 w-12 text-surface-600" />
                    <h3 className="text-lg font-medium text-surface-300">No activity yet</h3>
                    <p className="mt-1 max-w-sm text-sm text-surface-500">
                        Start by generating a document, reviewing a contract, or chatting with our legal AI assistant.
                    </p>
                    <Link
                        href="/dashboard/documents"
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-500"
                    >
                        <FileText className="h-4 w-4" />
                        Create Your First Document
                    </Link>
                </div>
            </div>
        </div>
    );
}
