'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    Download,
    Copy,
    Check,
    Loader2,
    FileText,
    Clock,
    Edit3,
    Save,
    Trash2,
    CheckCircle2,
    AlertCircle,
} from 'lucide-react';

interface DocumentData {
    id: string;
    title: string;
    type: string;
    status: string;
    content: string;
    metadata: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
}

const statusOptions = [
    { value: 'DRAFT', label: 'Draft', color: 'bg-amber-500/15 text-amber-400' },
    { value: 'REVIEW', label: 'In Review', color: 'bg-violet-500/15 text-violet-400' },
    { value: 'FINAL', label: 'Final', color: 'bg-emerald-500/15 text-emerald-400' },
    { value: 'ARCHIVED', label: 'Archived', color: 'bg-surface-500/15 text-surface-400' },
];

export default function DocumentViewPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [doc, setDoc] = useState<DocumentData | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [editContent, setEditContent] = useState('');
    const [editTitle, setEditTitle] = useState('');
    const [saving, setSaving] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchDocument();
    }, [id]);

    const fetchDocument = async () => {
        try {
            const res = await fetch(`/api/documents/${id}`);
            if (!res.ok) throw new Error('Document not found');
            const data = await res.json();
            setDoc(data.document);
            setEditContent(data.document.content);
            setEditTitle(data.document.title);
        } catch {
            setError('Document not found or access denied.');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`/api/documents/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: editTitle, content: editContent }),
            });
            if (!res.ok) throw new Error('Save failed');
            const data = await res.json();
            setDoc(data.document);
            setEditing(false);
        } catch {
            setError('Failed to save changes.');
        } finally {
            setSaving(false);
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        try {
            const res = await fetch(`/api/documents/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (!res.ok) throw new Error('Status update failed');
            const data = await res.json();
            setDoc(data.document);
        } catch {
            setError('Failed to update status.');
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to permanently delete this document?')) return;
        try {
            await fetch(`/api/documents/${id}`, { method: 'DELETE' });
            router.push('/dashboard/documents');
        } catch {
            setError('Failed to delete document.');
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(doc?.content || editContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const content = doc?.content || editContent;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${doc?.title || 'document'}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
            </div>
        );
    }

    if (error && !doc) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
                <AlertCircle className="mb-4 h-12 w-12 text-red-400" />
                <h2 className="text-lg font-medium text-white">{error}</h2>
                <Link
                    href="/dashboard/documents"
                    className="mt-4 inline-flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Documents
                </Link>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                    <Link
                        href="/dashboard/documents"
                        className="mb-3 inline-flex items-center gap-1.5 text-sm text-surface-400 transition-colors hover:text-white"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Documents
                    </Link>

                    {editing ? (
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xl font-bold text-white outline-none focus:border-primary-500"
                        />
                    ) : (
                        <h1 className="text-xl font-bold text-white sm:text-2xl">{doc?.title}</h1>
                    )}

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-surface-500">
                        <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {doc?.type}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Created {new Date(doc?.createdAt || '').toLocaleDateString()}
                        </span>
                        {(doc?.metadata as Record<string, unknown>)?.aiGenerated && (
                            <span className="flex items-center gap-1 text-primary-400">
                                <CheckCircle2 className="h-3 w-3" />
                                AI Generated
                            </span>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {/* Status selector */}
                    <select
                        value={doc?.status || ''}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="appearance-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white outline-none"
                    >
                        {statusOptions.map((s) => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </select>

                    <button
                        onClick={handleCopy}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-surface-400 transition-colors hover:bg-white/5 hover:text-white"
                        title="Copy to clipboard"
                    >
                        {copied ? <Check className="h-4 w-4 text-accent-500" /> : <Copy className="h-4 w-4" />}
                    </button>

                    <button
                        onClick={handleDownload}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-surface-400 transition-colors hover:bg-white/5 hover:text-white"
                        title="Download"
                    >
                        <Download className="h-4 w-4" />
                    </button>

                    {editing ? (
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-2 text-xs font-semibold text-white transition-all hover:bg-primary-500"
                        >
                            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                            Save
                        </button>
                    ) : (
                        <button
                            onClick={() => setEditing(true)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white transition-all hover:bg-white/10"
                        >
                            <Edit3 className="h-3.5 w-3.5" />
                            Edit
                        </button>
                    )}

                    <button
                        onClick={handleDelete}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-500/20 text-red-400 transition-colors hover:bg-red-500/10"
                        title="Delete"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Error banner */}
            {error && doc && (
                <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                </div>
            )}

            {/* Document content */}
            <div className="glass-card rounded-2xl p-6 sm:p-8">
                {editing ? (
                    <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="min-h-[60vh] w-full resize-none rounded-xl border border-white/10 bg-white/5 p-6 font-mono text-sm leading-relaxed text-surface-200 outline-none focus:border-primary-500"
                    />
                ) : (
                    <pre className="min-h-[40vh] whitespace-pre-wrap font-mono text-sm leading-relaxed text-surface-200">
                        {doc?.content}
                    </pre>
                )}
            </div>
        </div>
    );
}
