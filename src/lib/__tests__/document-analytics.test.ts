import {
    calculateDocumentStats,
    assessReadability,
    extractLegalTerms,
} from '@/lib/document-analytics';

describe('Document Analytics', () => {
    describe('calculateDocumentStats', () => {
        it('counts words correctly', () => {
            const stats = calculateDocumentStats('The quick brown fox jumps over the lazy dog.');
            expect(stats.wordCount).toBe(9);
        });

        it('counts sentences', () => {
            const stats = calculateDocumentStats('First sentence. Second sentence. Third one!');
            expect(stats.sentenceCount).toBe(3);
        });

        it('counts paragraphs', () => {
            const text = 'Paragraph one.\n\nParagraph two.\n\nParagraph three.';
            const stats = calculateDocumentStats(text);
            expect(stats.paragraphCount).toBe(3);
        });

        it('calculates reading time', () => {
            const words = Array(400).fill('word').join(' ');
            const stats = calculateDocumentStats(words);
            expect(stats.readingTimeMinutes).toBe(2);
        });

        it('handles empty text', () => {
            const stats = calculateDocumentStats('');
            expect(stats.wordCount).toBe(0);
            expect(stats.sentenceCount).toBe(0);
            expect(stats.readingTimeMinutes).toBe(0);
        });

        it('calculates average words per sentence', () => {
            const stats = calculateDocumentStats('Short. A slightly longer sentence here.');
            expect(stats.avgWordsPerSentence).toBeGreaterThan(0);
        });

        it('counts unique words', () => {
            const stats = calculateDocumentStats('the the the dog dog cat');
            expect(stats.uniqueWordCount).toBe(3);
        });

        it('finds longest sentence', () => {
            const text = 'Short. This is a much longer sentence with many words in it.';
            const stats = calculateDocumentStats(text);
            expect(stats.longestSentenceWords).toBeGreaterThan(5);
        });
    });

    describe('assessReadability', () => {
        it('returns simple for short text', () => {
            const result = assessReadability('Hello world. Simple text here.');
            expect(result.level).toBe('simple');
            expect(result.score).toBeGreaterThan(0);
        });

        it('returns higher score for complex text', () => {
            const complexText = Array(20)
                .fill('The indemnification clause notwithstanding any prior representations and warranties shall remain enforceable.')
                .join(' ');
            const result = assessReadability(complexText);
            expect(result.score).toBeGreaterThan(3);
        });

        it('handles empty text', () => {
            const result = assessReadability('');
            expect(result.score).toBe(0);
            expect(result.level).toBe('simple');
        });

        it('includes description', () => {
            const result = assessReadability('Some text here.');
            expect(result.description).toBeTruthy();
        });
    });

    describe('extractLegalTerms', () => {
        it('finds legal terms in text', () => {
            const text = 'The indemnification clause protects against liability and breach of contract.';
            const terms = extractLegalTerms(text);
            expect(terms).toContain('indemnification');
            expect(terms).toContain('liability');
            expect(terms).toContain('breach');
        });

        it('returns empty for non-legal text', () => {
            const terms = extractLegalTerms('Today is a sunny day.');
            expect(terms.length).toBe(0);
        });

        it('is case-insensitive', () => {
            const terms = extractLegalTerms('ARBITRATION and JURISDICTION apply.');
            expect(terms).toContain('arbitration');
            expect(terms).toContain('jurisdiction');
        });
    });
});
