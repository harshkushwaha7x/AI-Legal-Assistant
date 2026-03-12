'use client';

import Link from 'next/link';
import {
    FileText,
    MessageSquare,
    FileSearch,
    BookOpen,
    ArrowRight
} from 'lucide-react';

const ACTIONS = [
    {
        label: 'New Document',
        description: 'Generate a legal document with AI',
        href: '/dashboard/documents',
        icon: FileText,
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
    },
    {
        label: 'AI Chat',
        description: 'Ask a legal question',
        href: '/dashboard/chat',
        icon: MessageSquare,
        color: 'text-green-400',
        bg: 'bg-green-500/10',
    },
    {
        label: 'Review Contract',
        description: 'Analyze a contract for risks',
        href: '/dashboard/review',
        icon: FileSearch,
        color: 'text-amber-400',
        bg: 'bg-amber-500/10',
    },
    {
        label: 'Research',
        description: 'Search legal databases',
        href: '/dashboard/research',
        icon: BookOpen,
        color: 'text-purple-400',
        bg: 'bg-purple-500/10',
    },
];

export default function QuickActions() {
    return (
        <div className="glass-card rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white">Quick Actions</h3>
            <div className="mt-4 grid grid-cols-2 gap-2">
                {ACTIONS.map((action) => (
                    <Link
                        key={action.label}
                        href={action.href}
                        className="group flex flex-col gap-2 rounded-xl border border-white/5 bg-white/[0.02] p-3 transition-all hover:border-primary-500/20 hover:bg-white/5"
                    >
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${action.bg}`}>
                            <action.icon className={`h-4 w-4 ${action.color}`} />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-white">{action.label}</p>
                            <p className="text-[10px] text-surface-500">{action.description}</p>
                        </div>
                        <ArrowRight className="h-3 w-3 self-end text-surface-600 transition-transform group-hover:translate-x-1 group-hover:text-primary-400" />
                    </Link>
                ))}
            </div>
        </div>
    );
}
