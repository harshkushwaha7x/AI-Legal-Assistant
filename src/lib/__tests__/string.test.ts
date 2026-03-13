import {
    truncate,
    titleCase,
    slugify,
    pluralize,
    formatNumber,
    formatFileSize,
    getInitials,
    maskEmail,
    generateId,
} from '@/lib/string';

describe('String Utilities', () => {
    describe('truncate', () => {
        it('returns short text unchanged', () => {
            expect(truncate('hello', 100)).toBe('hello');
        });

        it('truncates long text with ellipsis', () => {
            const long = 'a'.repeat(200);
            const result = truncate(long, 50);
            expect(result.length).toBeLessThanOrEqual(50);
            expect(result.endsWith('...')).toBe(true);
        });
    });

    describe('titleCase', () => {
        it('converts lowercase to title case', () => {
            expect(titleCase('hello world')).toBe('Hello World');
        });

        it('handles hyphenated words', () => {
            expect(titleCase('real-estate')).toBe('Real Estate');
        });
    });

    describe('slugify', () => {
        it('converts text to URL-friendly slug', () => {
            expect(slugify('Hello World!')).toBe('hello-world');
        });

        it('handles multiple spaces and special chars', () => {
            expect(slugify('  Legal  Research & Analysis  ')).toBe('legal--research--analysis');
        });
    });

    describe('pluralize', () => {
        it('returns singular for count 1', () => {
            expect(pluralize('document', 1)).toBe('document');
        });

        it('returns plural for count > 1', () => {
            expect(pluralize('document', 5)).toBe('documents');
        });

        it('uses custom plural form', () => {
            expect(pluralize('analysis', 3, 'analyses')).toBe('analyses');
        });
    });

    describe('formatNumber', () => {
        it('formats large numbers with commas', () => {
            expect(formatNumber(1000000)).toBe('1,000,000');
        });
    });

    describe('formatFileSize', () => {
        it('formats bytes correctly', () => {
            expect(formatFileSize(0)).toBe('0 B');
            expect(formatFileSize(1024)).toBe('1.0 KB');
            expect(formatFileSize(1048576)).toBe('1.0 MB');
        });
    });

    describe('getInitials', () => {
        it('extracts initials from name', () => {
            expect(getInitials('John Doe')).toBe('JD');
        });

        it('handles single name', () => {
            expect(getInitials('John')).toBe('J');
        });
    });

    describe('maskEmail', () => {
        it('masks email local part', () => {
            expect(maskEmail('john@example.com')).toBe('j***n@example.com');
        });

        it('handles short local parts', () => {
            expect(maskEmail('ab@example.com')).toBe('a***@example.com');
        });
    });

    describe('generateId', () => {
        it('generates ID of specified length', () => {
            expect(generateId(8).length).toBe(8);
            expect(generateId(16).length).toBe(16);
        });

        it('generates unique IDs', () => {
            const ids = new Set(Array.from({ length: 100 }, () => generateId()));
            expect(ids.size).toBe(100);
        });
    });
});
