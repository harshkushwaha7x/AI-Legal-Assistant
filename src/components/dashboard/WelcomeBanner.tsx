'use client';

import { useSession } from 'next-auth/react';
import { Sparkles, FileText, ShieldCheck, MessageSquare, BookOpen } from 'lucide-react';
import Link from 'next/link';

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
}

const QUICK_ACTIONS = [
    { icon: FileText, label: 'New Document', href: '/dashboard/documents/new', color: 'text-primary-400' },
    { icon: ShieldCheck, label: 'Review Contract', href: '/dashboard/reviews/new', color: 'text-emerald-400' },
    { icon: MessageSquare, label: 'AI Chat', href: '/dashboard/chat', color: 'text-violet-400' },
    { icon: BookOpen, label: 'Research', href: '/dashboard/research', color: 'text-amber-400' },
];

export default function WelcomeBanner() {
    const { data: session } = useSession();
    const firstName = session?.user?.name?.split(' ')[0] || 'there';

    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-900/40 via-surface-900 to-indigo-900/30 p-6 ring-1 ring-white/5">
            {/* Background decoration */}
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-primary-600/10 blur-3xl" />
            <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-indigo-600/10 blur-3xl" />

            <div className="relative">
                <div className="flex items-center gap-2 text-primary-300">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">LegalAI Dashboard</span>
                </div>

                <h1 className="mt-2 text-2xl font-bold text-white">
                    {getGreeting()}, {firstName}!
                </h1>
                <p className="mt-1 text-sm text-surface-400">
                    What would you like to work on today?
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                    {QUICK_ACTIONS.map((action) => (
                        <Link
                            key={action.href}
                            href={action.href}
                            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-surface-300 transition-all hover:bg-white/10 hover:text-white"
                        >
                            <action.icon className={`h-4 w-4 ${action.color}`} />
                            {action.label}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
