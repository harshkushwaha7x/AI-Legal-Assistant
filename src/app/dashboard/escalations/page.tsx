'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    UserCheck,
    Plus,
    Search,
    Filter,
    Clock,
    MoreVertical,
    Eye,
    Trash2,
    Loader2,
} from 'lucide-react';
import PriorityBadge from '@/components/escalation/PriorityBadge';
import { STATUS_CONFIG } from '@/lib/validations/escalation';

interface Escalation {
    id: string;
    subject: string;
    description: string;
    status: string;
    priority: number;
    assignedTo: string | null;
    createdAt: string;
}

export default function EscalationsPage() {
    const [escalations, setEscalations] = useState<Escalation[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [openMenu, setOpenMenu] = useState<string | null>(null);

    useEffect(() => {
        fetchEscalations();
    }, [filterStatus]);

    const fetchEscalations = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filterStatus) params.set('status', filterStatus);
            const res = await fetch(`/api/escalations?${params.toString()}`);
            const data = await res.json();
            setEscalations(data.escalations || []);
        } catch (error) {
            console.error('Failed to fetch escalations:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteEscalation = async (id: string) => {
        if (!confirm('Delete this escalation? This action cannot be undone.')) return;
        try {
            await fetch(`/api/escalations/${id}`, { method: 'DELETE' });
            setEscalations((prev) => prev.filter((e) => e.id !== id));
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    const filtered = escalations.filter((e) =>
        e.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Lawyer Escalations</h1>
                    <p className="mt-1 text-sm text-surface-400">
                        Escalate complex legal matters to qualified attorneys for professional advice.
                    </p>
                </div>
                <Link
                    href="/dashboard/escalations/new"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition-all hover:bg-primary-500"
                >
                    <Plus className="h-4 w-4" />
                    New Escalation
                </Link>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-500" />
                    <input
                        type="text"
                        placeholder="Search escalations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-surface-500 outline-none transition-all focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50"
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-500" />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="appearance-none rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-10 text-sm text-white outline-none transition-all focus:border-primary-500"
                    >
                        <option value="">All Statuses</option>
                        <option value="PENDING">Pending</option>
                        <option value="ASSIGNED">Assigned</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="CLOSED">Closed</option>
                    </select>
                </div>
            </div>

            {/* List */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="glass-card flex flex-col items-center justify-center rounded-xl py-20 text-center">
                    <UserCheck className="mb-4 h-14 w-14 text-surface-600" />
                    <h3 className="text-lg font-medium text-surface-300">
                        {escalations.length === 0 ? 'No escalations yet' : 'No matching escalations'}
                    </h3>
                    <p className="mt-1 max-w-sm text-sm text-surface-500">
                        {escalations.length === 0
                            ? 'Escalate complex legal matters to a qualified attorney.'
                            : 'Try adjusting your search or filters.'}
                    </p>
                    {escalations.length === 0 && (
                        <Link
                            href="/dashboard/escalations/new"
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-500"
                        >
                            <Plus className="h-4 w-4" />
                            Create Escalation
                        </Link>
                    )}
                </div>
            ) : (
                <div className="space-y-2">
                    {filtered.map((esc) => {
                        const statusCfg = STATUS_CONFIG[esc.status] || STATUS_CONFIG.PENDING;
                        return (
                            <div
                                key={esc.id}
                                className="glass-card group flex items-center gap-4 rounded-xl p-4 transition-all hover:-translate-y-0.5"
                            >
                                {/* Priority indicator */}
                                <div className={`h-10 w-1 shrink-0 rounded-full ${esc.priority >= 3 ? 'bg-red-500' :
                                        esc.priority >= 2 ? 'bg-orange-500' :
                                            esc.priority >= 1 ? 'bg-amber-500' : 'bg-surface-600'
                                    }`} />

                                <div className="flex-1 min-w-0">
                                    <Link
                                        href={`/dashboard/escalations/${esc.id}`}
                                        className="text-sm font-semibold text-white hover:text-primary-300 transition-colors truncate block"
                                    >
                                        {esc.subject}
                                    </Link>
                                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-surface-500">
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {new Date(esc.createdAt).toLocaleDateString()}
                                        </span>
                                        {esc.assignedTo && (
                                            <>
                                                <span>•</span>
                                                <span>Assigned to: {esc.assignedTo}</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <PriorityBadge priority={esc.priority} />

                                <span className={`rounded-lg px-2.5 py-1 text-xs font-medium ${esc.status === 'RESOLVED' || esc.status === 'CLOSED'
                                        ? 'bg-emerald-500/15 text-emerald-400'
                                        : esc.status === 'IN_PROGRESS'
                                            ? 'bg-violet-500/15 text-violet-400'
                                            : esc.status === 'ASSIGNED'
                                                ? 'bg-blue-500/15 text-blue-400'
                                                : 'bg-surface-500/15 text-surface-400'
                                    }`}>
                                    {statusCfg.label}
                                </span>

                                {/* Actions */}
                                <div className="relative">
                                    <button
                                        onClick={() => setOpenMenu(openMenu === esc.id ? null : esc.id)}
                                        className="flex h-8 w-8 items-center justify-center rounded-lg text-surface-500 transition-colors hover:bg-white/5 hover:text-white"
                                    >
                                        <MoreVertical className="h-4 w-4" />
                                    </button>
                                    {openMenu === esc.id && (
                                        <div className="absolute right-0 top-full z-10 mt-1 w-40 animate-fade-in rounded-xl border border-white/5 bg-surface-900 p-1 shadow-xl">
                                            <Link
                                                href={`/dashboard/escalations/${esc.id}`}
                                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-surface-300 hover:bg-white/5 hover:text-white"
                                            >
                                                <Eye className="h-4 w-4" />
                                                View Details
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    setOpenMenu(null);
                                                    deleteEscalation(esc.id);
                                                }}
                                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
