'use client';

import { useState, useEffect } from 'react';
import { Bell, X, Check, AlertTriangle, Info } from 'lucide-react';

interface Notification {
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
}

const ICON_MAP = {
    info: Info,
    success: Check,
    warning: AlertTriangle,
    error: AlertTriangle,
};

const COLOR_MAP = {
    info: 'text-blue-400',
    success: 'text-green-400',
    warning: 'text-amber-400',
    error: 'text-red-400',
};

export default function NotificationCenter() {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: '1',
            type: 'success',
            title: 'Document Generated',
            message: 'Your NDA has been successfully generated and is ready for review.',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            read: false,
        },
        {
            id: '2',
            type: 'info',
            title: 'Welcome to LegalAI',
            message: 'Get started by creating your first document or asking a legal question.',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            read: true,
        },
    ]);

    const unreadCount = notifications.filter((n) => !n.read).length;

    const markAsRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const markAllRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const dismiss = (id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    // Close on escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, []);

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="relative rounded-lg p-2 text-surface-400 transition-colors hover:bg-white/5 hover:text-white"
                aria-label="Notifications"
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setOpen(false)}
                    />
                    <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-white/10 bg-surface-900 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
                            <h3 className="text-sm font-semibold text-white">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllRead}
                                    className="text-xs text-primary-400 hover:text-primary-300"
                                >
                                    Mark all read
                                </button>
                            )}
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <p className="px-4 py-8 text-center text-sm text-surface-500">
                                    No notifications
                                </p>
                            ) : (
                                notifications.map((notification) => {
                                    const Icon = ICON_MAP[notification.type];
                                    return (
                                        <div
                                            key={notification.id}
                                            onClick={() => markAsRead(notification.id)}
                                            className={`flex gap-3 border-b border-white/[3%] px-4 py-3 transition-colors cursor-pointer hover:bg-white/[3%] ${!notification.read ? 'bg-white/[2%]' : ''
                                                }`}
                                        >
                                            <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${COLOR_MAP[notification.type]}`} />
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-start justify-between gap-2">
                                                    <p className="text-xs font-medium text-white">
                                                        {notification.title}
                                                    </p>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            dismiss(notification.id);
                                                        }}
                                                        className="shrink-0 text-surface-600 hover:text-surface-300"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </div>
                                                <p className="mt-0.5 text-[11px] text-surface-400 line-clamp-2">
                                                    {notification.message}
                                                </p>
                                            </div>
                                            {!notification.read && (
                                                <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary-400" />
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
