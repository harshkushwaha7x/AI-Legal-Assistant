'use client';

import { useState } from 'react';
import { X, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
    variant?: AlertVariant;
    title: string;
    message?: string;
    dismissible?: boolean;
    action?: {
        label: string;
        onClick: () => void;
    };
}

const VARIANTS = {
    info: {
        icon: Info,
        border: 'border-blue-500/20',
        bg: 'bg-blue-500/5',
        iconColor: 'text-blue-400',
        titleColor: 'text-blue-300',
    },
    success: {
        icon: CheckCircle,
        border: 'border-green-500/20',
        bg: 'bg-green-500/5',
        iconColor: 'text-green-400',
        titleColor: 'text-green-300',
    },
    warning: {
        icon: AlertTriangle,
        border: 'border-amber-500/20',
        bg: 'bg-amber-500/5',
        iconColor: 'text-amber-400',
        titleColor: 'text-amber-300',
    },
    error: {
        icon: XCircle,
        border: 'border-red-500/20',
        bg: 'bg-red-500/5',
        iconColor: 'text-red-400',
        titleColor: 'text-red-300',
    },
};

export default function Alert({
    variant = 'info',
    title,
    message,
    dismissible = false,
    action,
}: AlertProps) {
    const [visible, setVisible] = useState(true);
    if (!visible) return null;

    const config = VARIANTS[variant];
    const Icon = config.icon;

    return (
        <div
            className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${config.border} ${config.bg}`}
            role="alert"
        >
            <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${config.iconColor}`} />
            <div className="min-w-0 flex-1">
                <p className={`text-sm font-medium ${config.titleColor}`}>{title}</p>
                {message && (
                    <p className="mt-0.5 text-xs text-surface-400">{message}</p>
                )}
                {action && (
                    <button
                        onClick={action.onClick}
                        className={`mt-2 text-xs font-medium underline underline-offset-2 ${config.iconColor} hover:opacity-80`}
                    >
                        {action.label}
                    </button>
                )}
            </div>
            {dismissible && (
                <button
                    onClick={() => setVisible(false)}
                    className="shrink-0 text-surface-600 transition-colors hover:text-surface-300"
                    aria-label="Dismiss"
                >
                    <X className="h-3.5 w-3.5" />
                </button>
            )}
        </div>
    );
}
