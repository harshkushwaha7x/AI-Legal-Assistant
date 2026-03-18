import {
    compareDocuments,
    formatDiffSummary,
    areDocumentsIdentical,
} from '@/lib/document-diff';

describe('Document Diff', () => {
    describe('compareDocuments', () => {
        it('detects identical documents', () => {
            const text = 'Line one\nLine two\nLine three';
            const diff = compareDocuments(text, text);
            expect(diff.additions).toBe(0);
            expect(diff.deletions).toBe(0);
            expect(diff.unchanged).toBe(3);
            expect(diff.similarity).toBe(1);
        });

        it('detects additions', () => {
            const original = 'Line one\nLine two';
            const modified = 'Line one\nLine two\nLine three';
            const diff = compareDocuments(original, modified);
            expect(diff.additions).toBeGreaterThan(0);
            expect(diff.deletions).toBe(0);
        });

        it('detects deletions', () => {
            const original = 'Line one\nLine two\nLine three';
            const modified = 'Line one\nLine three';
            const diff = compareDocuments(original, modified);
            expect(diff.deletions).toBeGreaterThan(0);
        });

        it('detects mixed changes', () => {
            const original = 'Line one\nLine two\nLine three';
            const modified = 'Line one\nModified line\nLine three\nNew line';
            const diff = compareDocuments(original, modified);
            expect(diff.additions).toBeGreaterThan(0);
            expect(diff.deletions).toBeGreaterThan(0);
            expect(diff.unchanged).toBeGreaterThan(0);
        });

        it('handles empty documents', () => {
            const diff = compareDocuments('', '');
            expect(diff.similarity).toBe(1);
        });

        it('handles completely different documents', () => {
            const diff = compareDocuments('alpha\nbeta', 'gamma\ndelta');
            expect(diff.similarity).toBe(0);
            expect(diff.additions).toBe(2);
            expect(diff.deletions).toBe(2);
        });

        it('produces chunks with correct types', () => {
            const diff = compareDocuments('A\nB', 'A\nC');
            const types = diff.chunks.map((c) => c.type);
            expect(types).toContain('unchanged');
        });
    });

    describe('formatDiffSummary', () => {
        it('formats a diff summary string', () => {
            const diff = compareDocuments('A\nB', 'A\nB\nC');
            const summary = formatDiffSummary(diff);
            expect(summary).toContain('added');
            expect(summary).toContain('similar');
        });

        it('includes all parts for mixed changes', () => {
            const diff = compareDocuments('A\nB\nC', 'A\nX\nC');
            const summary = formatDiffSummary(diff);
            expect(summary).toContain('added');
            expect(summary).toContain('removed');
            expect(summary).toContain('unchanged');
        });
    });

    describe('areDocumentsIdentical', () => {
        it('returns true for identical content', () => {
            expect(areDocumentsIdentical('hello', 'hello')).toBe(true);
        });

        it('returns true ignoring whitespace', () => {
            expect(areDocumentsIdentical('hello  ', '  hello')).toBe(true);
        });

        it('returns false for different content', () => {
            expect(areDocumentsIdentical('hello', 'world')).toBe(false);
        });
    });
});
