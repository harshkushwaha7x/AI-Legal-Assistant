'use client';

interface ProgressBarProps {
    value: number;
    max?: number;
    label?: string;
    showValue?: boolean;
    size?: 'sm' | 'md' | 'lg';
    color?: 'primary' | 'success' | 'warning' | 'danger';
}

const COLORS = {
    primary: 'bg-primary-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
};

const BG_COLORS = {
    primary: 'bg-primary-500/20',
    success: 'bg-emerald-500/20',
    warning: 'bg-amber-500/20',
    danger: 'bg-red-500/20',
};

const SIZES = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
};

export default function ProgressBar({
    value,
    max = 100,
    label,
    showValue = false,
    size = 'md',
    color = 'primary',
}: ProgressBarProps) {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    return (
        <div className="w-full">
            {(label || showValue) && (
                <div className="mb-1.5 flex items-center justify-between text-xs">
                    {label && <span className="font-medium text-surface-300">{label}</span>}
                    {showValue && <span className="text-surface-500">{Math.round(percentage)}%</span>}
                </div>
            )}
            <div className={`w-full overflow-hidden rounded-full ${BG_COLORS[color]} ${SIZES[size]}`}>
                <div
                    className={`${SIZES[size]} rounded-full transition-all duration-500 ease-out ${COLORS[color]}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
