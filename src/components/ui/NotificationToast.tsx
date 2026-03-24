'use client';

import { useState, useEffect } from 'react';
import { Bell, BellOff, X, Trash2 } from 'lucide-react';
import type { NotificationPayload } from '@/lib/notification-builder';

interface NotificationToastProps {
    notifications: (NotificationPayload & { id: string; readAt?: string })[];
    onDismiss: (id: string) => void;
    onDismissAll: () => void;
    maxVisible?: number;
}

const PRIORITY_STYLES = {
    low: { border: 'border-surface-700', icon: 'text-surface-500' },
    medium: { border: 'border-blue-500/30', icon: 'text-blue-400' },
    high: { border: 'border-red-500/30', icon: 'text-red-400' },
};

export default function NotificationToast({
    notifications,
    onDismiss,
    onDismissAll,
    maxVisible = 5,
}: NotificationToastProps) {
    const [visible, setVisible] = useState(true);

    const unread = notifications.filter((n) => !n.readAt);
    const displayed = unread.slice(0, maxVisible);

    if (!visible || displayed.length === 0) {
        return unread.length > 0 ? (
            <button
                onClick={() => setVisible(true)}
                className="fixed bottom-4 right-4 z-[90] flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2 text-xs text-white shadow-xl hover:bg-primary-500 transition-colors"
            >
                <Bell className="h-3.5 w-3.5" />
                {unread.length} new
            </button>
        ) : null;
    }

    return (
        <div className="fixed bottom-4 right-4 z-[90] flex w-80 flex-col gap-2">
            {/* Header */}
            <div className="flex items-center justify-between rounded-t-lg bg-surface-900/90 px-3 py-1.5 backdrop-blur-xl">
                <span className="text-[10px] font-medium text-surface-400">
                    {unread.length} notification{unread.length !== 1 ? 's' : ''}
                </span>
                <div className="flex items-center gap-1">
                    <button
                        onClick={onDismissAll}
                        className="rounded p-1 text-surface-600 hover:bg-white/5 hover:text-surface-300 transition-colors"
                        aria-label="Clear all"
                    >
                        <Trash2 className="h-3 w-3" />
                    </button>
                    <button
                        onClick={() => setVisible(false)}
                        className="rounded p-1 text-surface-600 hover:bg-white/5 hover:text-surface-300 transition-colors"
                        aria-label="Hide notifications"
                    >
                        <BellOff className="h-3 w-3" />
                    </button>
                </div>
            </div>

            {/* Toast items */}
            {displayed.map((notification) => {
                const style = PRIORITY_STYLES[notification.priority];
                return (
                    <div
                        key={notification.id}
                        className={`rounded-lg border ${style.border} bg-surface-900/90 px-3 py-2.5 shadow-xl backdrop-blur-xl animate-slide-up`}
                    >
                        <div className="flex items-start gap-2">
                            <Bell className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${style.icon}`} />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-white">
                                    {notification.title}
                                </p>
                                <p className="mt-0.5 text-[10px] text-surface-500 line-clamp-2">
                                    {notification.message}
                                </p>
                                {notification.actionUrl && notification.actionLabel && (
                                    <a
                                        href={notification.actionUrl}
                                        className="mt-1 inline-block text-[10px] font-medium text-primary-400 hover:text-primary-300"
                                    >
                                        {notification.actionLabel}
                                    </a>
                                )}
                            </div>
                            <button
                                onClick={() => onDismiss(notification.id)}
                                className="shrink-0 rounded p-0.5 text-surface-700 hover:text-surface-400 transition-colors"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    </div>
                );
            })}

            {unread.length > maxVisible && (
                <p className="text-center text-[9px] text-surface-600">
                    +{unread.length - maxVisible} more
                </p>
            )}
        </div>
    );
}
