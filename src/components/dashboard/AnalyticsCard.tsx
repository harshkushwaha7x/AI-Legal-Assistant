'use client';

import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface Metric {
    label: string;
    value: string | number;
    change?: number;
    icon: LucideIcon;
    color: string;
}

interface AnalyticsCardProps {
    title: string;
    metrics: Metric[];
    period?: string;
}

export default function AnalyticsCard({
    title,
    metrics,
    period = 'Last 30 days',
}: AnalyticsCardProps) {
    return (
        <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">{title}</h3>
                <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-surface-500">
                    {period}
                </span>
            </div>

            <div className="space-y-3">
                {metrics.map((metric, i) => {
                    const TrendIcon =
                        metric.change === undefined
                            ? Minus
                            : metric.change > 0
                                ? TrendingUp
                                : metric.change < 0
                                    ? TrendingDown
                                    : Minus;

                    const trendColor =
                        metric.change === undefined
                            ? 'text-surface-500'
                            : metric.change > 0
                                ? 'text-emerald-400'
                                : metric.change < 0
                                    ? 'text-red-400'
                                    : 'text-surface-500';

                    return (
                        <div key={i} className="flex items-center gap-3">
                            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5`}>
                                <metric.icon className={`h-4 w-4 ${metric.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-surface-500">{metric.label}</p>
                                <p className="text-sm font-bold text-white">{metric.value}</p>
                            </div>
                            {metric.change !== undefined && (
                                <div className={`flex items-center gap-0.5 text-[11px] font-medium ${trendColor}`}>
                                    <TrendIcon className="h-3 w-3" />
                                    {Math.abs(metric.change)}%
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
