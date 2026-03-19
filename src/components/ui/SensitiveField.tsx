'use client';

import { useState } from 'react';
import { Eye, EyeOff, Copy, Check, Shield } from 'lucide-react';

interface SensitiveFieldProps {
    label: string;
    value: string;
    masked?: boolean;
}

/**
 * Input field that masks sensitive content with reveal toggle
 */
export default function SensitiveField({ label, value, masked = true }: SensitiveFieldProps) {
    const [revealed, setRevealed] = useState(!masked);
    const [copied, setCopied] = useState(false);

    const maskedValue = value.replace(/./g, '*');
    const partialMask = value.length > 4
        ? '*'.repeat(value.length - 4) + value.slice(-4)
        : maskedValue;

    const displayValue = revealed ? value : partialMask;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback
        }
    };

    return (
        <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
                <Shield className="h-3 w-3 text-surface-600" />
                <label className="text-[10px] font-medium uppercase tracking-wider text-surface-500">
                    {label}
                </label>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                <span className="flex-1 font-mono text-xs text-surface-300 tracking-wider">
                    {displayValue}
                </span>
                <button
                    onClick={() => setRevealed(!revealed)}
                    className="text-surface-600 hover:text-surface-300 transition-colors"
                    aria-label={revealed ? 'Hide value' : 'Show value'}
                >
                    {revealed ? (
                        <EyeOff className="h-3.5 w-3.5" />
                    ) : (
                        <Eye className="h-3.5 w-3.5" />
                    )}
                </button>
                <button
                    onClick={handleCopy}
                    className="text-surface-600 hover:text-surface-300 transition-colors"
                    aria-label="Copy value"
                >
                    {copied ? (
                        <Check className="h-3.5 w-3.5 text-green-400" />
                    ) : (
                        <Copy className="h-3.5 w-3.5" />
                    )}
                </button>
            </div>
        </div>
    );
}
