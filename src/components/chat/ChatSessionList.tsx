'use client';

import { useState } from 'react';
import {
    MessageSquare,
    Plus,
    MoreVertical,
    Trash2,
    Edit3,
    Clock,
    X,
} from 'lucide-react';

interface Session {
    id: string;
    title: string;
    updatedAt: string;
    _count: { messages: number };
}

interface ChatSessionListProps {
    sessions: Session[];
    activeId: string | null;
    onSelect: (id: string) => void;
    onNew: () => void;
    onDelete: (id: string) => void;
    onRename: (id: string, title: string) => void;
}

export default function ChatSessionList({
    sessions,
    activeId,
    onSelect,
    onNew,
    onDelete,
    onRename,
}: ChatSessionListProps) {
    const [menuOpen, setMenuOpen] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState('');

    const startRename = (session: Session) => {
        setEditingId(session.id);
        setEditTitle(session.title);
        setMenuOpen(null);
    };

    const submitRename = (id: string) => {
        if (editTitle.trim()) {
            onRename(id, editTitle.trim());
        }
        setEditingId(null);
    };

    return (
        <div className="flex h-full flex-col">
            {/* New chat button */}
            <div className="p-3">
                <button
                    onClick={onNew}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-white transition-all hover:bg-white/10"
                >
                    <Plus className="h-4 w-4" />
                    New Chat
                </button>
            </div>

            {/* Session list */}
            <div className="flex-1 overflow-y-auto px-2 pb-2">
                {sessions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <MessageSquare className="mb-2 h-8 w-8 text-surface-700" />
                        <p className="text-xs text-surface-600">No conversations yet</p>
                    </div>
                ) : (
                    <div className="space-y-0.5">
                        {sessions.map((session) => (
                            <div
                                key={session.id}
                                className={`group relative flex items-center rounded-lg transition-all ${activeId === session.id
                                        ? 'bg-primary-600/10 text-primary-300'
                                        : 'text-surface-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                {editingId === session.id ? (
                                    <div className="flex flex-1 items-center gap-1 p-2">
                                        <input
                                            type="text"
                                            value={editTitle}
                                            onChange={(e) => setEditTitle(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') submitRename(session.id);
                                                if (e.key === 'Escape') setEditingId(null);
                                            }}
                                            onBlur={() => submitRename(session.id)}
                                            autoFocus
                                            className="flex-1 rounded bg-white/10 px-2 py-1 text-xs text-white outline-none"
                                        />
                                        <button onClick={() => setEditingId(null)} className="text-surface-500">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => onSelect(session.id)}
                                            className="flex flex-1 items-center gap-2.5 overflow-hidden p-2.5 text-left"
                                        >
                                            <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="truncate text-xs font-medium">{session.title}</p>
                                                <p className="mt-0.5 flex items-center gap-1 text-[10px] text-surface-600">
                                                    <Clock className="h-2.5 w-2.5" />
                                                    {new Date(session.updatedAt).toLocaleDateString()}
                                                    <span>· {session._count.messages} msgs</span>
                                                </p>
                                            </div>
                                        </button>

                                        {/* Menu */}
                                        <div className="relative pr-1 opacity-0 transition-opacity group-hover:opacity-100">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setMenuOpen(menuOpen === session.id ? null : session.id);
                                                }}
                                                className="flex h-6 w-6 items-center justify-center rounded text-surface-500 hover:text-white"
                                            >
                                                <MoreVertical className="h-3 w-3" />
                                            </button>
                                            {menuOpen === session.id && (
                                                <div className="absolute right-0 top-full z-20 mt-0.5 w-32 animate-fade-in rounded-lg border border-white/5 bg-surface-900 p-0.5 shadow-xl">
                                                    <button
                                                        onClick={() => startRename(session)}
                                                        className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-[11px] text-surface-300 hover:bg-white/5"
                                                    >
                                                        <Edit3 className="h-3 w-3" />
                                                        Rename
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setMenuOpen(null);
                                                            onDelete(session.id);
                                                        }}
                                                        className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-[11px] text-red-400 hover:bg-red-500/10"
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
