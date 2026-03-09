'use client';

import { useRef, useState } from 'react';
import { Upload, FileText, X, AlertTriangle } from 'lucide-react';

interface FileUploadProps {
    onFileSelect: (file: File) => void;
    accept?: string;
    maxSize?: number;
    label?: string;
    description?: string;
}

export default function FileUpload({
    onFileSelect,
    accept = '.pdf,.doc,.docx,.txt',
    maxSize = 10 * 1024 * 1024, // 10MB
    label = 'Upload a file',
    description = 'PDF, DOC, DOCX, or TXT up to 10MB',
}: FileUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragOver, setDragOver] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFile = (file: File) => {
        setError(null);

        if (file.size > maxSize) {
            setError(`File too large. Maximum size is ${(maxSize / 1024 / 1024).toFixed(0)}MB.`);
            return;
        }

        setSelectedFile(file);
        onFileSelect(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    const clearFile = () => {
        setSelectedFile(null);
        setError(null);
        if (inputRef.current) inputRef.current.value = '';
    };

    return (
        <div>
            <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all ${dragOver
                        ? 'border-primary-500 bg-primary-500/5'
                        : error
                            ? 'border-red-500/30 bg-red-500/5'
                            : selectedFile
                                ? 'border-emerald-500/30 bg-emerald-500/5'
                                : 'border-white/10 bg-white/[2%] hover:border-white/20 hover:bg-white/5'
                    }`}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    onChange={handleChange}
                    className="hidden"
                />

                {selectedFile ? (
                    <div className="flex flex-col items-center gap-2">
                        <FileText className="h-8 w-8 text-emerald-400" />
                        <p className="text-sm font-medium text-white">{selectedFile.name}</p>
                        <p className="text-xs text-surface-500">
                            {(selectedFile.size / 1024).toFixed(1)} KB
                        </p>
                        <button
                            onClick={(e) => { e.stopPropagation(); clearFile(); }}
                            className="mt-2 inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1 text-xs text-surface-400 transition-colors hover:bg-white/5 hover:text-white"
                        >
                            <X className="h-3 w-3" />
                            Remove
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <Upload className={`h-8 w-8 ${dragOver ? 'text-primary-400' : 'text-surface-500'}`} />
                        <p className="text-sm font-medium text-surface-300">{label}</p>
                        <p className="text-xs text-surface-500">{description}</p>
                    </div>
                )}
            </div>

            {error && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-red-400">
                    <AlertTriangle className="h-3 w-3" />
                    {error}
                </div>
            )}
        </div>
    );
}
