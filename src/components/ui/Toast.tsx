'use client';

import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    type: ToastType;
    message: string;
}

interface ToastContainerProps {
    toasts: Toast[];
    onRemove: (id: string) => void;
}

const ICONS = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
};

const STYLES = {
    success: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
    error: 'border-red-500/20 bg-red-500/10 text-red-300',
    warning: 'border-amber-500/20 bg-amber-500/10 text-amber-300',
    info: 'border-primary-500/20 bg-primary-500/10 text-primary-300',
};

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            {toasts.map((toast) => {
                const Icon = ICONS[toast.type];
                return (
                    <div
                        key={toast.id}
                        className={`flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm animate-slide-in ${STYLES[toast.type]}`}
                    >
                        <Icon className="h-4 w-4 shrink-0" />
                        <p className="text-sm font-medium">{toast.message}</p>
                        <button
                            onClick={() => onRemove(toast.id)}
                            className="ml-2 rounded-lg p-0.5 opacity-60 transition-opacity hover:opacity-100"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    </div>
                );
            })}
        </div>
    );
}

export function useToast() {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((type: ToastType, message: string) => {
        const id = Date.now().toString() + Math.random().toString(36).slice(2);
        setToasts((prev) => [...prev, { id, type, message }]);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    // Auto-remove toasts after 4 seconds
    useEffect(() => {
        if (toasts.length === 0) return;
        const timer = setTimeout(() => {
            setToasts((prev) => prev.slice(1));
        }, 4000);
        return () => clearTimeout(timer);
    }, [toasts]);

    return { toasts, addToast, removeToast };
}
