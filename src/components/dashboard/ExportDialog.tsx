'use client';

import { useState, useMemo } from 'react';
import { Download, FileSpreadsheet, FileJson, FileText, Loader2 } from 'lucide-react';
import { toCSV, toJSON, generateFilename, estimateExportSize, type ExportColumn } from '@/lib/data-export';

type ExportFormat = 'csv' | 'json';

interface ExportDialogProps {
    data: Record<string, unknown>[];
    columns: ExportColumn[];
    filenamePrefix?: string;
    onExport?: (format: ExportFormat) => void;
}

export default function ExportDialog({
    data,
    columns,
    filenamePrefix = 'export',
    onExport,
}: ExportDialogProps) {
    const [format, setFormat] = useState<ExportFormat>('csv');
    const [isExporting, setIsExporting] = useState(false);

    const preview = useMemo(() => {
        if (format === 'csv') return toCSV(data.slice(0, 3), columns);
        return toJSON(data.slice(0, 3));
    }, [format, data, columns]);

    const fullContent = useMemo(() => {
        if (format === 'csv') return toCSV(data, columns);
        return toJSON(data);
    }, [format, data, columns]);

    const size = useMemo(() => estimateExportSize(fullContent), [fullContent]);
    const filename = useMemo(() => generateFilename(filenamePrefix, format), [filenamePrefix, format]);

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const mimeType = format === 'csv' ? 'text/csv' : 'application/json';
            const blob = new Blob([fullContent], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
            onExport?.(format);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="glass-card rounded-2xl p-5 space-y-4">
            {/* Header */}
            <div className="flex items-center gap-2">
                <Download className="h-4 w-4 text-primary-400" />
                <h3 className="text-sm font-semibold text-white">Export Data</h3>
            </div>

            {/* Format selector */}
            <div className="flex gap-2">
                <button
                    onClick={() => setFormat('csv')}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors ${
                        format === 'csv'
                            ? 'bg-primary-500/10 text-primary-400 ring-1 ring-primary-500/30'
                            : 'bg-white/5 text-surface-400 hover:bg-white/10'
                    }`}
                >
                    <FileSpreadsheet className="h-3.5 w-3.5" />
                    CSV
                </button>
                <button
                    onClick={() => setFormat('json')}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors ${
                        format === 'json'
                            ? 'bg-primary-500/10 text-primary-400 ring-1 ring-primary-500/30'
                            : 'bg-white/5 text-surface-400 hover:bg-white/10'
                    }`}
                >
                    <FileJson className="h-3.5 w-3.5" />
                    JSON
                </button>
            </div>

            {/* Info bar */}
            <div className="flex items-center gap-4 text-[10px] text-surface-500">
                <span>{data.length} record{data.length !== 1 ? 's' : ''}</span>
                <span>{size.formatted}</span>
                <span className="truncate text-surface-600">{filename}</span>
            </div>

            {/* Preview */}
            <div className="max-h-32 overflow-auto rounded-lg border border-white/5 bg-[#0d1117] p-3 font-mono text-[10px] text-surface-400">
                <pre className="whitespace-pre-wrap">{preview}</pre>
                {data.length > 3 && (
                    <p className="mt-2 text-surface-700">... and {data.length - 3} more rows</p>
                )}
            </div>

            {/* Export button */}
            <button
                onClick={handleExport}
                disabled={isExporting || data.length === 0}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 py-2.5 text-xs font-medium text-white hover:bg-primary-500 disabled:opacity-40 transition-colors"
            >
                {isExporting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                    <Download className="h-3.5 w-3.5" />
                )}
                Download {format.toUpperCase()}
            </button>
        </div>
    );
}
