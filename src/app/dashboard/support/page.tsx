'use client';

import { useState } from 'react';
import {
    HelpCircle,
    MessageCircle,
    Book,
    Mail,
    ChevronDown,
    ChevronUp,
    ExternalLink,
    Search,
    Scale,
} from 'lucide-react';

const FAQ_ITEMS = [
    {
        question: 'How accurate is the AI legal assistant?',
        answer: 'Our AI provides legal information based on general legal principles and publicly available legal knowledge. While highly informed, it is not a substitute for professional legal advice. For specific legal matters, always consult with a licensed attorney.',
    },
    {
        question: 'Can I use generated documents in real legal proceedings?',
        answer: 'Generated documents are templates based on common legal standards. They should be reviewed and potentially modified by a qualified attorney before use in actual legal proceedings or binding agreements.',
    },
    {
        question: 'How does the contract review risk scoring work?',
        answer: 'Our AI analyzes contracts for potential risks including unfavorable terms, missing protections, ambiguous language, and non-standard clauses. The risk score (0-100) reflects the overall risk level, with higher scores indicating more potential issues.',
    },
    {
        question: 'Is my data and legal information kept confidential?',
        answer: 'Yes. All your documents, contracts, and conversations are stored securely and are only accessible to you. We do not share your legal data with third parties. When using OpenAI for analysis, data is sent via encrypted connections.',
    },
    {
        question: 'What happens when I escalate to a lawyer?',
        answer: 'When you create a lawyer escalation, your case details are submitted for review by a qualified attorney. You can track the status through our status tracker, and the attorney can add notes and update the status as they work on your matter.',
    },
    {
        question: 'Can I use the platform without an OpenAI API key?',
        answer: 'Yes! The platform includes comprehensive fallback systems for all AI features. Document generation, contract review, legal chat, and research all have built-in fallback engines that work without an API key, though results may be more general.',
    },
];

export default function SupportPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredFaq = FAQ_ITEMS.filter(
        (item) =>
            item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="mx-auto max-w-3xl space-y-8">
            {/* Header */}
            <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600/10 ring-1 ring-primary-500/20">
                    <HelpCircle className="h-7 w-7 text-primary-400" />
                </div>
                <h1 className="text-2xl font-bold text-white">Help & Support</h1>
                <p className="mt-1 text-surface-400">Find answers, get help, and contact our team.</p>
            </div>

            {/* Quick links */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { icon: Book, label: 'Documentation', desc: 'Guides & tutorials', href: '#' },
                    { icon: MessageCircle, label: 'AI Chat', desc: 'Ask our AI assistant', href: '/dashboard/chat' },
                    { icon: Mail, label: 'Contact Us', desc: 'Email support team', href: 'mailto:support@legalai.com' },
                ].map((link) => (
                    <a
                        key={link.label}
                        href={link.href}
                        className="glass-card group flex flex-col items-center gap-2 rounded-xl p-5 text-center transition-all hover:-translate-y-0.5"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/10">
                            <link.icon className="h-5 w-5 text-primary-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white">{link.label}</p>
                            <p className="text-[11px] text-surface-500">{link.desc}</p>
                        </div>
                    </a>
                ))}
            </div>

            {/* FAQ */}
            <div>
                <h2 className="mb-4 text-lg font-semibold text-white">Frequently Asked Questions</h2>

                {/* Search */}
                <div className="relative mb-4">
                    <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-500" />
                    <input
                        type="text"
                        placeholder="Search help articles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-surface-500 outline-none transition-all focus:border-primary-500"
                    />
                </div>

                <div className="space-y-2">
                    {filteredFaq.map((item, i) => (
                        <div key={i} className="glass-card overflow-hidden rounded-xl">
                            <button
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                className="flex w-full items-center justify-between px-5 py-4 text-left"
                            >
                                <span className="text-sm font-medium text-white pr-4">{item.question}</span>
                                {openFaq === i ? (
                                    <ChevronUp className="h-4 w-4 shrink-0 text-primary-400" />
                                ) : (
                                    <ChevronDown className="h-4 w-4 shrink-0 text-surface-500" />
                                )}
                            </button>
                            {openFaq === i && (
                                <div className="border-t border-white/5 px-5 py-4">
                                    <p className="text-sm leading-relaxed text-surface-400">{item.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Contact */}
            <div className="glass-card rounded-2xl p-6 text-center">
                <Scale className="mx-auto mb-3 h-8 w-8 text-primary-400" />
                <h3 className="font-semibold text-white">Still need help?</h3>
                <p className="mt-1 text-sm text-surface-400">
                    Our support team is available Monday–Friday, 9am–6pm EST.
                </p>
                <a
                    href="mailto:support@legalai.com"
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-500"
                >
                    <Mail className="h-4 w-4" />
                    Contact Support
                    <ExternalLink className="h-3 w-3" />
                </a>
            </div>
        </div>
    );
}
