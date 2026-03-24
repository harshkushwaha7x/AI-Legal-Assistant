'use client';

import { useState } from 'react';
import { Upload, FileText, X, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

interface FileUploadZoneProps {
    onUpload: (files: File[]) => void;
    accept?: string;
    maxSizeMB?: number;
    maxFiles?: number;
    multiple?: boolean;
}

interface UploadedFile {
    file: File;
    status: 'pending' | 'uploading' | 'success' | 'error';
    error?: string;
}

export default function FileUploadZone({
    onUpload,
    accept = '.pdf,.doc,.docx,.txt',
    maxSizeMB = 10,
    maxFiles = 5,
    multiple = true,
}: FileUploadZoneProps) {
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [dragActive, setDragActive] = useState(false);

    const validateFile = (file: File): string | null => {
        if (file.size > maxSizeMB * 1024 * 1024) {
            return `File exceeds ${maxSizeMB}MB limit`;
        }
        return null;
    };

    const addFiles = (newFiles: FileList | File[]) => {
        const fileArray = Array.from(newFiles);
        const remaining = maxFiles - files.length;

        const validated: UploadedFile[] = fileArray.slice(0, remaining).map((file) => {
            const error = validateFile(file);
            return {
                file,
                status: error ? 'error' as const : 'pending' as const,
                error: error || undefined,
            };
        });

        const updated = [...files, ...validated];
        setFiles(updated);

        const valid = validated.filter((f) => f.status === 'pending').map((f) => f.file);
        if (valid.length > 0) onUpload(valid);
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(e.type === 'dragenter' || e.type === 'dragover');
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files.length > 0) {
            addFiles(e.dataTransfer.files);
        }
    };

    return (
        <div className="space-y-3">
            {/* Drop zone */}
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 transition-colors ${
                    dragActive
                        ? 'border-primary-500 bg-primary-500/5'
                        : 'border-white/10 bg-white/[2%] hover:border-white/20'
                } ${files.length >= maxFiles ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
                onClick={() => {
                    if (files.length < maxFiles) {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = accept;
                        input.multiple = multiple;
                        input.onchange = (e) => {
                            const target = e.target as HTMLInputElement;
                            if (target.files) addFiles(target.files);
                        };
                        input.click();
                    }
                }}
            >
                <Upload className={`h-6 w-6 mb-2 ${dragActive ? 'text-primary-400' : 'text-surface-600'}`} />
                <p className="text-xs text-surface-300">
                    {dragActive ? 'Drop files here' : 'Drag & drop or click to upload'}
                </p>
                <p className="mt-1 text-[10px] text-surface-600">
                    {accept.replace(/\./g, '').toUpperCase()} — Max {maxSizeMB}MB — Up to {maxFiles} files
                </p>
            </div>

            {/* File list */}
            {files.length > 0 && (
                <div className="space-y-1.5">
                    {files.map((item, i) => (
                        <div
                            key={`${item.file.name}-${i}`}
                            className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/[2%] px-3 py-2"
                        >
                            <FileText className="h-3.5 w-3.5 text-surface-500 shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-white truncate">{item.file.name}</p>
                                <p className="text-[9px] text-surface-600">
                                    {(item.file.size / 1024).toFixed(1)} KB
                                </p>
                            </div>
                            {item.status === 'uploading' && <Loader2 className="h-3 w-3 text-blue-400 animate-spin" />}
                            {item.status === 'success' && <CheckCircle2 className="h-3 w-3 text-emerald-400" />}
                            {item.status === 'error' && (
                                <span className="flex items-center gap-1 text-[9px] text-red-400">
                                    <AlertCircle className="h-3 w-3" />
                                    {item.error}
                                </span>
                            )}
                            <button
                                onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                                className="shrink-0 rounded p-0.5 text-surface-700 hover:text-surface-400 transition-colors"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
