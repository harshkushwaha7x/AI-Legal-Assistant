'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    FileText,
    Plus,
    Search,
    Filter,
    Clock,
    MoreVertical,
    Eye,
    Trash2,
    Loader2,
    ShieldCheck,
    Home,
    Briefcase,
    Users,
    File,
} from 'lucide-react';

interface Document {
    id: string;
    title: string;
    type: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

const typeIcons: Record<string, React.ElementType> = {
    NDA: ShieldCheck,
    LEASE: Home,
    CONTRACT: FileText,
    EMPLOYMENT: Briefcase,
    PARTNERSHIP: Users,
    CUSTOM: File,
};

const typeLabels: Record<string, string> = {
    NDA: 'NDA',
    LEASE: 'Lease',
    CONTRACT: 'Service Agreement',
    EMPLOYMENT: 'Employment',
    PARTNERSHIP: 'Partnership',
    CUSTOM: 'Custom',
};

const statusColors: Record<string, string> = {
    DRAFT: 'bg-amber-500/15 text-amber-400',
    REVIEW: 'bg-violet-500/15 text-violet-400',
    FINAL: 'bg-emerald-500/15 text-emerald-400',
    ARCHIVED: 'bg-surface-500/15 text-surface-400',
};

export default function DocumentsPage() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('');
    const [openMenu, setOpenMenu] = useState<string | null>(null);

    useEffect(() => {
        fetchDocuments();
    }, [filterType]);

    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filterType) params.set('type', filterType);
            const res = await fetch(`/api/documents?${params.toString()}`);
            const data = await res.json();
            setDocuments(data.documents || []);
        } catch (error) {
            console.error('Failed to fetch documents:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteDocument = async (id: string) => {
        if (!confirm('Are you sure you want to delete this document?')) return;
        try {
            await fetch(`/api/documents/${id}`, { method: 'DELETE' });
            setDocuments((prev) => prev.filter((d) => d.id !== id));
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    const filtered = documents.filter((doc) =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Documents</h1>
                    <p className="mt-1 text-sm text-surface-400">
                        Generate and manage your legal documents.
                    </p>
                </div>
                <Link
                    href="/dashboard/documents/new"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition-all hover:bg-primary-500"
                >
                    <Plus className="h-4 w-4" />
                    New Document
                </Link>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-500" />
                    <input
                        type="text"
                        placeholder="Search documents..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-surface-500 outline-none transition-all focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50"
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-500" />
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="appearance-none rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-10 text-sm text-white outline-none transition-all focus:border-primary-500"
                    >
                        <option value="">All Types</option>
                        <option value="NDA">NDA</option>
                        <option value="LEASE">Lease</option>
                        <option value="CONTRACT">Service Agreement</option>
                        <option value="EMPLOYMENT">Employment</option>
                        <option value="PARTNERSHIP">Partnership</option>
                    </select>
                </div>
            </div>

            {/* Documents list */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="glass-card flex flex-col items-center justify-center rounded-xl py-20 text-center">
                    <FileText className="mb-4 h-14 w-14 text-surface-600" />
                    <h3 className="text-lg font-medium text-surface-300">
                        {documents.length === 0 ? 'No documents yet' : 'No matching documents'}
                    </h3>
                    <p className="mt-1 max-w-sm text-sm text-surface-500">
                        {documents.length === 0
                            ? 'Create your first legal document powered by AI.'
                            : 'Try adjusting your search or filters.'}
                    </p>
                    {documents.length === 0 && (
                        <Link
                            href="/dashboard/documents/new"
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-500"
                        >
                            <Plus className="h-4 w-4" />
                            Create Document
                        </Link>
                    )}
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map((doc) => {
                        const Icon = typeIcons[doc.type] || FileText;
                        return (
                            <div
                                key={doc.id}
                                className="glass-card group flex items-center gap-4 rounded-xl p-4 transition-all hover:-translate-y-0.5"
                            >
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-500/10">
                                    <Icon className="h-5 w-5 text-primary-400" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <Link
                                        href={`/dashboard/documents/${doc.id}`}
                                        className="text-sm font-semibold text-white hover:text-primary-300 transition-colors"
                                    >
                                        {doc.title}
                                    </Link>
                                    <div className="mt-1 flex items-center gap-3 text-xs text-surface-500">
                                        <span>{typeLabels[doc.type] || doc.type}</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {new Date(doc.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                <span className={`rounded-lg px-2.5 py-1 text-xs font-medium ${statusColors[doc.status] || ''}`}>
                                    {doc.status}
                                </span>

                                {/* Actions dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setOpenMenu(openMenu === doc.id ? null : doc.id)}
                                        className="flex h-8 w-8 items-center justify-center rounded-lg text-surface-500 transition-colors hover:bg-white/5 hover:text-white"
                                    >
                                        <MoreVertical className="h-4 w-4" />
                                    </button>
                                    {openMenu === doc.id && (
                                        <div className="absolute right-0 top-full z-10 mt-1 w-40 animate-fade-in rounded-xl border border-white/5 bg-surface-900 p-1 shadow-xl">
                                            <Link
                                                href={`/dashboard/documents/${doc.id}`}
                                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-surface-300 hover:bg-white/5 hover:text-white"
                                            >
                                                <Eye className="h-4 w-4" />
                                                View
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    setOpenMenu(null);
                                                    deleteDocument(doc.id);
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
