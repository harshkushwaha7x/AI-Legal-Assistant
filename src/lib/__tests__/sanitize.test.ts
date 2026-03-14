import { sanitizeInput, escapeHtml, sanitizeSqlInput, stripHtml, sanitizeFilename, sanitizeEmail } from '@/lib/sanitize';

describe('Sanitize Utilities', () => {
    describe('sanitizeInput', () => {
        it('trims whitespace', () => {
            expect(sanitizeInput('  hello  ')).toBe('hello');
        });

        it('removes HTML tags', () => {
            expect(sanitizeInput('<script>alert("xss")</script>')).toBe('alert("xss")');
        });

        it('handles normal text', () => {
            expect(sanitizeInput('John Doe')).toBe('John Doe');
        });

        it('handles empty input', () => {
            expect(sanitizeInput('')).toBe('');
        });

        it('enforces max length', () => {
            const long = 'a'.repeat(100);
            expect(sanitizeInput(long, 50)).toHaveLength(50);
        });
    });

    describe('escapeHtml', () => {
        it('escapes angle brackets', () => {
            const result = escapeHtml('<div>test</div>');
            expect(result).not.toContain('<div>');
            expect(result).toContain('&lt;');
        });

        it('escapes ampersands', () => {
            expect(escapeHtml('a & b')).toContain('&amp;');
        });

        it('escapes quotes', () => {
            const result = escapeHtml('"hello"');
            expect(result).toContain('&quot;');
        });
    });

    describe('stripHtml', () => {
        it('removes all HTML tags', () => {
            expect(stripHtml('<p>Hello</p>')).toBe('Hello');
        });

        it('handles nested tags', () => {
            expect(stripHtml('<div><span>text</span></div>')).toBe('text');
        });
    });

    describe('sanitizeFilename', () => {
        it('replaces special characters', () => {
            expect(sanitizeFilename('my file (1).pdf')).toBe('my_file__1_.pdf');
        });

        it('handles dotfiles', () => {
            expect(sanitizeFilename('.hidden')).toBe('_hidden');
        });
    });

    describe('sanitizeEmail', () => {
        it('returns lowercase email for valid input', () => {
            expect(sanitizeEmail('Test@Example.COM')).toBe('test@example.com');
        });

        it('returns null for invalid email', () => {
            expect(sanitizeEmail('not-an-email')).toBeNull();
        });
    });

    describe('sanitizeSqlInput', () => {
        it('removes quotes and semicolons', () => {
            const result = sanitizeSqlInput("Robert'; DROP TABLE users; --");
            expect(result).not.toContain("'");
            expect(result).not.toContain(';');
        });

        it('preserves normal text', () => {
            expect(sanitizeSqlInput('John Doe')).toBe('John Doe');
        });
    });
});
