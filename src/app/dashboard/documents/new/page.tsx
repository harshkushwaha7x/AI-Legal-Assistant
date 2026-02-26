'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    ArrowRight,
    Loader2,
    AlertCircle,
    ShieldCheck,
    Home,
    FileText,
    Briefcase,
    Users,
    Sparkles,
    CheckCircle2,
} from 'lucide-react';
import { DOCUMENT_TYPES, type DocumentTypeId } from '@/lib/validations/document';

const typeIcons: Record<string, React.ElementType> = {
    ShieldCheck,
    Home,
    FileText,
    Briefcase,
    Users,
};

export default function NewDocumentPage() {
    const router = useRouter();
    const [step, setStep] = useState<'select' | 'fill' | 'generating'>('select');
    const [selectedType, setSelectedType] = useState<DocumentTypeId | null>(null);
    const [title, setTitle] = useState('');
    const [fields, setFields] = useState<Record<string, string>>({});
    const [additionalInstructions, setAdditionalInstructions] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const currentType = DOCUMENT_TYPES.find((t) => t.id === selectedType);

    const handleSelectType = (typeId: DocumentTypeId) => {
        setSelectedType(typeId);
        const type = DOCUMENT_TYPES.find((t) => t.id === typeId);
        setTitle(`${type?.label || ''} — ${new Date().toLocaleDateString()}`);
        setFields({});
        setStep('fill');
    };

    const handleFieldChange = (name: string, value: string) => {
        setFields((prev) => ({ ...prev, [name]: value }));
    };

    const handleGenerate = async () => {
        setError(null);

        // Validate required fields
        const missingFields = currentType?.fields
            .filter((f) => f.required && !fields[f.name]?.trim())
            .map((f) => f.label);

        if (missingFields && missingFields.length > 0) {
            setError(`Please fill in: ${missingFields.join(', ')}`);
            return;
        }

        setIsGenerating(true);
        setStep('generating');

        try {
            const res = await fetch('/api/documents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: selectedType,
                    title,
                    fields,
                    additionalInstructions: additionalInstructions || undefined,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to generate document');
            }

            router.push(`/dashboard/documents/${data.document.id}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
            setStep('fill');
            setIsGenerating(false);
        }
    };

    /* ── Step 1: Select Document Type ──────────────────────── */
    if (step === 'select') {
        return (
            <div className="mx-auto max-w-4xl space-y-8">
                <div>
                    <Link
                        href="/dashboard/documents"
                        className="mb-4 inline-flex items-center gap-1.5 text-sm text-surface-400 transition-colors hover:text-white"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Documents
                    </Link>
                    <h1 className="text-2xl font-bold text-white">Create New Document</h1>
                    <p className="mt-1 text-surface-400">Choose the type of legal document to generate.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {DOCUMENT_TYPES.map((type) => {
                        const Icon = typeIcons[type.icon] || FileText;
                        return (
                            <button
                                key={type.id}
                                onClick={() => handleSelectType(type.id as DocumentTypeId)}
                                className="glass-card group flex flex-col items-start rounded-xl p-6 text-left transition-all hover:-translate-y-1"
                            >
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-500/10 transition-colors group-hover:bg-primary-500/20">
                                    <Icon className="h-6 w-6 text-primary-400" />
                                </div>
                                <h3 className="font-semibold text-white">{type.label}</h3>
                                <p className="mt-1 text-sm text-surface-400">{type.description}</p>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }

    /* ── Step 3: Generating ────────────────────────────────── */
    if (step === 'generating') {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
                <div className="relative mb-6">
                    <div className="absolute inset-0 rounded-full bg-primary-600/20 animate-pulse-glow" />
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary-600/10">
                        <Sparkles className="h-8 w-8 text-primary-400 animate-spin" style={{ animationDuration: '3s' }} />
                    </div>
                </div>
                <h2 className="text-xl font-bold text-white">Generating Your Document</h2>
                <p className="mt-2 max-w-sm text-sm text-surface-400">
                    Our AI is drafting your {currentType?.label}. This usually takes 5–15 seconds.
                </p>
                <div className="mt-6 flex items-center gap-2 text-sm text-primary-400">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                </div>
            </div>
        );
    }

    /* ── Step 2: Fill Details ──────────────────────────────── */
    return (
        <div className="mx-auto max-w-3xl space-y-6">
            {/* Header */}
            <div>
                <button
                    onClick={() => setStep('select')}
                    className="mb-4 inline-flex items-center gap-1.5 text-sm text-surface-400 transition-colors hover:text-white"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Choose Different Type
                </button>
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/10">
                        {(() => {
                            const Icon = typeIcons[currentType?.icon || ''] || FileText;
                            return <Icon className="h-5 w-5 text-primary-400" />;
                        })()}
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white">{currentType?.label}</h1>
                        <p className="text-sm text-surface-400">{currentType?.description}</p>
                    </div>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                </div>
            )}

            {/* Form */}
            <div className="glass-card rounded-2xl p-6 sm:p-8">
                <div className="space-y-5">
                    {/* Title */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-surface-300">
                            Document Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-surface-500 outline-none transition-all focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50"
                        />
                    </div>

                    {/* Dynamic fields */}
                    {currentType?.fields.map((field) => (
                        <div key={field.name}>
                            <label className="mb-1.5 block text-sm font-medium text-surface-300">
                                {field.label}
                                {field.required && <span className="ml-1 text-red-400">*</span>}
                            </label>

                            {field.type === 'textarea' ? (
                                <textarea
                                    value={fields[field.name] || ''}
                                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                    placeholder={'placeholder' in field ? (field.placeholder as string) : ''}
                                    rows={3}
                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-surface-500 outline-none transition-all focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 resize-none"
                                />
                            ) : field.type === 'select' ? (
                                <select
                                    value={fields[field.name] || ''}
                                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                    className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-all focus:border-primary-500"
                                >
                                    <option value="">Select...</option>
                                    {'options' in field &&
                                        (field.options as string[])?.map((opt: string) => (
                                            <option key={opt} value={opt}>
                                                {opt}
                                            </option>
                                        ))}
                                </select>
                            ) : field.type === 'checkbox' ? (
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={fields[field.name] === 'true'}
                                        onChange={(e) => handleFieldChange(field.name, e.target.checked.toString())}
                                        className="h-4 w-4 rounded border-white/20 bg-white/5 text-primary-600 focus:ring-primary-500"
                                    />
                                    <span className="text-sm text-surface-300">Yes</span>
                                </label>
                            ) : (
                                <input
                                    type={field.type}
                                    value={fields[field.name] || ''}
                                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                    placeholder={'placeholder' in field ? (field.placeholder as string) : ''}
                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-surface-500 outline-none transition-all focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50"
                                />
                            )}
                        </div>
                    ))}

                    {/* Additional instructions */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-surface-300">
                            Additional Instructions <span className="text-surface-500">(optional)</span>
                        </label>
                        <textarea
                            value={additionalInstructions}
                            onChange={(e) => setAdditionalInstructions(e.target.value)}
                            placeholder="Any special clauses, conditions, or modifications you'd like included..."
                            rows={3}
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-surface-500 outline-none transition-all focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 resize-none"
                        />
                    </div>
                </div>

                {/* Generate button */}
                <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
                    <div className="flex items-center gap-2 text-xs text-surface-500">
                        <CheckCircle2 className="h-3.5 w-3.5 text-accent-500" />
                        AI-powered generation
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="group inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition-all hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                <Sparkles className="h-4 w-4" />
                                Generate Document
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
