'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    CheckCircle,
    Circle,
    FileText,
    ShieldCheck,
    MessageSquare,
    BookOpen,
    X,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';

interface ChecklistItem {
    id: string;
    label: string;
    description: string;
    href: string;
    icon: React.ElementType;
    color: string;
}

const CHECKLIST: ChecklistItem[] = [
    {
        id: 'create-document',
        label: 'Create your first document',
        description: 'Generate an NDA, contract, or lease with AI',
        href: '/dashboard/documents/new',
        icon: FileText,
        color: 'text-primary-400',
    },
    {
        id: 'review-contract',
        label: 'Review a contract',
        description: 'Upload a contract for AI risk analysis',
        href: '/dashboard/reviews/new',
        icon: ShieldCheck,
        color: 'text-emerald-400',
    },
    {
        id: 'try-chat',
        label: 'Try AI Legal Chat',
        description: 'Ask a legal question in plain English',
        href: '/dashboard/chat',
        icon: MessageSquare,
        color: 'text-violet-400',
    },
    {
        id: 'explore-research',
        label: 'Explore Legal Research',
        description: 'Search statutes and case law',
        href: '/dashboard/research',
        icon: BookOpen,
        color: 'text-amber-400',
    },
];

export default function OnboardingChecklist() {
    const [dismissed, setDismissed] = useState(false);
    const [expanded, setExpanded] = useState(true);
    const [completed, setCompleted] = useState<Set<string>>(new Set());

    if (dismissed) return null;

    const progress = Math.round((completed.size / CHECKLIST.length) * 100);

    const toggleItem = (id: string) => {
        setCompleted((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    return (
        <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h3 className="text-sm font-semibold text-white">Getting Started</h3>
                    <span className="rounded-md bg-primary-500/15 px-2 py-0.5 text-[10px] font-semibold text-primary-400">
                        {completed.size}/{CHECKLIST.length}
                    </span>
                </div>
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="rounded-lg p-1 text-surface-500 transition-colors hover:bg-white/5 hover:text-white"
                    >
                        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                    <button
                        onClick={() => setDismissed(true)}
                        className="rounded-lg p-1 text-surface-500 transition-colors hover:bg-white/5 hover:text-white"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Progress bar */}
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                <div
                    className="h-full rounded-full bg-primary-500 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {expanded && (
                <div className="mt-4 space-y-2">
                    {CHECKLIST.map((item) => {
                        const done = completed.has(item.id);
                        return (
                            <div
                                key={item.id}
                                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all ${done ? 'bg-white/3 opacity-60' : 'hover:bg-white/5'
                                    }`}
                            >
                                <button
                                    onClick={() => toggleItem(item.id)}
                                    className="shrink-0"
                                >
                                    {done ? (
                                        <CheckCircle className="h-5 w-5 text-emerald-400" />
                                    ) : (
                                        <Circle className="h-5 w-5 text-surface-600" />
                                    )}
                                </button>
                                <Link href={item.href} className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium ${done ? 'text-surface-500 line-through' : 'text-white'}`}>
                                        {item.label}
                                    </p>
                                    <p className="text-[11px] text-surface-500 truncate">{item.description}</p>
                                </Link>
                                <item.icon className={`h-4 w-4 shrink-0 ${done ? 'text-surface-600' : item.color}`} />
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
