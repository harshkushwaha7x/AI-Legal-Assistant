'use client';

import { useState } from 'react';
import {
    BarChart3,
    FileText,
    MessageSquare,
    FileSearch,
    TrendingUp,
    Calendar,
} from 'lucide-react';

interface StatData {
    label: string;
    value: number;
    change: number;
    icon: typeof FileText;
    color: string;
}

const MOCK_STATS: StatData[] = [
    { label: 'Documents', value: 24, change: 12, icon: FileText, color: 'text-blue-400' },
    { label: 'AI Chats', value: 56, change: 23, icon: MessageSquare, color: 'text-green-400' },
    { label: 'Reviews', value: 18, change: 8, icon: FileSearch, color: 'text-amber-400' },
    { label: 'Research', value: 31, change: -5, icon: TrendingUp, color: 'text-purple-400' },
];

type TimeRange = '7d' | '30d' | '90d';

export default function AnalyticsOverview() {
    const [range, setRange] = useState<TimeRange>('30d');

    return (
        <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary-400" />
                    <h3 className="text-sm font-semibold text-white">Analytics Overview</h3>
                </div>
                <div className="flex rounded-lg bg-white/5 p-0.5">
                    {(['7d', '30d', '90d'] as TimeRange[]).map((r) => (
                        <button
                            key={r}
                            onClick={() => setRange(r)}
                            className={`rounded-md px-2.5 py-1 text-[10px] font-medium transition-all ${
                                range === r
                                    ? 'bg-primary-500/20 text-primary-400'
                                    : 'text-surface-500 hover:text-surface-300'
                            }`}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
                {MOCK_STATS.map((stat) => {
                    const Icon = stat.icon;
                    const isPositive = stat.change >= 0;
                    return (
                        <div
                            key={stat.label}
                            className="rounded-xl border border-white/5 bg-white/[2%] p-3"
                        >
                            <div className="flex items-center gap-2">
                                <Icon className={`h-3.5 w-3.5 ${stat.color}`} />
                                <span className="text-[11px] text-surface-500">{stat.label}</span>
                            </div>
                            <div className="mt-2 flex items-end justify-between">
                                <span className="text-xl font-bold text-white">{stat.value}</span>
                                <span
                                    className={`flex items-center gap-0.5 text-[10px] font-medium ${
                                        isPositive ? 'text-green-400' : 'text-red-400'
                                    }`}
                                >
                                    {isPositive ? '+' : ''}{stat.change}%
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 flex items-center gap-1.5 text-[10px] text-surface-600">
                <Calendar className="h-3 w-3" />
                <span>Last updated just now</span>
            </div>
        </div>
    );
}
