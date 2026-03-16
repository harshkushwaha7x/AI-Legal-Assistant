'use client';

import { useState, useEffect, useMemo } from 'react';
import { Calendar, FileText, MessageSquare, Scale, ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';

interface TimelineEvent {
    id: string;
    type: 'document' | 'chat' | 'review' | 'escalation';
    title: string;
    description: string;
    timestamp: string;
}

const TYPE_CONFIG = {
    document: { icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10', label: 'Document' },
    chat: { icon: MessageSquare, color: 'text-green-400', bg: 'bg-green-500/10', label: 'Chat' },
    review: { icon: Scale, color: 'text-amber-400', bg: 'bg-amber-500/10', label: 'Review' },
    escalation: { icon: ArrowRight, color: 'text-red-400', bg: 'bg-red-500/10', label: 'Escalation' },
};

const MOCK_EVENTS: TimelineEvent[] = [
    { id: '1', type: 'document', title: 'Created NDA Draft', description: 'Non-Disclosure Agreement for Project Alpha', timestamp: new Date(Date.now() - 3600 * 1000).toISOString() },
    { id: '2', type: 'chat', title: 'Legal Question', description: 'Asked about tenant rights and security deposits', timestamp: new Date(Date.now() - 7200 * 1000).toISOString() },
    { id: '3', type: 'review', title: 'Contract Reviewed', description: 'Freelance Service Agreement - Medium Risk', timestamp: new Date(Date.now() - 86400 * 1000).toISOString() },
    { id: '4', type: 'document', title: 'Employment Contract', description: 'Generated employment agreement template', timestamp: new Date(Date.now() - 172800 * 1000).toISOString() },
    { id: '5', type: 'escalation', title: 'Escalated to Lawyer', description: 'Lease dispute requires professional review', timestamp: new Date(Date.now() - 259200 * 1000).toISOString() },
];

function formatTimeAgo(timestamp: string): string {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}

export default function ActivityTimeline() {
    const [events] = useState<TimelineEvent[]>(MOCK_EVENTS);
    const [filter, setFilter] = useState<string | null>(null);

    const filteredEvents = useMemo(
        () => (filter ? events.filter((e) => e.type === filter) : events),
        [events, filter]
    );

    return (
        <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary-400" />
                    <h3 className="text-sm font-semibold text-white">Activity Timeline</h3>
                </div>
                <Link
                    href="/dashboard"
                    className="text-[10px] text-surface-500 hover:text-primary-400 transition-colors"
                >
                    View all
                </Link>
            </div>

            {/* Type filter */}
            <div className="flex gap-1 mb-4">
                <button
                    onClick={() => setFilter(null)}
                    className={`rounded-md px-2 py-0.5 text-[10px] font-medium transition-colors ${
                        !filter ? 'bg-primary-500/20 text-primary-400' : 'text-surface-500 hover:text-surface-300'
                    }`}
                >
                    All
                </button>
                {Object.entries(TYPE_CONFIG).map(([key, config]) => (
                    <button
                        key={key}
                        onClick={() => setFilter(filter === key ? null : key)}
                        className={`rounded-md px-2 py-0.5 text-[10px] font-medium transition-colors ${
                            filter === key ? 'bg-primary-500/20 text-primary-400' : 'text-surface-500 hover:text-surface-300'
                        }`}
                    >
                        {config.label}
                    </button>
                ))}
            </div>

            {/* Timeline */}
            <div className="space-y-0">
                {filteredEvents.map((event, index) => {
                    const config = TYPE_CONFIG[event.type];
                    const Icon = config.icon;
                    const isLast = index === filteredEvents.length - 1;

                    return (
                        <div key={event.id} className="relative flex gap-3 pb-4">
                            {!isLast && (
                                <div className="absolute left-[13px] top-7 h-full w-px bg-white/5" />
                            )}
                            <div className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${config.bg}`}>
                                <Icon className={`h-3.5 w-3.5 ${config.color}`} />
                            </div>
                            <div className="min-w-0 flex-1 pt-0.5">
                                <p className="text-xs font-medium text-white">{event.title}</p>
                                <p className="mt-0.5 text-[10px] text-surface-500 truncate">{event.description}</p>
                                <div className="mt-1 flex items-center gap-1 text-[9px] text-surface-600">
                                    <Clock className="h-2.5 w-2.5" />
                                    {formatTimeAgo(event.timestamp)}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredEvents.length === 0 && (
                <p className="py-4 text-center text-xs text-surface-600">No activity to show.</p>
            )}
        </div>
    );
}
