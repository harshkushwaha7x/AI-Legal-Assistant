'use client';

import { Copy, Check } from 'lucide-react';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

interface CopyButtonProps {
    text: string;
    label?: string;
    size?: 'sm' | 'md';
}

export default function CopyButton({
    text,
    label,
    size = 'sm',
}: CopyButtonProps) {
    const { copied, copy } = useCopyToClipboard();

    const sizes = {
        sm: 'h-7 px-2 text-[11px] gap-1',
        md: 'h-9 px-3 text-xs gap-1.5',
    };

    const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5';

    return (
        <button
            onClick={() => copy(text)}
            className={`inline-flex items-center rounded-lg border border-white/10 font-medium transition-all ${sizes[size]} ${copied
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'text-surface-400 hover:bg-white/5 hover:text-white'
                }`}
        >
            {copied ? (
                <>
                    <Check className={iconSize} />
                    {label ? 'Copied!' : null}
                </>
            ) : (
                <>
                    <Copy className={iconSize} />
                    {label || null}
                </>
            )}
        </button>
    );
}
