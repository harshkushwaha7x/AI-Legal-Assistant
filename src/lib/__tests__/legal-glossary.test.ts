import {
    searchGlossary,
    getGlossaryByCategory,
    getGlossaryCategories,
    LEGAL_GLOSSARY,
} from '@/lib/legal-glossary';

describe('Legal Glossary', () => {
    describe('LEGAL_GLOSSARY', () => {
        it('contains multiple terms', () => {
            expect(LEGAL_GLOSSARY.length).toBeGreaterThan(10);
        });

        it('each term has required fields', () => {
            LEGAL_GLOSSARY.forEach((term) => {
                expect(term.term).toBeTruthy();
                expect(term.definition).toBeTruthy();
                expect(term.category).toBeTruthy();
            });
        });

        it('has no duplicate terms', () => {
            const terms = LEGAL_GLOSSARY.map((t) => t.term);
            const uniqueTerms = new Set(terms);
            expect(uniqueTerms.size).toBe(terms.length);
        });
    });

    describe('searchGlossary', () => {
        it('finds terms by name', () => {
            const results = searchGlossary('Affidavit');
            expect(results.length).toBeGreaterThan(0);
            expect(results[0].term).toBe('Affidavit');
        });

        it('finds terms by definition content', () => {
            const results = searchGlossary('confidential');
            expect(results.length).toBeGreaterThan(0);
        });

        it('is case-insensitive', () => {
            const upper = searchGlossary('ARBITRATION');
            const lower = searchGlossary('arbitration');
            expect(upper.length).toBe(lower.length);
        });

        it('returns empty for no match', () => {
            const results = searchGlossary('xyznonexistent');
            expect(results.length).toBe(0);
        });
    });

    describe('getGlossaryByCategory', () => {
        it('returns terms in a specific category', () => {
            const contractTerms = getGlossaryByCategory('contract');
            expect(contractTerms.length).toBeGreaterThan(0);
            contractTerms.forEach((t) => {
                expect(t.category).toBe('contract');
            });
        });

        it('returns empty for unknown category', () => {
            expect(getGlossaryByCategory('nonexistent').length).toBe(0);
        });
    });

    describe('getGlossaryCategories', () => {
        it('returns unique categories', () => {
            const categories = getGlossaryCategories();
            expect(categories.length).toBeGreaterThan(0);
            const unique = new Set(categories);
            expect(unique.size).toBe(categories.length);
        });

        it('includes known categories', () => {
            const categories = getGlossaryCategories();
            expect(categories).toContain('contract');
            expect(categories).toContain('court');
        });
    });
});
