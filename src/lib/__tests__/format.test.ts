import {
    timeAgo,
    formatDate,
    formatDateTime,
    truncate,
    titleCase,
    getInitials,
    formatFileSize,
    formatNumber,
} from '@/lib/format';

describe('Format Utilities', () => {
    describe('timeAgo', () => {
        it('returns Just now for recent time', () => {
            const result = timeAgo(new Date());
            expect(result).toBe('Just now');
        });

        it('returns minutes ago', () => {
            const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
            expect(timeAgo(fiveMinAgo)).toBe('5m ago');
        });

        it('returns hours ago', () => {
            const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
            expect(timeAgo(twoHoursAgo)).toBe('2h ago');
        });

        it('accepts string dates', () => {
            const result = timeAgo(new Date().toISOString());
            expect(result).toBe('Just now');
        });
    });

    describe('formatDate', () => {
        it('formats a date', () => {
            const result = formatDate('2024-01-15');
            expect(result).toContain('2024');
            expect(result).toContain('15');
        });
    });

    describe('formatDateTime', () => {
        it('includes time', () => {
            const result = formatDateTime('2024-01-15T14:30:00');
            expect(result).toContain('2024');
        });
    });

    describe('truncate', () => {
        it('returns text if under limit', () => {
            expect(truncate('short', 100)).toBe('short');
        });

        it('truncates long text', () => {
            const long = 'a'.repeat(200);
            const result = truncate(long, 50);
            expect(result.length).toBe(50);
            expect(result.endsWith('...')).toBe(true);
        });
    });

    describe('titleCase', () => {
        it('capitalizes words', () => {
            expect(titleCase('hello world')).toBe('Hello World');
        });

        it('handles underscores', () => {
            expect(titleCase('some_text_here')).toBe('Some Text Here');
        });
    });

    describe('getInitials', () => {
        it('returns initials', () => {
            expect(getInitials('John Doe')).toBe('JD');
        });

        it('returns U for null', () => {
            expect(getInitials(null)).toBe('U');
        });

        it('limits to 2 letters', () => {
            expect(getInitials('John Michael Doe').length).toBe(2);
        });
    });

    describe('formatFileSize', () => {
        it('formats bytes', () => {
            expect(formatFileSize(500)).toBe('500 B');
        });

        it('formats kilobytes', () => {
            expect(formatFileSize(1536)).toBe('1.5 KB');
        });

        it('formats megabytes', () => {
            expect(formatFileSize(2097152)).toBe('2 MB');
        });

        it('handles zero', () => {
            expect(formatFileSize(0)).toBe('0 B');
        });
    });

    describe('formatNumber', () => {
        it('adds commas', () => {
            const result = formatNumber(1234567);
            expect(result).toContain('1');
            expect(result).toContain('234');
        });
    });
});
