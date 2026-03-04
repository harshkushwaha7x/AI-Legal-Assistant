'use client';

import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    actionHref?: string;
    actionIcon?: LucideIcon;
}

export default function EmptyState({
    icon: Icon,
    title,
    description,
    actionLabel,
    actionHref,
    actionIcon: ActionIcon,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                <Icon className="h-7 w-7 text-surface-500" />
            </div>
            <h3 className="text-lg font-semibold text-surface-300">{title}</h3>
            <p className="mt-1 max-w-sm text-sm text-surface-500">{description}</p>
            {actionLabel && actionHref && (
                <Link
                    href={actionHref}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition-all hover:bg-primary-500"
                >
                    {ActionIcon && <ActionIcon className="h-4 w-4" />}
                    {actionLabel}
                </Link>
            )}
        </div>
    );
}
