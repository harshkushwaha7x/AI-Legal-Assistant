/**
 * Data export utility
 * Generates CSV and JSON exports for legal data with configurable columns
 */

export interface ExportColumn {
    key: string;
    header: string;
    transform?: (value: unknown) => string;
}

/**
 * Convert records to CSV string
 */
export function toCSV<T extends Record<string, unknown>>(
    records: T[],
    columns: ExportColumn[]
): string {
    const header = columns.map((c) => escapeCSV(c.header)).join(',');

    const rows = records.map((record) =>
        columns
            .map((col) => {
                const val = record[col.key];
                const formatted = col.transform ? col.transform(val) : String(val ?? '');
                return escapeCSV(formatted);
            })
            .join(',')
    );

    return [header, ...rows].join('\n');
}

/**
 * Escape a CSV field
 */
function escapeCSV(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
}

/**
 * Convert records to formatted JSON string
 */
export function toJSON<T>(records: T[], pretty = true): string {
    return JSON.stringify(records, null, pretty ? 2 : undefined);
}

/**
 * Create a downloadable blob URL
 */
export function createBlobURL(content: string, mimeType: string): string {
    const blob = new Blob([content], { type: mimeType });
    return URL.createObjectURL(blob);
}

/**
 * Generate a timestamped filename
 */
export function generateFilename(prefix: string, extension: string): string {
    const date = new Date().toISOString().slice(0, 10);
    const safe = prefix.replace(/[^a-zA-Z0-9-_]/g, '_');
    return `${safe}_${date}.${extension}`;
}

/**
 * Calculate export size estimate in bytes
 */
export function estimateExportSize(content: string): {
    bytes: number;
    formatted: string;
} {
    const bytes = new TextEncoder().encode(content).length;
    if (bytes < 1024) return { bytes, formatted: `${bytes} B` };
    if (bytes < 1024 * 1024) return { bytes, formatted: `${(bytes / 1024).toFixed(1)} KB` };
    return { bytes, formatted: `${(bytes / (1024 * 1024)).toFixed(1)} MB` };
}
