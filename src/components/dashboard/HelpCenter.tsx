'use client';

import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, MessageSquare, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface FAQItem {
    question: string;
    answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
    {
        question: 'What types of legal documents can LegalAI generate?',
        answer: 'LegalAI can generate NDAs, lease agreements, employment contracts, partnership agreements, general contracts, and custom documents. Each document is generated based on your specific inputs and requirements.',
    },
    {
        question: 'Is the legal information provided by LegalAI considered legal advice?',
        answer: 'No. LegalAI provides legal information and guidance, not legal advice. For specific legal matters, we recommend consulting with a licensed attorney. LegalAI is designed to help you understand legal concepts and generate draft documents.',
    },
    {
        question: 'How does the contract review feature work?',
        answer: 'Upload a contract (PDF, DOCX, or TXT), and our AI will analyze it for potential risks, missing clauses, and unfavorable terms. Each issue is assigned a risk level (low, medium, high, critical) with explanations and suggestions.',
    },
    {
        question: 'Can I escalate my case to a real lawyer?',
        answer: 'Yes. You can escalate any document or query to a human lawyer through our escalation system. Provide details about your situation, and a qualified attorney will review your case.',
    },
    {
        question: 'How is my data protected?',
        answer: 'We use encryption in transit and at rest, implement strict access controls, and follow data minimization principles. Your documents and conversations are private and only accessible to you. See our Security Policy for details.',
    },
    {
        question: 'What AI model powers LegalAI?',
        answer: 'LegalAI uses OpenAI GPT-4o-mini for document generation, chat responses, and contract analysis. Our system includes a built-in legal knowledge base as a fallback when the AI service is unavailable.',
    },
];

export default function HelpCenter() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-bold text-white">Help Center</h2>
                <p className="mt-1 text-sm text-surface-400">
                    Frequently asked questions and support resources.
                </p>
            </div>

            {/* FAQ */}
            <div className="glass-card rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                    <HelpCircle className="h-4 w-4 text-primary-400" />
                    <h3 className="text-sm font-semibold text-white">
                        Frequently Asked Questions
                    </h3>
                </div>

                <div className="divide-y divide-white/5">
                    {FAQ_ITEMS.map((item, index) => (
                        <div key={index}>
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="flex w-full items-center justify-between py-3 text-left text-sm text-white transition-colors hover:text-primary-400"
                            >
                                <span className="pr-4">{item.question}</span>
                                {openIndex === index ? (
                                    <ChevronUp className="h-4 w-4 shrink-0 text-surface-500" />
                                ) : (
                                    <ChevronDown className="h-4 w-4 shrink-0 text-surface-500" />
                                )}
                            </button>
                            {openIndex === index && (
                                <p className="pb-3 text-sm leading-relaxed text-surface-400">
                                    {item.answer}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Support Links */}
            <div className="grid gap-3 sm:grid-cols-2">
                <Link
                    href="/dashboard/chat"
                    className="glass-card flex items-center gap-3 rounded-xl p-4 transition-all hover:border-primary-500/20 hover:bg-white/5"
                >
                    <MessageSquare className="h-5 w-5 text-primary-400" />
                    <div>
                        <p className="text-sm font-medium text-white">AI Assistant</p>
                        <p className="text-[11px] text-surface-500">Ask a legal question</p>
                    </div>
                </Link>
                <Link
                    href="/dashboard/escalations"
                    className="glass-card flex items-center gap-3 rounded-xl p-4 transition-all hover:border-primary-500/20 hover:bg-white/5"
                >
                    <ExternalLink className="h-5 w-5 text-amber-400" />
                    <div>
                        <p className="text-sm font-medium text-white">Escalate to Lawyer</p>
                        <p className="text-[11px] text-surface-500">Get professional help</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}
