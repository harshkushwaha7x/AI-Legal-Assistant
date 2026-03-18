'use client';

import { useState, useCallback } from 'react';
import { Upload, X, FileText, AlertCircle, Check } from 'lucide-react';

interface MultiFileUploadProps {
    maxFiles?: number;
    maxSizeMB?: number;
    acceptedTypes?: string[];
    onFilesSelected: (files: File[]) => void;
}

interface FileEntry {
    file: File;
    id: string;
    status: 'pending' | 'uploading' | 'complete' | 'error';
    error?: string;
}

function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
}

export default function MultiFileUpload({
    maxFiles = 5,
    maxSizeMB = 10,
    acceptedTypes = ['.pdf', '.docx', '.doc', '.txt'],
    onFilesSelected,
}: MultiFileUploadProps) {
    const [files, setFiles] = useState<FileEntry[]>([]);
    const [dragActive, setDragActive] = useState(false);

    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    const addFiles = useCallback(
        (newFiles: FileList | File[]) => {
            const fileArray = Array.from(newFiles);
            const entries: FileEntry[] = [];

            for (const file of fileArray) {
                if (files.length + entries.length >= maxFiles) break;

                if (file.size > maxSizeBytes) {
                    entries.push({
                        file,
                        id: `${file.name}-${Date.now()}`,
                        status: 'error',
                        error: `File exceeds ${maxSizeMB}MB limit`,
                    });
                    continue;
                }

                entries.push({
                    file,
                    id: `${file.name}-${Date.now()}-${Math.random()}`,
                    status: 'pending',
                });
            }

            const updated = [...files, ...entries];
            setFiles(updated);
            onFilesSelected(updated.filter((e) => e.status !== 'error').map((e) => e.file));
        },
        [files, maxFiles, maxSizeBytes, maxSizeMB, onFilesSelected]
    );

    const removeFile = (id: string) => {
        const updated = files.filter((f) => f.id !== id);
        setFiles(updated);
        onFilesSelected(updated.filter((e) => e.status !== 'error').map((e) => e.file));
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);
        if (e.dataTransfer.files.length > 0) {
            addFiles(e.dataTransfer.files);
        }
    };

    return (
        <div className="space-y-3">
            {/* Drop zone */}
            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 transition-colors ${
                    dragActive
                        ? 'border-primary-500 bg-primary-500/5'
                        : 'border-white/10 bg-white/[2%] hover:border-white/20'
                }`}
            >
                <Upload className={`mb-2 h-6 w-6 ${dragActive ? 'text-primary-400' : 'text-surface-600'}`} />
                <p className="text-xs text-surface-400">
                    Drag and drop files here, or{' '}
                    <label className="cursor-pointer text-primary-400 hover:underline">
                        browse
                        <input
                            type="file"
                            multiple
                            accept={acceptedTypes.join(',')}
                            onChange={(e) => e.target.files && addFiles(e.target.files)}
                            className="hidden"
                        />
                    </label>
                </p>
                <p className="mt-1 text-[10px] text-surface-600">
                    {acceptedTypes.join(', ')} -- Max {maxSizeMB}MB per file -- Up to {maxFiles} files
                </p>
            </div>

            {/* File list */}
            {files.length > 0 && (
                <div className="space-y-1.5">
                    {files.map((entry) => (
                        <div
                            key={entry.id}
                            className={`flex items-center gap-3 rounded-lg border px-3 py-2 ${
                                entry.status === 'error'
                                    ? 'border-red-500/20 bg-red-500/5'
                                    : 'border-white/5 bg-white/[2%]'
                            }`}
                        >
                            <FileText className={`h-4 w-4 shrink-0 ${
                                entry.status === 'error' ? 'text-red-400' : 'text-surface-500'
                            }`} />
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-xs text-white">{entry.file.name}</p>
                                <p className={`text-[10px] ${
                                    entry.status === 'error' ? 'text-red-400' : 'text-surface-600'
                                }`}>
                                    {entry.status === 'error' ? entry.error : formatSize(entry.file.size)}
                                </p>
                            </div>
                            {entry.status === 'error' && (
                                <AlertCircle className="h-3.5 w-3.5 shrink-0 text-red-400" />
                            )}
                            {entry.status === 'complete' && (
                                <Check className="h-3.5 w-3.5 shrink-0 text-green-400" />
                            )}
                            <button
                                onClick={() => removeFile(entry.id)}
                                className="shrink-0 text-surface-600 hover:text-surface-300 transition-colors"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
