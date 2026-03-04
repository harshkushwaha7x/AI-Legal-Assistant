'use client';

import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface StatCardProps {
    label: string;
    value: number | string;
    icon: LucideIcon;
    color: string;
    bg: string;
    href: string;
    trend?: { value: number; positive: boolean };
}

export default function StatCard({
    label,
    value,
    icon: Icon,
    color,
    bg,
    href,
    trend,
}: StatCardProps) {
    return (
        <Link
            href={href}
            className="glass-card group flex items-center gap-4 rounded-xl p-5 transition-all hover:-translate-y-1 hover:shadow-lg"
        >
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${bg}`}>
                <Icon className={`h-6 w-6 ${color}`} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-surface-500 uppercase tracking-wider">
                    {label}
                </p>
                <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-white">{value}</p>
                    {trend && (
                        <span
                            className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${trend.positive
                                    ? 'bg-emerald-500/10 text-emerald-400'
                                    : 'bg-red-500/10 text-red-400'
                                }`}
                        >
                            {trend.positive ? '+' : ''}{trend.value}%
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
