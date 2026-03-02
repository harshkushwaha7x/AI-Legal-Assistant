'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Building2,
    FileText,
    Plus,
    Copy,
    Check,
    ArrowUpRight,
    Sparkles,
} from 'lucide-react';

const TEMPLATES = [
    {
        id: 'nda-mutual',
        name: 'Mutual NDA',
        category: 'NDA',
        description: 'Bilateral non-disclosure agreement for sharing confidential information between two parties.',
        fields: ['Party A Name', 'Party B Name', 'Effective Date', 'Duration', 'Governing State'],
        popular: true,
    },
    {
        id: 'nda-unilateral',
        name: 'One-Way NDA',
        category: 'NDA',
        description: 'Unilateral NDA where one party discloses confidential information to the other.',
        fields: ['Disclosing Party', 'Receiving Party', 'Effective Date', 'Duration'],
        popular: false,
    },
    {
        id: 'employment-offer',
        name: 'Employment Offer Letter',
        category: 'Employment',
        description: 'Standard offer letter for full-time employment with compensation and benefits details.',
        fields: ['Company Name', 'Employee Name', 'Position', 'Start Date', 'Salary', 'Benefits'],
        popular: true,
    },
    {
        id: 'independent-contractor',
        name: 'Independent Contractor Agreement',
        category: 'Employment',
        description: 'Agreement for engaging independent contractors with scope of work and payment terms.',
        fields: ['Company Name', 'Contractor Name', 'Services', 'Payment Terms', 'Duration'],
        popular: false,
    },
    {
        id: 'residential-lease',
        name: 'Residential Lease',
        category: 'Lease',
        description: 'Standard residential rental agreement covering rent, security deposit, and tenant responsibilities.',
        fields: ['Landlord Name', 'Tenant Name', 'Property Address', 'Monthly Rent', 'Lease Term'],
        popular: true,
    },
    {
        id: 'commercial-lease',
        name: 'Commercial Lease',
        category: 'Lease',
        description: 'Commercial property lease for office, retail, or industrial space.',
        fields: ['Landlord Name', 'Tenant Company', 'Property Address', 'Monthly Rent', 'Lease Term', 'Permitted Use'],
        popular: false,
    },
    {
        id: 'service-agreement',
        name: 'Service Agreement',
        category: 'Contract',
        description: 'General service agreement defining scope, payment, and liability for professional services.',
        fields: ['Provider Name', 'Client Name', 'Services', 'Payment Terms', 'Start Date'],
        popular: true,
    },
    {
        id: 'partnership-agreement',
        name: 'Partnership Agreement',
        category: 'Partnership',
        description: 'Agreement establishing a business partnership with profit sharing and responsibilities.',
        fields: ['Partner A', 'Partner B', 'Business Name', 'Profit Split', 'Capital Contributions'],
        popular: false,
    },
];

const CATEGORIES = ['All', 'NDA', 'Employment', 'Lease', 'Contract', 'Partnership'];

export default function TemplatesPage() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const filtered =
        selectedCategory === 'All'
            ? TEMPLATES
            : TEMPLATES.filter((t) => t.category === selectedCategory);

    const handleUseTemplate = (templateId: string) => {
        setCopiedId(templateId);
        setTimeout(() => setCopiedId(null), 1500);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Document Templates</h1>
                    <p className="mt-1 text-sm text-surface-400">
                        Pre-built legal document templates. Select one to auto-fill and generate.
                    </p>
                </div>
                <Link
                    href="/dashboard/documents/new"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition-all hover:bg-primary-500"
                >
                    <Plus className="h-4 w-4" />
                    Custom Document
                </Link>
            </div>

            {/* Category filter */}
            <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${selectedCategory === cat
                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
                                : 'bg-white/5 text-surface-400 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Templates grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((template) => (
                    <div key={template.id} className="glass-card group relative rounded-xl p-5 transition-all hover:-translate-y-0.5">
                        {template.popular && (
                            <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-lg bg-amber-500/15 px-2 py-0.5 text-[10px] font-medium text-amber-400">
                                <Sparkles className="h-2.5 w-2.5" />
                                Popular
                            </span>
                        )}

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/10">
                            <FileText className="h-5 w-5 text-primary-400" />
                        </div>

                        <h3 className="mt-3 font-semibold text-white">{template.name}</h3>
                        <span className="mt-0.5 inline-block text-[11px] text-primary-400">{template.category}</span>
                        <p className="mt-2 text-xs leading-relaxed text-surface-400 line-clamp-2">
                            {template.description}
                        </p>

                        {/* Fields preview */}
                        <div className="mt-3 flex flex-wrap gap-1">
                            {template.fields.slice(0, 3).map((field) => (
                                <span key={field} className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-surface-500">
                                    {field}
                                </span>
                            ))}
                            {template.fields.length > 3 && (
                                <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-surface-500">
                                    +{template.fields.length - 3} more
                                </span>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="mt-4 flex items-center gap-2">
                            <Link
                                href={`/dashboard/documents/new?template=${template.id}`}
                                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary-600 py-2 text-xs font-semibold text-white transition-all hover:bg-primary-500"
                            >
                                <FileText className="h-3 w-3" />
                                Use Template
                                <ArrowUpRight className="h-3 w-3" />
                            </Link>
                            <button
                                onClick={() => handleUseTemplate(template.id)}
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-surface-400 transition-all hover:bg-white/5 hover:text-white"
                                title="Copy template ID"
                            >
                                {copiedId === template.id ? (
                                    <Check className="h-3 w-3 text-emerald-400" />
                                ) : (
                                    <Copy className="h-3 w-3" />
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
