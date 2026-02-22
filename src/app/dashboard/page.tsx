'use client';

import { useSession, signOut } from 'next-auth/react';
import { Scale, LogOut, Loader2, FileText, ShieldCheck, MessageSquare, Search } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
    const { data: session, status } = useSession();

    if (status === 'loading') {
        return (
            <div className="flex min-h-screen items-center justify-center pt-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
            </div>
        );
    }

    const quickActions = [
        { icon: FileText, title: 'Generate Document', description: 'Create NDAs, contracts, leases', href: '/dashboard/documents', color: 'from-primary-600 to-primary-700' },
        { icon: ShieldCheck, title: 'Review Contract', description: 'AI-powered risk analysis', href: '/dashboard/reviews', color: 'from-emerald-600 to-emerald-700' },
        { icon: MessageSquare, title: 'Legal AI Chat', description: 'Ask legal questions', href: '/dashboard/chat', color: 'from-violet-600 to-violet-700' },
        { icon: Search, title: 'Legal Research', description: 'Search legal knowledge', href: '/dashboard/research', color: 'from-amber-600 to-amber-700' },
    ];

    return (
        <div className="relative min-h-screen px-4 pb-20 pt-24 sm:px-6 lg:px-8">
            {/* Background */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-primary-600/6 blur-[128px]" />
            </div>

            <div className="relative mx-auto max-w-6xl">
                {/* Welcome header */}
                <div className="mb-10 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white">
                            Welcome back, {session?.user?.name?.split(' ')[0] || 'there'}
                        </h1>
                        <p className="mt-1 text-surface-400">
                            {session?.user?.email} • {session?.user?.subscription || 'Free'} Plan
                        </p>
                    </div>
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-surface-300 transition-all hover:bg-white/10 hover:text-white"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </button>
                </div>

                {/* Stats cards */}
                <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
                    {[
                        { label: 'Documents', value: '0' },
                        { label: 'Reviews', value: '0' },
                        { label: 'Chat Sessions', value: '0' },
                        { label: 'Escalations', value: '0' },
                    ].map((stat) => (
                        <div key={stat.label} className="glass-card rounded-xl p-5">
                            <p className="text-sm text-surface-400">{stat.label}</p>
                            <p className="mt-1 text-2xl font-bold text-white">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Quick actions */}
                <h2 className="mb-4 text-lg font-semibold text-white">Quick Actions</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {quickActions.map((action) => (
                        <Link
                            key={action.title}
                            href={action.href}
                            className="glass-card group rounded-xl p-6 transition-all hover:-translate-y-1"
                        >
                            <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${action.color}`}>
                                <action.icon className="h-5 w-5 text-white" />
                            </div>
                            <h3 className="font-semibold text-white">{action.title}</h3>
                            <p className="mt-1 text-sm text-surface-400">{action.description}</p>
                        </Link>
                    ))}
                </div>

                {/* Recent activity placeholder */}
                <div className="mt-10">
                    <h2 className="mb-4 text-lg font-semibold text-white">Recent Activity</h2>
                    <div className="glass-card flex flex-col items-center justify-center rounded-xl py-16 text-center">
                        <Scale className="mb-4 h-12 w-12 text-surface-600" />
                        <h3 className="text-lg font-medium text-surface-300">No activity yet</h3>
                        <p className="mt-1 max-w-sm text-sm text-surface-500">
                            Start by generating a document, reviewing a contract, or chatting with our legal AI.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
