/**
 * String and text manipulation utilities
 */

/**
 * Truncate text to a maximum length with ellipsis
 */
export function truncate(text: string, maxLength: number = 100): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3).trimEnd() + '...';
}

/**
 * Convert a string to title case
 */
export function titleCase(str: string): string {
    return str
        .toLowerCase()
        .replace(/(?:^|\s|[-_])\w/g, (match) => match.toUpperCase())
        .replace(/[-_]/g, ' ');
}

/**
 * Generate a URL-friendly slug from a string
 */
export function slugify(str: string): string {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/**
 * Pluralize a word based on count
 */
export function pluralize(word: string, count: number, plural?: string): string {
    if (count === 1) return word;
    return plural || word + 's';
}

/**
 * Format a number with commas (e.g., 1000 -> "1,000")
 */
export function formatNumber(num: number): string {
    return num.toLocaleString('en-US');
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

/**
 * Extract initials from a name (e.g., "John Doe" -> "JD")
 */
export function getInitials(name: string, max: number = 2): string {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, max)
        .map((word) => word[0]?.toUpperCase() || '')
        .join('');
}

/**
 * Highlight search query within text by wrapping matches in <mark>
 */
export function highlightMatch(text: string, query: string): string {
    if (!query.trim()) return text;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    return text.replace(regex, '<mark class="bg-primary-500/30 text-white rounded px-0.5">$1</mark>');
}

/**
 * Generate a random ID string
 */
export function generateId(length: number = 12): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}

/**
 * Mask sensitive text (e.g., email@domain.com -> e***l@domain.com)
 */
export function maskEmail(email: string): string {
    const [local, domain] = email.split('@');
    if (!local || !domain) return email;
    if (local.length <= 2) return `${local[0]}***@${domain}`;
    return `${local[0]}***${local[local.length - 1]}@${domain}`;
}
