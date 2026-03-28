/**
 * Date formatting and calculation utilities
 */

/**
 * Format a date as a relative time string (e.g., "2 hours ago")
 */
export function timeAgo(date: Date | string): string {
    const now = new Date();
    const d = typeof date === 'string' ? new Date(date) : date;
    const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);

    const intervals: [number, string][] = [
        [31536000, 'year'],
        [2592000, 'month'],
        [86400, 'day'],
        [3600, 'hour'],
        [60, 'minute'],
    ];

    for (const [secs, label] of intervals) {
        const count = Math.floor(seconds / secs);
        if (count >= 1) {
            return `${count} ${label}${count > 1 ? 's' : ''} ago`;
        }
    }

    return 'just now';
}

/**
 * Format a date as a readable string
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        ...options,
    });
}

/**
 * Format a date and time
 */
export function formatDateTime(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * Check if a date is today
 */
export function isToday(date: Date | string): boolean {
    const d = typeof date === 'string' ? new Date(date) : date;
    const today = new Date();
    return (
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
    );
}

/**
 * Get the start and end of a date range
 */
export function getDateRange(range: 'today' | '7d' | '30d' | '90d' | 'year'): {
    start: Date;
    end: Date;
} {
    const end = new Date();
    const start = new Date();

    switch (range) {
        case 'today':
            start.setHours(0, 0, 0, 0);
            break;
        case '7d':
            start.setDate(start.getDate() - 7);
            break;
        case '30d':
            start.setDate(start.getDate() - 30);
            break;
        case '90d':
            start.setDate(start.getDate() - 90);
            break;
        case 'year':
            start.setFullYear(start.getFullYear() - 1);
            break;
    }

    return { start, end };
}

/**
 * Add days to a date
 */
export function addDays(date: Date | string, days: number): Date {
    const d = new Date(typeof date === 'string' ? new Date(date) : date);
    d.setDate(d.getDate() + days);
    return d;
}

/**
 * Add months to a date
 */
export function addMonths(date: Date | string, months: number): Date {
    const d = new Date(typeof date === 'string' ? new Date(date) : date);
    d.setMonth(d.getMonth() + months);
    return d;
}

/**
 * Check if a date has passed (e.g., contract expiry)
 */
export function isExpired(date: Date | string): boolean {
    return new Date(date).getTime() < Date.now();
}

/**
 * Calculate days between two dates
 */
export function daysBetween(a: Date | string, b: Date | string): number {
    const msPerDay = 86400000;
    const d1 = new Date(a).getTime();
    const d2 = new Date(b).getTime();
    return Math.round(Math.abs(d2 - d1) / msPerDay);
}
