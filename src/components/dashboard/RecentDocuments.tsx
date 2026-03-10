'use client';

import { useState, useEffect } from 'react';
import { FileText, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface RecentDocument {
    id: string;
    title: string;
    type: string;
    status: string;
    updatedAt: string;
}

const STATUS_COLORS: Record<string, string> = {
    DRAFT: 'bg-surface-500/20 text-surface-400',
    REVIEW: 'bg-amber-500/15 text-amber-400',
    FINAL: 'bg-green-500/15 text-green-400',
    ARCHIVED: 'bg-surface-600/20 text-surface-600',
};

export default function RecentDocuments() {
    const [documents, setDocuments] = useState<RecentDocument[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDocuments() {
            try {
                const res = await fetch('/api/documents?limit=5&sort=updatedAt');
                if (res.ok) {
                    const data = await res.json();
                    setDocuments(data.documents || []);
                }
            } catch {
                // Silently fail for dashboard widget
            } finally {
                setLoading(false);
            }
        }
        fetchDocuments();
    }, []);

    if (loading) {
        return (
            <div className="glass-card rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-white">Recent Documents</h3>
                <div className="mt-4 space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-12 animate-pulse rounded-lg bg-white/5" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Recent Documents</h3>
                <Link
                    href="/dashboard/documents"
                    className="flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300"
                >
                    View all <ArrowRight className="h-3 w-3" />
                </Link>
            </div>

            {documents.length === 0 ? (
                <div className="mt-6 flex flex-col items-center py-4 text-center">
                    <FileText className="h-8 w-8 text-surface-600" />
                    <p className="mt-2 text-xs text-surface-500">No documents yet</p>
                    <Link
                        href="/dashboard/documents"
                        className="mt-2 text-xs text-primary-400 hover:text-primary-300"
                    >
                        Create your first document
                    </Link>
                </div>
            ) : (
                <div className="mt-4 space-y-2">
                    {documents.map((doc) => (
                        <Link
                            key={doc.id}
                            href={`/dashboard/documents/${doc.id}`}
                            className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-white/[3%]"
                        >
                            <FileText className="h-4 w-4 shrink-0 text-primary-400" />
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm text-white">{doc.title}</p>
                                <p className="flex items-center gap-1.5 text-[10px] text-surface-500">
                                    <Clock className="h-2.5 w-2.5" />
                                    {new Date(doc.updatedAt).toLocaleDateString()}
                                </p>
                            </div>
                            <span className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${STATUS_COLORS[doc.status] || STATUS_COLORS.DRAFT}`}>
                                {doc.status}
                            </span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
