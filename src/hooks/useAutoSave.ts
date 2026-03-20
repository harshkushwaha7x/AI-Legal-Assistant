'use client';

import { useEffect, useRef, useState } from 'react';

interface UseAutoSaveOptions {
    data: unknown;
    onSave: (data: unknown) => Promise<void>;
    intervalMs?: number;
    enabled?: boolean;
}

interface AutoSaveState {
    lastSavedAt: Date | null;
    isSaving: boolean;
    error: string | null;
    saveNow: () => Promise<void>;
}

/**
 * Hook for auto-saving data at regular intervals when changes are detected
 */
export function useAutoSave({
    data,
    onSave,
    intervalMs = 30000,
    enabled = true,
}: UseAutoSaveOptions): AutoSaveState {
    const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const lastDataRef = useRef<string>('');
    const dataRef = useRef(data);
    const onSaveRef = useRef(onSave);

    // Keep refs current
    dataRef.current = data;
    onSaveRef.current = onSave;

    const save = async () => {
        const currentData = JSON.stringify(dataRef.current);
        if (currentData === lastDataRef.current) return;

        setIsSaving(true);
        setError(null);

        try {
            await onSaveRef.current(dataRef.current);
            lastDataRef.current = currentData;
            setLastSavedAt(new Date());
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Auto-save failed');
        } finally {
            setIsSaving(false);
        }
    };

    // Auto-save interval
    useEffect(() => {
        if (!enabled) return;

        const interval = setInterval(save, intervalMs);
        return () => clearInterval(interval);
    }, [enabled, intervalMs]);

    // Initialize last data ref
    useEffect(() => {
        lastDataRef.current = JSON.stringify(data);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return {
        lastSavedAt,
        isSaving,
        error,
        saveNow: save,
    };
}
