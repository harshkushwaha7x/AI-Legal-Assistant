'use client';

import { useState, useEffect } from 'react';
import { X, Command } from 'lucide-react';
import Modal from './Modal';

const SHORTCUTS = [
    {
        category: 'Navigation', items: [
            { keys: ['Ctrl', 'K'], description: 'Open command palette' },
            { keys: ['Esc'], description: 'Close dialogs and menus' },
        ]
    },
    {
        category: 'Chat', items: [
            { keys: ['Enter'], description: 'Send message' },
            { keys: ['Shift', 'Enter'], description: 'New line in message' },
        ]
    },
    {
        category: 'General', items: [
            { keys: ['?'], description: 'Show keyboard shortcuts' },
            { keys: ['Tab'], description: 'Navigate between fields' },
            { keys: ['Ctrl', 'S'], description: 'Save (in forms)' },
        ]
    },
];

export default function KeyboardShortcuts() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);

            if (e.key === '?' && !isInput && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                setIsOpen(true);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Keyboard Shortcuts" maxWidth="max-w-md">
            <div className="space-y-5">
                {SHORTCUTS.map((group) => (
                    <div key={group.category}>
                        <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-surface-500">
                            {group.category}
                        </h4>
                        <div className="space-y-2">
                            {group.items.map((shortcut, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className="text-sm text-surface-300">{shortcut.description}</span>
                                    <div className="flex items-center gap-1">
                                        {shortcut.keys.map((key, j) => (
                                            <span key={j}>
                                                {j > 0 && <span className="mx-0.5 text-[10px] text-surface-600">+</span>}
                                                <kbd className="inline-flex min-w-[24px] items-center justify-center rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[11px] font-medium text-surface-400">
                                                    {key}
                                                </kbd>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-5 flex items-center justify-center gap-1.5 text-[10px] text-surface-600">
                <span>Press</span>
                <kbd className="rounded border border-white/10 bg-white/5 px-1 py-0.5 font-medium">?</kbd>
                <span>anywhere to toggle this dialog</span>
            </div>
        </Modal>
    );
}
