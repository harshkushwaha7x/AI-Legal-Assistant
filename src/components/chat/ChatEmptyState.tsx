'use client';

import { Scale, Sparkles, MessageSquare, ArrowRight } from 'lucide-react';

const SUGGESTIONS = [
    { text: 'What are the key clauses I should include in an NDA?', icon: '>' },
    { text: 'Explain the difference between an LLC and a Corporation', icon: '>' },
    { text: 'What are my rights as a tenant if my landlord is not making repairs?', icon: '>' },
    { text: 'How do I protect my intellectual property as a startup founder?', icon: '>' },
    { text: 'What should I know before signing an employment contract?', icon: '>' },
    { text: 'Can I break a lease early without penalty?', icon: '>' },
];

interface ChatEmptyStateProps {
    onSendMessage: (message: string) => void;
}

export default function ChatEmptyState({ onSendMessage }: ChatEmptyStateProps) {
    return (
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
            {/* Logo */}
            <div className="relative mb-6">
                <div className="absolute inset-0 rounded-full bg-primary-600/15 animate-pulse-glow" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary-600/10 ring-1 ring-primary-500/20">
                    <Scale className="h-7 w-7 text-primary-400" />
                </div>
            </div>

            <h2 className="text-xl font-bold text-white">Legal AI Assistant</h2>
            <p className="mt-2 max-w-md text-center text-sm text-surface-400">
                Ask any legal question in plain English. Get clear, actionable answers backed by legal knowledge.
            </p>

            {/* Capabilities */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
                {['Contracts', 'Employment', 'Real Estate', 'Business Law', 'IP', 'Family Law'].map((topic) => (
                    <span
                        key={topic}
                        className="rounded-full bg-white/5 px-3 py-1 text-xs text-surface-400 ring-1 ring-white/5"
                    >
                        {topic}
                    </span>
                ))}
            </div>

            {/* Suggestions */}
            <div className="mt-8 w-full max-w-lg space-y-2">
                <p className="mb-3 flex items-center gap-1.5 text-xs font-medium text-surface-500">
                    <Sparkles className="h-3 w-3 text-primary-400" />
                    Try asking
                </p>
                {SUGGESTIONS.map((suggestion) => (
                    <button
                        key={suggestion.text}
                        onClick={() => onSendMessage(suggestion.text)}
                        className="group flex w-full items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 text-left text-sm text-surface-300 transition-all hover:border-primary-500/20 hover:bg-white/5 hover:text-white"
                    >
                        <span className="text-lg">{suggestion.icon}</span>
                        <span className="flex-1">{suggestion.text}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-surface-600 transition-transform group-hover:translate-x-1 group-hover:text-primary-400" />
                    </button>
                ))}
            </div>

            {/* Disclaimer */}
            <p className="mt-8 max-w-md text-center text-[10px] text-surface-600">
                <MessageSquare className="mr-1 inline h-3 w-3" />
                LegalAI provides general legal information, not legal advice. Always consult a licensed attorney for specific legal matters.
            </p>
        </div>
    );
}
