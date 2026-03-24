'use client';

import { useMemo, useState } from 'react';
import { ClipboardCheck, Check, Circle, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import {
    type ComplianceChecklist,
    toggleItem,
    getComplianceScore,
    getItemsByCategory,
    getIncompleteRequired,
} from '@/lib/compliance-checklist';

interface ComplianceChecklistPanelProps {
    checklist: ComplianceChecklist;
    onChange: (checklist: ComplianceChecklist) => void;
}

const SEVERITY_STYLES = {
    required: { badge: 'bg-red-500/10 text-red-400', dot: 'bg-red-500' },
    recommended: { badge: 'bg-amber-500/10 text-amber-400', dot: 'bg-amber-500' },
    optional: { badge: 'bg-surface-500/10 text-surface-400', dot: 'bg-surface-500' },
};

export default function ComplianceChecklistPanel({
    checklist,
    onChange,
}: ComplianceChecklistPanelProps) {
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

    const score = useMemo(() => getComplianceScore(checklist), [checklist]);
    const grouped = useMemo(() => getItemsByCategory(checklist), [checklist]);
    const incompleteRequired = useMemo(() => getIncompleteRequired(checklist), [checklist]);
    const categories = Object.keys(grouped);

    const toggleCategory = (cat: string) => {
        setExpandedCategories((prev) => {
            const next = new Set(prev);
            next.has(cat) ? next.delete(cat) : next.add(cat);
            return next;
        });
    };

    const handleToggle = (itemId: string) => {
        onChange(toggleItem(checklist, itemId));
    };

    const scoreColor =
        score >= 80 ? 'text-emerald-400' :
        score >= 50 ? 'text-amber-400' : 'text-red-400';

    const scoreBarColor =
        score >= 80 ? 'bg-emerald-500' :
        score >= 50 ? 'bg-amber-500' : 'bg-red-500';

    return (
        <div className="glass-card rounded-2xl p-5 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <ClipboardCheck className="h-4 w-4 text-primary-400" />
                    <h3 className="text-sm font-semibold text-white">Compliance Checklist</h3>
                </div>
                <span className={`text-lg font-bold ${scoreColor}`}>{score}%</span>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${scoreBarColor}`}
                    style={{ width: `${score}%` }}
                />
            </div>

            {/* Warning for incomplete required */}
            {incompleteRequired.length > 0 && (
                <div className="flex items-center gap-2 rounded-lg bg-red-500/5 px-3 py-2">
                    <AlertTriangle className="h-3.5 w-3.5 text-red-400 shrink-0" />
                    <span className="text-[10px] text-red-300">
                        {incompleteRequired.length} required item{incompleteRequired.length > 1 ? 's' : ''} remaining
                    </span>
                </div>
            )}

            {/* Category groups */}
            <div className="space-y-2">
                {categories.map((cat) => {
                    const items = grouped[cat];
                    const isExpanded = expandedCategories.has(cat);
                    const completedCount = items.filter((i) => i.checked).length;

                    return (
                        <div key={cat} className="rounded-lg border border-white/5">
                            <button
                                onClick={() => toggleCategory(cat)}
                                className="flex w-full items-center gap-3 px-3 py-2 text-left"
                            >
                                <span className="flex-1 text-xs font-medium text-surface-300">
                                    {cat}
                                </span>
                                <span className="text-[9px] text-surface-600">
                                    {completedCount}/{items.length}
                                </span>
                                {isExpanded ? (
                                    <ChevronUp className="h-3 w-3 text-surface-600" />
                                ) : (
                                    <ChevronDown className="h-3 w-3 text-surface-600" />
                                )}
                            </button>

                            {isExpanded && (
                                <div className="border-t border-white/5 px-3 py-2 space-y-1.5">
                                    {items.map((item) => {
                                        const severity = SEVERITY_STYLES[item.severity];
                                        return (
                                            <label
                                                key={item.id}
                                                className="flex items-start gap-2.5 rounded-md px-2 py-1.5 cursor-pointer hover:bg-white/[2%] transition-colors"
                                            >
                                                <button
                                                    onClick={() => handleToggle(item.id)}
                                                    className="mt-0.5 shrink-0"
                                                >
                                                    {item.checked ? (
                                                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                                                    ) : (
                                                        <Circle className="h-3.5 w-3.5 text-surface-600" />
                                                    )}
                                                </button>
                                                <div className="flex-1 min-w-0">
                                                    <span className={`text-[11px] ${
                                                        item.checked ? 'text-surface-500 line-through' : 'text-white'
                                                    }`}>
                                                        {item.label}
                                                    </span>
                                                    <p className="text-[9px] text-surface-600 mt-0.5">
                                                        {item.description}
                                                    </p>
                                                </div>
                                                <span className={`shrink-0 rounded px-1.5 py-0.5 text-[8px] ${severity.badge}`}>
                                                    {item.severity}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
