'use client';

import { useState, useEffect, useRef } from 'react';
import { PanelLeftClose, PanelLeft, Loader2 } from 'lucide-react';
import ChatBubble from '@/components/chat/ChatBubble';
import ChatInput from '@/components/chat/ChatInput';
import ChatSessionList from '@/components/chat/ChatSessionList';
import ChatEmptyState from '@/components/chat/ChatEmptyState';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    createdAt: string;
}

interface Session {
    id: string;
    title: string;
    updatedAt: string;
    _count: { messages: number };
}

export default function ChatPage() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchSessions();
    }, []);

    useEffect(() => {
        if (activeSessionId) fetchMessages(activeSessionId);
        else setMessages([]);
    }, [activeSessionId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchSessions = async () => {
        try {
            const res = await fetch('/api/chat/sessions');
            const data = await res.json();
            setSessions(data.sessions || []);
        } catch (error) {
            console.error('Failed to fetch sessions:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (sessionId: string) => {
        try {
            const res = await fetch(`/api/chat/sessions/${sessionId}`);
            const data = await res.json();
            setMessages(data.session?.messages || []);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        }
    };

    const createSession = async (): Promise<string | null> => {
        try {
            const res = await fetch('/api/chat/sessions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({}),
            });
            const data = await res.json();
            const newSession = data.session;
            setSessions((prev) => [
                { ...newSession, _count: { messages: 0 } },
                ...prev,
            ]);
            setActiveSessionId(newSession.id);
            setMessages([]);
            return newSession.id;
        } catch (error) {
            console.error('Failed to create session:', error);
            return null;
        }
    };

    const sendMessage = async (content: string) => {
        let sessionId = activeSessionId;

        // Auto-create session if none active
        if (!sessionId) {
            sessionId = await createSession();
            if (!sessionId) return;
        }

        // Optimistic update — add user message immediately
        const tempUserMsg: Message = {
            id: `temp-${Date.now()}`,
            role: 'user',
            content,
            createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, tempUserMsg]);
        setSending(true);

        try {
            const res = await fetch('/api/chat/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content, sessionId }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            // Replace temp message with real ones
            setMessages((prev) => [
                ...prev.filter((m) => m.id !== tempUserMsg.id),
                data.userMessage,
                data.assistantMessage,
            ]);

            // Refresh sessions to update title and order
            fetchSessions();
        } catch (error) {
            console.error('Failed to send message:', error);
            // Remove temp message on error
            setMessages((prev) => prev.filter((m) => m.id !== tempUserMsg.id));
        } finally {
            setSending(false);
        }
    };

    const deleteSession = async (id: string) => {
        if (!confirm('Delete this conversation?')) return;
        try {
            await fetch(`/api/chat/sessions/${id}`, { method: 'DELETE' });
            setSessions((prev) => prev.filter((s) => s.id !== id));
            if (activeSessionId === id) {
                setActiveSessionId(null);
                setMessages([]);
            }
        } catch (error) {
            console.error('Failed to delete session:', error);
        }
    };

    const renameSession = async (id: string, title: string) => {
        try {
            await fetch(`/api/chat/sessions/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title }),
            });
            setSessions((prev) =>
                prev.map((s) => (s.id === id ? { ...s, title } : s))
            );
        } catch (error) {
            console.error('Failed to rename session:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-4rem)] overflow-hidden -m-6">
            {/* Session sidebar */}
            <div
                className={`shrink-0 border-r border-white/5 bg-surface-950 transition-all duration-300 ${sidebarOpen ? 'w-[260px]' : 'w-0 overflow-hidden'
                    }`}
            >
                <ChatSessionList
                    sessions={sessions}
                    activeId={activeSessionId}
                    onSelect={setActiveSessionId}
                    onNew={createSession}
                    onDelete={deleteSession}
                    onRename={renameSession}
                />
            </div>

            {/* Main chat area */}
            <div className="flex flex-1 flex-col min-w-0">
                {/* Chat header */}
                <div className="flex items-center gap-3 border-b border-white/5 px-4 py-2.5">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-surface-400 transition-colors hover:bg-white/5 hover:text-white"
                    >
                        {sidebarOpen ? (
                            <PanelLeftClose className="h-4 w-4" />
                        ) : (
                            <PanelLeft className="h-4 w-4" />
                        )}
                    </button>
                    <h2 className="text-sm font-medium text-white truncate">
                        {activeSessionId
                            ? sessions.find((s) => s.id === activeSessionId)?.title || 'Chat'
                            : 'New Conversation'}
                    </h2>
                </div>

                {/* Messages area */}
                <div className="flex-1 overflow-y-auto">
                    {messages.length === 0 && !sending ? (
                        <ChatEmptyState onSendMessage={sendMessage} />
                    ) : (
                        <div className="mx-auto max-w-3xl space-y-4 px-4 py-6">
                            {messages.map((msg) => (
                                <ChatBubble
                                    key={msg.id}
                                    role={msg.role}
                                    content={msg.content}
                                    timestamp={msg.createdAt}
                                />
                            ))}
                            {sending && (
                                <div className="flex gap-3">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-500/20">
                                        <Loader2 className="h-4 w-4 animate-spin text-accent-400" />
                                    </div>
                                    <div className="glass-card rounded-2xl rounded-tl-md px-4 py-3">
                                        <div className="flex items-center gap-1">
                                            <div className="h-2 w-2 rounded-full bg-surface-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <div className="h-2 w-2 rounded-full bg-surface-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <div className="h-2 w-2 rounded-full bg-surface-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Input */}
                <ChatInput onSend={sendMessage} disabled={sending} />
            </div>
        </div>
    );
}
