'use client';

import { Scale, User } from 'lucide-react';

interface ChatBubbleProps {
    role: 'user' | 'assistant';
    content: string;
    timestamp?: string;
}

export default function ChatBubble({ role, content, timestamp }: ChatBubbleProps) {
    const isUser = role === 'user';

    return (
        <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
            {/* Avatar */}
            <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${isUser
                        ? 'bg-primary-600/20 text-primary-400'
                        : 'bg-accent-500/20 text-accent-400'
                    }`}
            >
                {isUser ? <User className="h-4 w-4" /> : <Scale className="h-4 w-4" />}
            </div>

            {/* Message */}
            <div className={`max-w-[80%] space-y-1 ${isUser ? 'items-end' : ''}`}>
                <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${isUser
                            ? 'bg-primary-600 text-white rounded-tr-md'
                            : 'glass-card text-surface-200 rounded-tl-md'
                        }`}
                >
                    {/* Render markdown-like formatting */}
                    {content.split('\n').map((line, i) => {
                        if (line.startsWith('**') && line.endsWith('**')) {
                            return (
                                <p key={i} className="font-semibold mt-2 first:mt-0">
                                    {line.replace(/\*\*/g, '')}
                                </p>
                            );
                        }
                        if (line.startsWith('- ') || line.startsWith('• ')) {
                            return (
                                <p key={i} className="ml-3 before:content-['•'] before:mr-2 before:text-primary-400">
                                    {line.replace(/^[-•]\s*/, '')}
                                </p>
                            );
                        }
                        if (line.startsWith('⚠️') || line.startsWith('📋')) {
                            return (
                                <p key={i} className="mt-2 font-medium text-amber-300">
                                    {line}
                                </p>
                            );
                        }
                        if (line === '---') {
                            return <hr key={i} className="my-2 border-white/10" />;
                        }
                        if (line.trim() === '') {
                            return <div key={i} className="h-2" />;
                        }
                        return <p key={i}>{line}</p>;
                    })}
                </div>
                {timestamp && (
                    <p className={`text-[10px] text-surface-600 ${isUser ? 'text-right' : ''}`}>
                        {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                )}
            </div>
        </div>
    );
}
