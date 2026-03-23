'use client';

import { useState } from 'react';
import { Copy, Check, Code2, ChevronDown, ChevronUp } from 'lucide-react';

interface CodeBlockProps {
    code: string;
    language?: string;
    filename?: string;
    showLineNumbers?: boolean;
    maxHeight?: number;
    collapsible?: boolean;
}

export default function CodeBlock({
    code,
    language = 'text',
    filename,
    showLineNumbers = true,
    maxHeight = 300,
    collapsible = false,
}: CodeBlockProps) {
    const [copied, setCopied] = useState(false);
    const [expanded, setExpanded] = useState(!collapsible);

    const lines = code.split('\n');

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback
        }
    };

    return (
        <div className="group rounded-xl border border-white/5 bg-[#0d1117] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 px-3 py-2">
                <div className="flex items-center gap-2">
                    <Code2 className="h-3 w-3 text-surface-600" />
                    {filename && (
                        <span className="text-[10px] font-medium text-surface-400">{filename}</span>
                    )}
                    <span className="rounded bg-white/5 px-1.5 py-0.5 text-[9px] text-surface-600">
                        {language}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    {collapsible && (
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="rounded p-1 text-surface-600 transition-colors hover:bg-white/5 hover:text-surface-400"
                        >
                            {expanded ? (
                                <ChevronUp className="h-3 w-3" />
                            ) : (
                                <ChevronDown className="h-3 w-3" />
                            )}
                        </button>
                    )}
                    <button
                        onClick={handleCopy}
                        className="rounded p-1 text-surface-600 transition-colors hover:bg-white/5 hover:text-surface-400"
                        aria-label="Copy code"
                    >
                        {copied ? (
                            <Check className="h-3 w-3 text-green-400" />
                        ) : (
                            <Copy className="h-3 w-3" />
                        )}
                    </button>
                </div>
            </div>

            {/* Code body */}
            {expanded && (
                <div
                    className="overflow-auto p-3 font-mono text-[11px] leading-5"
                    style={{ maxHeight }}
                >
                    <table className="w-full border-collapse">
                        <tbody>
                            {lines.map((line, i) => (
                                <tr key={i} className="hover:bg-white/[2%]">
                                    {showLineNumbers && (
                                        <td className="select-none pr-4 text-right text-surface-700 align-top w-8">
                                            {i + 1}
                                        </td>
                                    )}
                                    <td className="whitespace-pre text-surface-300">
                                        {line || '\u00A0'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
