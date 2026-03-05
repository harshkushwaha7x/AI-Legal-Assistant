'use client';

import { useState, useCallback } from 'react';

interface UseCopyReturn {
    copied: boolean;
    copy: (text: string) => Promise<void>;
}

/**
 * Hook to copy text to clipboard with copied state feedback
 */
export function useCopyToClipboard(resetDelay: number = 2000): UseCopyReturn {
    const [copied, setCopied] = useState(false);

    const copy = useCallback(
        async (text: string) => {
            try {
                await navigator.clipboard.writeText(text);
                setCopied(true);
                setTimeout(() => setCopied(false), resetDelay);
            } catch (error) {
                console.warn('Failed to copy to clipboard:', error);
                // Fallback for older browsers
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                setCopied(true);
                setTimeout(() => setCopied(false), resetDelay);
            }
        },
        [resetDelay]
    );

    return { copied, copy };
}
