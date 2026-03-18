'use client';

import { useState, useMemo } from 'react';
import { GitBranch, Clock, FileText, ChevronDown, ChevronUp, ArrowLeftRight } from 'lucide-react';

interface VersionEntry {
    version: number;
    label: string;
    date: string;
    author: string;
    description: string;
    wordCount: number;
}

const MOCK_VERSIONS: VersionEntry[] = [
    { version: 5, label: 'v5.0', date: new Date(Date.now() - 3600 * 1000).toISOString(), author: 'You', description: 'Added indemnification clause', wordCount: 2340 },
    { version: 4, label: 'v4.0', date: new Date(Date.now() - 86400 * 1000).toISOString(), author: 'You', description: 'Revised liability section', wordCount: 2180 },
    { version: 3, label: 'v3.0', date: new Date(Date.now() - 172800 * 1000).toISOString(), author: 'You', description: 'Added governing law section', wordCount: 1950 },
    { version: 2, label: 'v2.0', date: new Date(Date.now() - 345600 * 1000).toISOString(), author: 'You', description: 'Updated parties and scope', wordCount: 1600 },
    { version: 1, label: 'v1.0', date: new Date(Date.now() - 604800 * 1000).toISOString(), author: 'You', description: 'Initial draft', wordCount: 1200 },
];

function formatTimeAgo(date: string): string {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}

interface VersionHistoryPanelProps {
    documentId?: string;
    onVersionSelect?: (version: number) => void;
    onCompare?: (versionA: number, versionB: number) => void;
}

export default function VersionHistoryPanel({
    onVersionSelect,
    onCompare,
}: VersionHistoryPanelProps) {
    const [versions] = useState<VersionEntry[]>(MOCK_VERSIONS);
    const [expandedVersion, setExpandedVersion] = useState<number | null>(null);
    const [compareMode, setCompareMode] = useState(false);
    const [compareSelection, setCompareSelection] = useState<number[]>([]);

    const latestVersion = versions[0];

    const handleVersionClick = (version: number) => {
        if (compareMode) {
            if (compareSelection.includes(version)) {
                setCompareSelection(compareSelection.filter((v) => v !== version));
            } else if (compareSelection.length < 2) {
                const newSelection = [...compareSelection, version];
                setCompareSelection(newSelection);
                if (newSelection.length === 2 && onCompare) {
                    onCompare(Math.min(...newSelection), Math.max(...newSelection));
                    setCompareMode(false);
                    setCompareSelection([]);
                }
            }
        } else {
            setExpandedVersion(expandedVersion === version ? null : version);
        }
    };

    return (
        <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <GitBranch className="h-4 w-4 text-primary-400" />
                    <h3 className="text-sm font-semibold text-white">Version History</h3>
                    <span className="text-[10px] text-surface-600">
                        {versions.length} versions
                    </span>
                </div>
                <button
                    onClick={() => {
                        setCompareMode(!compareMode);
                        setCompareSelection([]);
                    }}
                    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-medium transition-colors ${
                        compareMode
                            ? 'bg-primary-500/20 text-primary-400'
                            : 'text-surface-500 hover:text-surface-300'
                    }`}
                >
                    <ArrowLeftRight className="h-3 w-3" />
                    {compareMode ? 'Cancel' : 'Compare'}
                </button>
            </div>

            {compareMode && (
                <p className="mb-3 text-[10px] text-surface-500">
                    Select two versions to compare ({compareSelection.length}/2 selected)
                </p>
            )}

            <div className="space-y-0">
                {versions.map((v, index) => {
                    const isExpanded = expandedVersion === v.version;
                    const isSelected = compareSelection.includes(v.version);
                    const isLatest = index === 0;
                    const isLast = index === versions.length - 1;
                    const prevVersion = index < versions.length - 1 ? versions[index + 1] : null;
                    const wordDelta = prevVersion ? v.wordCount - prevVersion.wordCount : v.wordCount;

                    return (
                        <div key={v.version} className="relative">
                            {!isLast && (
                                <div className="absolute left-[13px] top-7 h-full w-px bg-white/5" />
                            )}
                            <button
                                onClick={() => handleVersionClick(v.version)}
                                className={`relative flex w-full items-start gap-3 rounded-lg px-2 py-2 text-left transition-colors ${
                                    isSelected
                                        ? 'bg-primary-500/10'
                                        : 'hover:bg-white/[3%]'
                                }`}
                            >
                                <div
                                    className={`relative z-10 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                                        isLatest
                                            ? 'bg-primary-500/15'
                                            : isSelected
                                            ? 'bg-primary-500/15'
                                            : 'bg-white/5'
                                    }`}
                                >
                                    <FileText className={`h-3.5 w-3.5 ${
                                        isLatest ? 'text-primary-400' : 'text-surface-500'
                                    }`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-medium text-white">{v.label}</span>
                                        {isLatest && (
                                            <span className="rounded bg-primary-500/15 px-1.5 py-0.5 text-[9px] font-medium text-primary-400">
                                                Current
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-0.5 text-[10px] text-surface-500 truncate">
                                        {v.description}
                                    </p>
                                    <div className="mt-1 flex items-center gap-3">
                                        <span className="flex items-center gap-1 text-[9px] text-surface-600">
                                            <Clock className="h-2.5 w-2.5" />
                                            {formatTimeAgo(v.date)}
                                        </span>
                                        <span className={`text-[9px] ${
                                            wordDelta > 0 ? 'text-green-500' : wordDelta < 0 ? 'text-red-400' : 'text-surface-600'
                                        }`}>
                                            {wordDelta > 0 ? '+' : ''}{wordDelta} words
                                        </span>
                                    </div>
                                </div>
                                {!compareMode && (
                                    isExpanded
                                        ? <ChevronUp className="mt-1 h-3 w-3 text-surface-600" />
                                        : <ChevronDown className="mt-1 h-3 w-3 text-surface-600" />
                                )}
                            </button>

                            {isExpanded && !compareMode && (
                                <div className="ml-10 mb-2 space-y-2 rounded-lg border border-white/5 bg-white/[2%] p-3">
                                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                                        <div>
                                            <span className="text-surface-600">Author</span>
                                            <p className="text-surface-300">{v.author}</p>
                                        </div>
                                        <div>
                                            <span className="text-surface-600">Words</span>
                                            <p className="text-surface-300">{v.wordCount.toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onVersionSelect?.(v.version);
                                        }}
                                        className="w-full rounded-md bg-white/5 py-1.5 text-[10px] font-medium text-surface-400 transition-colors hover:bg-white/10 hover:text-white"
                                    >
                                        Restore this version
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
