'use client';

import { useState } from 'react';
import { Share2, Copy, Twitter, Linkedin, Mail, Check, Link2 } from 'lucide-react';

interface ShareDialogProps {
    title: string;
    url?: string;
    description?: string;
    onClose: () => void;
}

export default function ShareDialog({ title, url, description, onClose }: ShareDialogProps) {
    const [copied, setCopied] = useState(false);
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
    const shareText = description || title;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback
            const input = document.createElement('input');
            input.value = shareUrl;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const shareLinks = [
        {
            name: 'Twitter / X',
            icon: Twitter,
            href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
            color: 'hover:bg-sky-500/10 hover:text-sky-400',
        },
        {
            name: 'LinkedIn',
            icon: Linkedin,
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
            color: 'hover:bg-blue-500/10 hover:text-blue-400',
        },
        {
            name: 'Email',
            icon: Mail,
            href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`,
            color: 'hover:bg-amber-500/10 hover:text-amber-400',
        },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-surface-900 p-6 shadow-2xl">
                <div className="flex items-center gap-2 mb-4">
                    <Share2 className="h-4 w-4 text-primary-400" />
                    <h3 className="text-sm font-semibold text-white">Share</h3>
                </div>

                <p className="text-xs text-surface-400 mb-5 truncate">
                    {title}
                </p>

                {/* Copy link */}
                <div className="flex items-center gap-2 mb-5">
                    <div className="flex-1 flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                        <Link2 className="h-3.5 w-3.5 shrink-0 text-surface-500" />
                        <span className="text-xs text-surface-400 truncate">{shareUrl}</span>
                    </div>
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-primary-500"
                    >
                        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        {copied ? 'Copied' : 'Copy'}
                    </button>
                </div>

                {/* Share platforms */}
                <div className="space-y-1">
                    {shareLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                            <a
                                key={link.name}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-surface-400 transition-colors ${link.color}`}
                            >
                                <Icon className="h-4 w-4" />
                                {link.name}
                            </a>
                        );
                    })}
                </div>

                <button
                    onClick={onClose}
                    className="mt-5 w-full rounded-lg border border-white/10 py-2 text-xs font-medium text-surface-400 transition-colors hover:bg-white/5 hover:text-white"
                >
                    Close
                </button>
            </div>
        </div>
    );
}
