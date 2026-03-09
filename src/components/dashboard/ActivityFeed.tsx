'use client';

import { useState, useEffect } from 'react';
import {
    Activity,
    FileText,
    ShieldCheck,
    MessageSquare,
    UserCheck,
    BookOpen,
    Clock,
} from 'lucide-react';

interface ActivityItem {
    id: string;
    action: string;
    entity: string;
    entityId?: string;
    description?: string;
    createdAt: string;
}

const ENTITY_CONFIG: Record<string, { icon: React.ElementType; color: string }> = {
    document: { icon: FileText, color: 'text-primary-400' },
    review: { icon: ShieldCheck, color: 'text-emerald-400' },
    chat: { icon: MessageSquare, color: 'text-violet-400' },
    escalation: { icon: UserCheck, color: 'text-amber-400' },
    research: { icon: BookOpen, color: 'text-cyan-400' },
};

function timeAgo(date: string): string {
    const now = new Date();
    const d = new Date(date);
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    if (diffDay < 7) return `${diffDay}d ago`;
    return d.toLocaleDateString();
}

export default function ActivityFeed() {
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const res = await fetch('/api/activity?limit=20');
                if (res.ok) {
                    const data = await res.json();
                    setActivities(data.activities || []);
                }
            } catch {
                console.error('Failed to fetch activities');
            } finally {
                setLoading(false);
            }
        };
        fetchActivities();
    }, []);

    if (loading) {
        return (
            <div className="glass-card rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-white mb-4">Recent Activity</h3>
                <div className="animate-pulse space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-white/5" />
                            <div className="flex-1 space-y-1">
                                <div className="h-3 w-3/4 rounded bg-white/5" />
                                <div className="h-2 w-1/2 rounded bg-white/5" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
                <Activity className="h-4 w-4 text-primary-400" />
                <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
            </div>

            {activities.length === 0 ? (
                <div className="py-6 text-center">
                    <Clock className="mx-auto h-8 w-8 text-surface-600" />
                    <p className="mt-2 text-xs text-surface-500">No activity yet</p>
                </div>
            ) : (
                <div className="space-y-1">
                    {activities.map((activity) => {
                        const config = ENTITY_CONFIG[activity.entity] || { icon: Activity, color: 'text-surface-400' };
                        const Icon = config.icon;

                        return (
                            <div
                                key={activity.id}
                                className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/3"
                            >
                                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5">
                                    <Icon className={`h-3.5 w-3.5 ${config.color}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-surface-300">
                                        <span className="font-medium text-white">{activity.action}</span>
                                        {activity.description && ` — ${activity.description}`}
                                    </p>
                                    <p className="text-[10px] text-surface-600">{timeAgo(activity.createdAt)}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
