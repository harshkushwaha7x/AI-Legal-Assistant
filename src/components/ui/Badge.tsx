'use client';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
    size?: 'sm' | 'md';
}

const VARIANTS = {
    default: 'bg-surface-700/50 text-surface-300',
    success: 'bg-emerald-500/15 text-emerald-400',
    warning: 'bg-amber-500/15 text-amber-400',
    danger: 'bg-red-500/15 text-red-400',
    info: 'bg-primary-500/15 text-primary-400',
    outline: 'border border-white/10 text-surface-400',
};

const SIZES = {
    sm: 'px-1.5 py-0.5 text-[10px]',
    md: 'px-2 py-1 text-xs',
};

export default function Badge({
    children,
    variant = 'default',
    size = 'md',
}: BadgeProps) {
    return (
        <span className={`inline-flex items-center gap-1 rounded-md font-medium ${VARIANTS[variant]} ${SIZES[size]}`}>
            {children}
        </span>
    );
}
