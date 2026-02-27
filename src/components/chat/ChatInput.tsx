'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
    onSend: (message: string) => void;
    disabled?: boolean;
    placeholder?: string;
}

export default function ChatInput({ onSend, disabled, placeholder }: ChatInputProps) {
    const [value, setValue] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSend = () => {
        const trimmed = value.trim();
        if (!trimmed || disabled) return;
        onSend(trimmed);
        setValue('');
        // Reset textarea height
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleInput = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
        }
    };

    return (
        <div className="border-t border-white/5 bg-surface-950/80 backdrop-blur-sm px-4 py-3">
            <div className="mx-auto flex max-w-3xl items-end gap-3">
                <div className="relative flex-1">
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onInput={handleInput}
                        placeholder={placeholder || 'Ask a legal question...'}
                        disabled={disabled}
                        rows={1}
                        className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-sm text-white placeholder-surface-500 outline-none transition-all focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 disabled:opacity-50"
                    />
                </div>
                <button
                    onClick={handleSend}
                    disabled={!value.trim() || disabled}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white transition-all hover:bg-primary-500 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    {disabled ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Send className="h-4 w-4" />
                    )}
                </button>
            </div>
            <p className="mx-auto mt-1.5 max-w-3xl text-[10px] text-surface-600">
                LegalAI provides information, not legal advice. Press Enter to send, Shift+Enter for new line.
            </p>
        </div>
    );
}
