import { clsx } from 'clsx';

export function cn(...inputs: (string | undefined | null | false)[]) {
    return clsx(inputs);
}

// Re-export from format.ts to avoid duplication — these were originally defined here
export { formatDate, truncate } from './format';

/**
 * Generate a unique ID with optional prefix
 */
export function generateId(prefix = 'id'): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Deep clone an object (structuredClone wrapper with fallback)
 */
export function deepClone<T>(obj: T): T {
    if (typeof structuredClone === 'function') {
        return structuredClone(obj);
    }
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Sleep utility for async delays
 */
export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
