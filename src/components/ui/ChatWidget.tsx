'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Minimize2, Maximize2 } from 'lucide-react';

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

interface ChatWidgetProps {
    messages?: ChatMessage[];
    onSend?: (message: string) => void;
    title?: string;
    placeholder?: string;
}

export default function ChatWidget({
    messages: externalMessages,
    onSend,
    title = 'AI Legal Assistant',
    placeholder = 'Ask a legal question...',
}: ChatWidgetProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>(externalMessages || []);

    useEffect(() => {
        if (externalMessages) setMessages(externalMessages);
    }, [externalMessages]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg: ChatMessage = {
            id: `msg-${Date.now()}`,
            role: 'user',
            content: input.trim(),
            timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, userMsg]);
        onSend?.(input.trim());
        setInput('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-[80] flex items-center justify-center rounded-full bg-primary-600 p-3.5 text-white shadow-xl hover:bg-primary-500 transition-all hover:scale-105"
                aria-label="Open chat"
            >
                <MessageSquare className="h-5 w-5" />
            </button>
        );
    }

    return (
        <div className={`fixed bottom-6 right-6 z-[80] flex flex-col rounded-2xl border border-white/10 bg-surface-900/95 shadow-2xl backdrop-blur-xl transition-all ${
            isMinimized ? 'w-72 h-12' : 'w-80 h-[28rem]'
        }`}>
            {/* Header */}
            <div className="flex items-center justify-between rounded-t-2xl border-b border-white/5 px-4 py-2.5">
                <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-primary-400" />
                    <span className="text-xs font-semibold text-white">{title}</span>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="rounded p-1 text-surface-600 hover:text-surface-300 transition-colors"
                    >
                        {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
                    </button>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="rounded p-1 text-surface-600 hover:text-surface-300 transition-colors"
                    >
                        <X className="h-3 w-3" />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-3">
                        {messages.length === 0 && (
                            <div className="flex h-full items-center justify-center">
                                <p className="text-[10px] text-surface-600">Ask me anything about legal documents.</p>
                            </div>
                        )}
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {msg.role === 'assistant' && (
                                    <Bot className="mt-1 h-4 w-4 shrink-0 text-primary-400" />
                                )}
                                <div
                                    className={`max-w-[80%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                                        msg.role === 'user'
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-white/5 text-surface-300'
                                    }`}
                                >
                                    {msg.content}
                                </div>
                                {msg.role === 'user' && (
                                    <User className="mt-1 h-4 w-4 shrink-0 text-surface-500" />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <div className="border-t border-white/5 p-3">
                        <div className="flex items-center gap-2">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={placeholder}
                                className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder-surface-600 outline-none focus:border-primary-500"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim()}
                                className="rounded-lg bg-primary-600 p-2 text-white transition-colors hover:bg-primary-500 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <Send className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
