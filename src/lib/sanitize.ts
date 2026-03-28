/**
 * Input sanitization utilities for security
 */

/**
 * Strip HTML tags from a string to prevent XSS
 */
export function stripHtml(input: string): string {
    return input.replace(/<[^>]*>/g, '');
}

/**
 * Escape special HTML characters
 */
export function escapeHtml(input: string): string {
    const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
    };
    return input.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Sanitize user input: trim, strip HTML, and limit length
 */
export function sanitizeInput(input: string, maxLength: number = 5000): string {
    return stripHtml(input).trim().slice(0, maxLength);
}

/**
 * Sanitize a filename for safe storage
 */
export function sanitizeFilename(filename: string): string {
    return filename
        .replace(/[^a-zA-Z0-9._-]/g, '_')
        .replace(/\.{2,}/g, '.')
        .replace(/^\./, '_')
        .slice(0, 255);
}

/**
 * Validate and sanitize an email address
 */
export function sanitizeEmail(email: string): string | null {
    const trimmed = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(trimmed) ? trimmed : null;
}

/**
 * Remove potential SQL injection characters (defense in depth)
 */
export function sanitizeSqlInput(input: string): string {
    return input.replace(/['";\\]/g, '');
}

/**
 * Sanitize a URL — block javascript: and data: protocols
 */
export function sanitizeUrl(url: string): string {
    const trimmed = url.trim();
    if (/^(javascript|data|vbscript):/i.test(trimmed)) return '';
    return trimmed;
}

/**
 * Deep-sanitize all string values in an object
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T, maxLength = 5000): T {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
            result[key] = sanitizeInput(value, maxLength);
        } else if (value && typeof value === 'object' && !Array.isArray(value)) {
            result[key] = sanitizeObject(value as Record<string, unknown>, maxLength);
        } else {
            result[key] = value;
        }
    }
    return result as T;
}
