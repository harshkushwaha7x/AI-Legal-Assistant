import {
    wordCount,
    charCount,
    textPreview,
} from '@/lib/pdf';

describe('PDF/Text Utilities', () => {
    describe('wordCount', () => {
        it('counts words correctly', () => {
            expect(wordCount('hello world')).toBe(2);
        });

        it('handles multiple spaces', () => {
            expect(wordCount('hello   world   test')).toBe(3);
        });

        it('returns 0 for empty string', () => {
            expect(wordCount('')).toBe(0);
        });

        it('returns 0 for whitespace only', () => {
            expect(wordCount('   ')).toBe(0);
        });
    });

    describe('charCount', () => {
        it('counts non-whitespace characters', () => {
            expect(charCount('hello world')).toBe(10);
        });

        it('returns 0 for empty string', () => {
            expect(charCount('')).toBe(0);
        });

        it('ignores all whitespace types', () => {
            expect(charCount('a b\tc\nd')).toBe(4);
        });
    });

    describe('textPreview', () => {
        it('returns full text if under limit', () => {
            expect(textPreview('short text', 100)).toBe('short text');
        });

        it('truncates long text at word boundary', () => {
            const text = 'This is a longer text that should be truncated at a word boundary';
            const preview = textPreview(text, 30);
            expect(preview.length).toBeLessThanOrEqual(33); // 30 + '...'
            expect(preview.endsWith('...')).toBe(true);
        });

        it('uses default max length', () => {
            const longText = 'a '.repeat(200);
            const preview = textPreview(longText);
            expect(preview.length).toBeLessThanOrEqual(203);
        });
    });
});
