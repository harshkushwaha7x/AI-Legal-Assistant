'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
    Search,
    FileText,
    ShieldCheck,
    MessageSquare,
    BookOpen,
    UserCheck,
    Building2,
    Settings,
    HelpCircle,
    LayoutDashboard,
    Command,
    ArrowRight,
} from 'lucide-react';

interface CommandItem {
    id: string;
    label: string;
    description: string;
    icon: React.ElementType;
    href: string;
    category: string;
}

const COMMANDS: CommandItem[] = [
    { id: 'dashboard', label: 'Dashboard', description: 'Go to dashboard overview', icon: LayoutDashboard, href: '/dashboard', category: 'Navigation' },
    { id: 'documents', label: 'Documents', description: 'Manage legal documents', icon: FileText, href: '/dashboard/documents', category: 'Navigation' },
    { id: 'new-document', label: 'New Document', description: 'Generate a new legal document', icon: FileText, href: '/dashboard/documents/new', category: 'Actions' },
    { id: 'reviews', label: 'Contract Review', description: 'View contract reviews', icon: ShieldCheck, href: '/dashboard/reviews', category: 'Navigation' },
    { id: 'new-review', label: 'New Review', description: 'Upload a contract for review', icon: ShieldCheck, href: '/dashboard/reviews/new', category: 'Actions' },
    { id: 'chat', label: 'AI Legal Chat', description: 'Ask legal questions', icon: MessageSquare, href: '/dashboard/chat', category: 'Navigation' },
    { id: 'research', label: 'Legal Research', description: 'Search statutes and case law', icon: BookOpen, href: '/dashboard/research', category: 'Navigation' },
    { id: 'escalations', label: 'Escalations', description: 'View lawyer escalations', icon: UserCheck, href: '/dashboard/escalations', category: 'Navigation' },
    { id: 'new-escalation', label: 'New Escalation', description: 'Escalate to a lawyer', icon: UserCheck, href: '/dashboard/escalations/new', category: 'Actions' },
    { id: 'templates', label: 'Templates', description: 'Browse document templates', icon: Building2, href: '/dashboard/templates', category: 'Navigation' },
    { id: 'settings', label: 'Settings', description: 'Account preferences', icon: Settings, href: '/dashboard/settings', category: 'Navigation' },
    { id: 'support', label: 'Help & Support', description: 'FAQ and contact', icon: HelpCircle, href: '/dashboard/support', category: 'Navigation' },
];

export default function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selected, setSelected] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const filtered = query
        ? COMMANDS.filter(
            (cmd) =>
                cmd.label.toLowerCase().includes(query.toLowerCase()) ||
                cmd.description.toLowerCase().includes(query.toLowerCase())
        )
        : COMMANDS;

    // Group by category
    const grouped = filtered.reduce<Record<string, CommandItem[]>>((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {});

    const flatList = Object.values(grouped).flat();

    const handleSelect = useCallback(
        (item: CommandItem) => {
            setIsOpen(false);
            setQuery('');
            router.push(item.href);
        },
        [router]
    );

    // Keyboard shortcut: Ctrl+K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen((prev) => !prev);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
            setSelected(0);
        } else {
            setQuery('');
        }
    }, [isOpen]);

    // Arrow key navigation
    useEffect(() => {
        if (!isOpen) return;
        const handleNav = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelected((prev) => Math.min(prev + 1, flatList.length - 1));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelected((prev) => Math.max(prev - 1, 0));
            } else if (e.key === 'Enter' && flatList[selected]) {
                e.preventDefault();
                handleSelect(flatList[selected]);
            }
        };
        document.addEventListener('keydown', handleNav);
        return () => document.removeEventListener('keydown', handleNav);
    }, [isOpen, selected, flatList, handleSelect]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[60] flex items-start justify-center bg-black/60 backdrop-blur-sm pt-[15vh]"
            onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
        >
            <div className="w-full max-w-lg animate-scale-in rounded-2xl border border-white/10 bg-surface-900 shadow-2xl">
                {/* Search input */}
                <div className="flex items-center gap-3 border-b border-white/5 px-4 py-3">
                    <Search className="h-4 w-4 shrink-0 text-surface-500" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setSelected(0);
                        }}
                        placeholder="Search commands..."
                        className="flex-1 bg-transparent text-sm text-white outline-none placeholder-surface-500"
                    />
                    <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-surface-500">
                        ESC
                    </kbd>
                </div>

                {/* Results */}
                <div className="max-h-80 overflow-y-auto p-2">
                    {Object.entries(grouped).map(([category, items]) => (
                        <div key={category}>
                            <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-surface-600">
                                {category}
                            </p>
                            {items.map((item) => {
                                const idx = flatList.indexOf(item);
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => handleSelect(item)}
                                        onMouseEnter={() => setSelected(idx)}
                                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${idx === selected
                                                ? 'bg-primary-600/10 text-white'
                                                : 'text-surface-300 hover:bg-white/5'
                                            }`}
                                    >
                                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${idx === selected ? 'bg-primary-500/15' : 'bg-white/5'
                                            }`}>
                                            <item.icon className={`h-4 w-4 ${idx === selected ? 'text-primary-400' : 'text-surface-400'}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{item.label}</p>
                                            <p className="text-[11px] text-surface-500 truncate">{item.description}</p>
                                        </div>
                                        {idx === selected && (
                                            <ArrowRight className="h-3.5 w-3.5 text-primary-400 shrink-0" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    ))}

                    {flatList.length === 0 && (
                        <div className="py-8 text-center">
                            <p className="text-sm text-surface-400">No results found</p>
                            <p className="text-xs text-surface-600">Try a different search term</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-white/5 px-4 py-2 text-[10px] text-surface-600">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                            <kbd className="rounded border border-white/10 bg-white/5 px-1 py-0.5">↑↓</kbd>
                            Navigate
                        </span>
                        <span className="flex items-center gap-1">
                            <kbd className="rounded border border-white/10 bg-white/5 px-1 py-0.5">↵</kbd>
                            Select
                        </span>
                    </div>
                    <span className="flex items-center gap-1">
                        <Command className="h-2.5 w-2.5" />K to toggle
                    </span>
                </div>
            </div>
        </div>
    );
}
