'use client';

import { AlertTriangle, Flag } from 'lucide-react';

interface PriorityBadgeProps {
    priority: number;
    size?: 'sm' | 'md';
}

const config: Record<number, { label: string; color: string; bg: string }> = {
    0: { label: 'Low', color: 'text-surface-400', bg: 'bg-surface-500/15' },
    1: { label: 'Medium', color: 'text-amber-400', bg: 'bg-amber-500/15' },
    2: { label: 'High', color: 'text-orange-400', bg: 'bg-orange-500/15' },
    3: { label: 'Urgent', color: 'text-red-400', bg: 'bg-red-500/15' },
};

export default function PriorityBadge({ priority, size = 'sm' }: PriorityBadgeProps) {
    const cfg = config[priority] || config[0];
    const isSmall = size === 'sm';

    return (
        <span
            className={`inline-flex items-center gap-1 rounded-lg font-medium ${cfg.bg} ${cfg.color} ${isSmall ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
                }`}
        >
            {priority >= 2 ? (
                <AlertTriangle className={isSmall ? 'h-2.5 w-2.5' : 'h-3 w-3'} />
            ) : (
                <Flag className={isSmall ? 'h-2.5 w-2.5' : 'h-3 w-3'} />
            )}
            {cfg.label}
        </span>
    );
}
