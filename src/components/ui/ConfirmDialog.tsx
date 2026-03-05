'use client';

import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'warning' | 'default';
    loading?: boolean;
}

export default function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'default',
    loading = false,
}: ConfirmDialogProps) {
    const btnStyles = {
        danger: 'bg-red-600 hover:bg-red-500 text-white',
        warning: 'bg-amber-600 hover:bg-amber-500 text-white',
        default: 'bg-primary-600 hover:bg-primary-500 text-white',
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-sm">
            <div className="text-center">
                {variant === 'danger' && (
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                        <AlertTriangle className="h-6 w-6 text-red-400" />
                    </div>
                )}
                <p className="text-sm text-surface-300">{message}</p>
                <div className="mt-6 flex items-center justify-center gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-surface-300 transition-all hover:bg-white/5"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all disabled:opacity-50 ${btnStyles[variant]}`}
                    >
                        {loading ? 'Processing...' : confirmLabel}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
