'use client';

import { useState, useEffect } from 'react';
import { Gauge, TrendingUp, AlertTriangle } from 'lucide-react';

interface UsageData {
    label: string;
    used: number;
    limit: number;
    unit: string;
}

const DEFAULT_USAGE: UsageData[] = [
    { label: 'Documents This Month', used: 3, limit: 5, unit: 'documents' },
    { label: 'AI Queries Today', used: 7, limit: 10, unit: 'queries' },
    { label: 'Contract Reviews', used: 2, limit: 5, unit: 'reviews' },
];

function getBarColor(ratio: number): string {
    if (ratio >= 0.9) return 'bg-red-500';
    if (ratio >= 0.7) return 'bg-amber-500';
    return 'bg-primary-500';
}

function getTextColor(ratio: number): string {
    if (ratio >= 0.9) return 'text-red-400';
    if (ratio >= 0.7) return 'text-amber-400';
    return 'text-primary-400';
}

export default function UsageTracker() {
    const [usage, setUsage] = useState<UsageData[]>(DEFAULT_USAGE);

    useEffect(() => {
        async function fetchUsage() {
            try {
                const res = await fetch('/api/stats?range=30d');
                if (res.ok) {
                    const data = await res.json();
                    if (data.overview) {
                        setUsage([
                            { label: 'Documents This Month', used: data.period?.documentsCreated || 0, limit: 5, unit: 'documents' },
                            { label: 'AI Queries Today', used: 0, limit: 10, unit: 'queries' },
                            { label: 'Contract Reviews', used: data.period?.reviewsCompleted || 0, limit: 5, unit: 'reviews' },
                        ]);
                    }
                }
            } catch {
                // Use default data
            }
        }
        fetchUsage();
    }, []);

    const anyNearLimit = usage.some((u) => u.limit > 0 && u.used / u.limit >= 0.8);

    return (
        <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-primary-400" />
                    <h3 className="text-sm font-semibold text-white">Usage</h3>
                </div>
                <span className="rounded-md bg-surface-800 px-2 py-0.5 text-[10px] font-medium text-surface-400">
                    Free Plan
                </span>
            </div>

            <div className="mt-4 space-y-4">
                {usage.map((item) => {
                    const ratio = item.limit > 0 ? item.used / item.limit : 0;
                    const percentage = Math.min(ratio * 100, 100);
                    return (
                        <div key={item.label}>
                            <div className="flex items-center justify-between text-[11px]">
                                <span className="text-surface-400">{item.label}</span>
                                <span className={getTextColor(ratio)}>
                                    {item.used} / {item.limit < 0 ? 'Unlimited' : item.limit}
                                </span>
                            </div>
                            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${getBarColor(ratio)}`}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {anyNearLimit && (
                <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2">
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
                    <div>
                        <p className="text-[11px] font-medium text-amber-300">Approaching limits</p>
                        <p className="text-[10px] text-surface-500">
                            Upgrade to Pro for higher limits and more features.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
