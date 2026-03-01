'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    ArrowRight,
    UserCheck,
    AlertCircle,
    X,
    Flag,
    AlertTriangle,
} from 'lucide-react';
import { PRIORITY_LABELS } from '@/lib/validations/escalation';

export default function NewEscalationPage() {
    const router = useRouter();
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isValid = subject.trim().length >= 3 && description.trim().length >= 20;

    const handleSubmit = async () => {
        if (!isValid || submitting) return;
        setError(null);
        setSubmitting(true);

        try {
            const res = await fetch('/api/escalations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subject, description, priority }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to create escalation');

            router.push(`/dashboard/escalations/${data.escalation.id}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
            setSubmitting(false);
        }
    };

    const priorityOptions = [
        { value: 0, label: 'Low', desc: 'General question or non-urgent matter', icon: Flag, color: 'border-surface-600 hover:border-surface-400' },
        { value: 1, label: 'Medium', desc: 'Needs attention within a week', icon: Flag, color: 'border-amber-600/30 hover:border-amber-500' },
        { value: 2, label: 'High', desc: 'Time-sensitive matter requiring prompt review', icon: AlertTriangle, color: 'border-orange-600/30 hover:border-orange-500' },
        { value: 3, label: 'Urgent', desc: 'Critical issue needing immediate attention', icon: AlertTriangle, color: 'border-red-600/30 hover:border-red-500' },
    ];

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            {/* Header */}
            <div>
                <Link
                    href="/dashboard/escalations"
                    className="mb-4 inline-flex items-center gap-1.5 text-sm text-surface-400 transition-colors hover:text-white"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Escalations
                </Link>
                <h1 className="text-2xl font-bold text-white">New Escalation</h1>
                <p className="mt-1 text-surface-400">
                    Describe your legal matter and we&apos;ll connect you with a qualified attorney.
                </p>
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

            <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6">
                {/* Subject */}
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-surface-300">
                        Subject <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g., Employment contract dispute with former employer"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-surface-500 outline-none transition-all focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50"
                    />
                </div>

                {/* Priority */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-surface-300">Priority</label>
                    <div className="grid grid-cols-2 gap-2">
                        {priorityOptions.map((opt) => {
                            const Icon = opt.icon;
                            return (
                                <button
                                    key={opt.value}
                                    onClick={() => setPriority(opt.value)}
                                    className={`flex items-start gap-3 rounded-xl border p-3 text-left transition-all ${priority === opt.value
                                            ? 'border-primary-500 bg-primary-500/5'
                                            : `${opt.color} bg-white/[0.02]`
                                        }`}
                                >
                                    <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${priority === opt.value ? 'text-primary-400' : 'text-surface-500'
                                        }`} />
                                    <div>
                                        <p className={`text-sm font-medium ${priority === opt.value ? 'text-primary-300' : 'text-white'
                                            }`}>{opt.label}</p>
                                        <p className="text-[11px] text-surface-500">{opt.desc}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Description */}
                <div>
                    <div className="mb-1.5 flex items-center justify-between">
                        <label className="text-sm font-medium text-surface-300">
                            Description <span className="text-red-400">*</span>
                        </label>
                        <span className={`text-xs ${description.length < 20 ? 'text-red-400' : 'text-surface-500'}`}>
                            {description.length} chars {description.length < 20 ? '(min 20)' : ''}
                        </span>
                    </div>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Provide as much detail as possible about your legal situation, including relevant dates, parties involved, and what outcome you're seeking..."
                        rows={8}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-surface-500 outline-none transition-all focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 resize-none"
                    />
                </div>

                {/* Submit */}
                <div className="flex items-center justify-between border-t border-white/5 pt-6">
                    <div className="flex items-center gap-2 text-xs text-surface-500">
                        <UserCheck className="h-3.5 w-3.5 text-primary-400" />
                        An attorney will review your request
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={!isValid || submitting}
                        className="group inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition-all hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <UserCheck className="h-4 w-4" />
                        Submit Escalation
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                </div>
            </div>
        </div>
    );
}
