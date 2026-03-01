'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    Trash2,
    Loader2,
    UserCheck,
    AlertCircle,
    Clock,
    Calendar,
    User,
    FileText,
    Edit3,
    Save,
    X,
} from 'lucide-react';
import EscalationStatusTracker from '@/components/escalation/EscalationStatusTracker';
import PriorityBadge from '@/components/escalation/PriorityBadge';

interface EscalationData {
    id: string;
    subject: string;
    description: string;
    status: string;
    priority: number;
    assignedTo: string | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
}

export default function EscalationDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [escalation, setEscalation] = useState<EscalationData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingNotes, setEditingNotes] = useState(false);
    const [notes, setNotes] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchEscalation();
    }, [id]);

    const fetchEscalation = async () => {
        try {
            const res = await fetch(`/api/escalations/${id}`);
            if (!res.ok) throw new Error('Not found');
            const data = await res.json();
            setEscalation(data.escalation);
            setNotes(data.escalation.notes || '');
        } catch {
            setError('Escalation not found or access denied.');
        } finally {
            setLoading(false);
        }
    };

    const updateEscalation = async (updates: Record<string, unknown>) => {
        setSaving(true);
        try {
            const res = await fetch(`/api/escalations/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
            const data = await res.json();
            if (res.ok) setEscalation(data.escalation);
        } catch (err) {
            console.error('Update failed:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        await updateEscalation({ status: newStatus });
    };

    const handleSaveNotes = async () => {
        await updateEscalation({ notes });
        setEditingNotes(false);
    };

    const handleDelete = async () => {
        if (!confirm('Delete this escalation permanently?')) return;
        try {
            await fetch(`/api/escalations/${id}`, { method: 'DELETE' });
            router.push('/dashboard/escalations');
        } catch {
            setError('Failed to delete.');
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
            </div>
        );
    }

    if (error && !escalation) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
                <AlertCircle className="mb-4 h-12 w-12 text-red-400" />
                <h2 className="text-lg font-medium text-white">{error}</h2>
                <Link
                    href="/dashboard/escalations"
                    className="mt-4 inline-flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Escalations
                </Link>
            </div>
        );
    }

    if (!escalation) return null;

    const statusActions = [
        { from: 'PENDING', to: 'ASSIGNED', label: 'Mark as Assigned' },
        { from: 'ASSIGNED', to: 'IN_PROGRESS', label: 'Start Review' },
        { from: 'IN_PROGRESS', to: 'RESOLVED', label: 'Mark Resolved' },
        { from: 'RESOLVED', to: 'CLOSED', label: 'Close' },
    ];

    const nextAction = statusActions.find((a) => a.from === escalation.status);

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <Link
                        href="/dashboard/escalations"
                        className="mb-3 inline-flex items-center gap-1.5 text-sm text-surface-400 transition-colors hover:text-white"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Escalations
                    </Link>
                    <h1 className="text-xl font-bold text-white sm:text-2xl">{escalation.subject}</h1>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-surface-500">
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Created {new Date(escalation.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Updated {new Date(escalation.updatedAt).toLocaleDateString()}
                        </span>
                        <PriorityBadge priority={escalation.priority} size="md" />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {nextAction && (
                        <button
                            onClick={() => handleStatusChange(nextAction.to)}
                            disabled={saving}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-primary-500 disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UserCheck className="h-3.5 w-3.5" />}
                            {nextAction.label}
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

            {/* Status Tracker */}
            <div className="glass-card flex items-center justify-center rounded-2xl p-6 overflow-x-auto">
                <EscalationStatusTracker currentStatus={escalation.status} />
            </div>

            {/* Description */}
            <div className="glass-card rounded-2xl p-6">
                <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                    <FileText className="h-4 w-4 text-primary-400" />
                    Description
                </h2>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-surface-300">
                    {escalation.description}
                </p>
            </div>

            {/* Assignment Info */}
            <div className="glass-card rounded-2xl p-6">
                <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                    <User className="h-4 w-4 text-primary-400" />
                    Assignment
                </h2>
                {escalation.assignedTo ? (
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-500/10 text-sm font-bold text-primary-400">
                            {escalation.assignedTo.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white">{escalation.assignedTo}</p>
                            <p className="text-xs text-surface-500">Assigned Attorney</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-surface-500 italic">
                        Not yet assigned. An attorney will be assigned to review your case.
                    </p>
                )}
            </div>

            {/* Notes */}
            <div className="glass-card rounded-2xl p-6">
                <div className="mb-3 flex items-center justify-between">
                    <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
                        <Edit3 className="h-4 w-4 text-primary-400" />
                        Notes
                    </h2>
                    {!editingNotes ? (
                        <button
                            onClick={() => setEditingNotes(true)}
                            className="text-xs text-primary-400 hover:text-primary-300"
                        >
                            Edit
                        </button>
                    ) : (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleSaveNotes}
                                disabled={saving}
                                className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300"
                            >
                                <Save className="h-3 w-3" />
                                Save
                            </button>
                            <button
                                onClick={() => {
                                    setEditingNotes(false);
                                    setNotes(escalation.notes || '');
                                }}
                                className="text-xs text-surface-500 hover:text-surface-300"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    )}
                </div>

                {editingNotes ? (
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={4}
                        placeholder="Add internal notes about this escalation..."
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-surface-500 outline-none transition-all focus:border-primary-500 resize-none"
                    />
                ) : (
                    <p className="whitespace-pre-wrap text-sm text-surface-400">
                        {escalation.notes || 'No notes yet. Click Edit to add notes.'}
                    </p>
                )}
            </div>
        </div>
    );
}
