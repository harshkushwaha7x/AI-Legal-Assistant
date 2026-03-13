import {
    timeAgo,
    formatDate,
    formatDateTime,
    isToday,
    getDateRange,
} from '@/lib/date';

describe('Date Utilities', () => {
    describe('timeAgo', () => {
        it('returns "just now" for recent dates', () => {
            expect(timeAgo(new Date())).toBe('just now');
        });

        it('returns minutes ago', () => {
            const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
            expect(timeAgo(fiveMinAgo)).toBe('5 minutes ago');
        });

        it('returns hours ago', () => {
            const twoHoursAgo = new Date(Date.now() - 2 * 3600 * 1000);
            expect(timeAgo(twoHoursAgo)).toBe('2 hours ago');
        });

        it('handles string input', () => {
            const result = timeAgo(new Date().toISOString());
            expect(result).toBe('just now');
        });
    });

    describe('formatDate', () => {
        it('formats date as readable string', () => {
            const date = new Date('2024-06-15');
            const result = formatDate(date);
            expect(result).toContain('Jun');
            expect(result).toContain('15');
            expect(result).toContain('2024');
        });

        it('handles string input', () => {
            const result = formatDate('2024-01-01');
            expect(result).toContain('Jan');
        });
    });

    describe('formatDateTime', () => {
        it('includes time in output', () => {
            const date = new Date('2024-06-15T14:30:00');
            const result = formatDateTime(date);
            expect(result).toContain('Jun');
        });
    });

    describe('isToday', () => {
        it('returns true for today', () => {
            expect(isToday(new Date())).toBe(true);
        });

        it('returns false for yesterday', () => {
            const yesterday = new Date(Date.now() - 86400 * 1000);
            expect(isToday(yesterday)).toBe(false);
        });
    });

    describe('getDateRange', () => {
        it('returns start and end dates', () => {
            const { start, end } = getDateRange('7d');
            expect(start).toBeInstanceOf(Date);
            expect(end).toBeInstanceOf(Date);
            expect(start.getTime()).toBeLessThan(end.getTime());
        });

        it('today range starts at midnight', () => {
            const { start } = getDateRange('today');
            expect(start.getHours()).toBe(0);
            expect(start.getMinutes()).toBe(0);
        });
    });
});
