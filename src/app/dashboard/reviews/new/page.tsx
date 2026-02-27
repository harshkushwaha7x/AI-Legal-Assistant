'use client';

import { useState, useRef, DragEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    ArrowRight,
    Upload,
    FileText,
    Type,
    Loader2,
    AlertCircle,
    Sparkles,
    ShieldCheck,
    X,
} from 'lucide-react';

type UploadMode = 'paste' | 'file';

export default function NewReviewPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [mode, setMode] = useState<UploadMode>('paste');
    const [fileName, setFileName] = useState('');
    const [contractText, setContractText] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const charCount = contractText.length;
    const isValid = fileName.trim().length > 0 && contractText.trim().length >= 50;

    const handleFileRead = (file: File) => {
        if (!file.name.endsWith('.txt')) {
            setError('Only .txt files are supported currently.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError('File is too large. Maximum size is 5 MB.');
            return;
        }

        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            setContractText(text);
            setError(null);
        };
        reader.onerror = () => setError('Failed to read file.');
        reader.readAsText(file);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFileRead(file);
    };

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFileRead(file);
    };

    const handleAnalyze = async () => {
        if (!isValid) return;

        setError(null);
        setIsAnalyzing(true);

        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileName, contractText }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to analyze contract');
            }

            router.push(`/dashboard/reviews/${data.review.id}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
            setIsAnalyzing(false);
        }
    };

    /* ── Analyzing state ──────────────────────────────────── */
    if (isAnalyzing) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
                <div className="relative mb-6">
                    <div className="absolute inset-0 rounded-full bg-primary-600/20 animate-pulse-glow" />
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary-600/10">
                        <ShieldCheck className="h-8 w-8 text-primary-400 animate-spin" style={{ animationDuration: '3s' }} />
                    </div>
                </div>
                <h2 className="text-xl font-bold text-white">Analyzing Your Contract</h2>
                <p className="mt-2 max-w-sm text-sm text-surface-400">
                    Our AI is reviewing clauses, identifying risks, and scoring your contract. This usually takes 10–20 seconds.
                </p>
                <div className="mt-8 space-y-2 text-left">
                    {[
                        'Parsing contract structure...',
                        'Identifying key clauses...',
                        'Assessing risk factors...',
                        'Generating recommendations...',
                    ].map((step, i) => (
                        <div
                            key={step}
                            className="flex items-center gap-2 text-sm text-surface-400 animate-fade-in"
                            style={{ animationDelay: `${i * 800}ms` }}
                        >
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-primary-400" />
                            {step}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            {/* Header */}
            <div>
                <Link
                    href="/dashboard/reviews"
                    className="mb-4 inline-flex items-center gap-1.5 text-sm text-surface-400 transition-colors hover:text-white"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Reviews
                </Link>
                <h1 className="text-2xl font-bold text-white">New Contract Review</h1>
                <p className="mt-1 text-surface-400">Paste or upload your contract for AI analysis.</p>
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span className="flex-1">{error}</span>
                    <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* Mode toggle */}
            <div className="flex gap-2 rounded-xl border border-white/5 bg-white/[0.02] p-1">
                <button
                    onClick={() => setMode('paste')}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all ${mode === 'paste'
                            ? 'bg-primary-600/15 text-primary-400'
                            : 'text-surface-400 hover:text-white'
                        }`}
                >
                    <Type className="h-4 w-4" />
                    Paste Text
                </button>
                <button
                    onClick={() => setMode('file')}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all ${mode === 'file'
                            ? 'bg-primary-600/15 text-primary-400'
                            : 'text-surface-400 hover:text-white'
                        }`}
                >
                    <Upload className="h-4 w-4" />
                    Upload File
                </button>
            </div>

            {/* Form */}
            <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-5">
                {/* File name */}
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-surface-300">
                        Document Name <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        placeholder="e.g., Vendor Service Agreement 2024"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-surface-500 outline-none transition-all focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50"
                    />
                </div>

                {/* Paste mode */}
                {mode === 'paste' && (
                    <div>
                        <div className="mb-1.5 flex items-center justify-between">
                            <label className="text-sm font-medium text-surface-300">
                                Contract Text <span className="text-red-400">*</span>
                            </label>
                            <span className={`text-xs ${charCount < 50 ? 'text-red-400' : 'text-surface-500'}`}>
                                {charCount.toLocaleString()} characters {charCount < 50 ? '(min 50)' : ''}
                            </span>
                        </div>
                        <textarea
                            value={contractText}
                            onChange={(e) => setContractText(e.target.value)}
                            placeholder="Paste the full contract text here..."
                            rows={16}
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-mono text-sm text-white placeholder-surface-500 outline-none transition-all focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 resize-none"
                        />
                    </div>
                )}

                {/* File upload mode */}
                {mode === 'file' && (
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-surface-300">
                            Upload Contract <span className="text-red-400">*</span>
                        </label>
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed py-12 transition-all ${isDragging
                                    ? 'border-primary-500 bg-primary-500/5'
                                    : contractText
                                        ? 'border-accent-500/30 bg-accent-500/5'
                                        : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                                }`}
                        >
                            {contractText ? (
                                <>
                                    <FileText className="mb-3 h-10 w-10 text-accent-400" />
                                    <p className="text-sm font-medium text-white">{fileName}</p>
                                    <p className="mt-1 text-xs text-surface-400">
                                        {charCount.toLocaleString()} characters loaded
                                    </p>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setContractText('');
                                            setFileName('');
                                        }}
                                        className="mt-3 text-xs text-primary-400 hover:text-primary-300"
                                    >
                                        Remove and upload different file
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Upload className="mb-3 h-10 w-10 text-surface-500" />
                                    <p className="text-sm text-surface-300">
                                        <span className="font-medium text-primary-400">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="mt-1 text-xs text-surface-500">
                                        .txt files only • Max 5 MB
                                    </p>
                                </>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".txt"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </div>

                        {/* Preview */}
                        {contractText && (
                            <div className="mt-4">
                                <p className="mb-1.5 text-sm font-medium text-surface-300">Preview</p>
                                <div className="max-h-48 overflow-auto rounded-xl border border-white/5 bg-white/[0.02] p-4">
                                    <pre className="whitespace-pre-wrap font-mono text-xs text-surface-400">
                                        {contractText.slice(0, 1000)}
                                        {contractText.length > 1000 && '\n\n... (truncated)'}
                                    </pre>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Analyze button */}
                <div className="flex items-center justify-between border-t border-white/5 pt-6">
                    <div className="flex items-center gap-2 text-xs text-surface-500">
                        <Sparkles className="h-3.5 w-3.5 text-primary-400" />
                        AI-powered risk analysis
                    </div>
                    <button
                        onClick={handleAnalyze}
                        disabled={!isValid || isAnalyzing}
                        className="group inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition-all hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ShieldCheck className="h-4 w-4" />
                        Analyze Contract
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                </div>
            </div>
        </div>
    );
}
