import {
    searchClauses,
    getClausesByCategory,
    getClauseCategories,
    getClausesByRisk,
    CLAUSE_LIBRARY,
} from '@/lib/clause-library';

describe('Clause Library', () => {
    describe('CLAUSE_LIBRARY', () => {
        it('contains multiple clauses', () => {
            expect(CLAUSE_LIBRARY.length).toBeGreaterThan(5);
        });

        it('each clause has required fields', () => {
            CLAUSE_LIBRARY.forEach((clause) => {
                expect(clause.id).toBeTruthy();
                expect(clause.name).toBeTruthy();
                expect(clause.category).toBeTruthy();
                expect(clause.description).toBeTruthy();
                expect(clause.content).toBeTruthy();
                expect(['low', 'medium', 'high']).toContain(clause.riskLevel);
            });
        });

        it('has unique IDs', () => {
            const ids = CLAUSE_LIBRARY.map((c) => c.id);
            expect(new Set(ids).size).toBe(ids.length);
        });
    });

    describe('searchClauses', () => {
        it('finds clauses by name', () => {
            const results = searchClauses('Confidentiality');
            expect(results.length).toBeGreaterThan(0);
        });

        it('finds clauses by description', () => {
            const results = searchClauses('indemnify');
            expect(results.length).toBeGreaterThan(0);
        });

        it('is case-insensitive', () => {
            const upper = searchClauses('TERMINATION');
            const lower = searchClauses('termination');
            expect(upper.length).toBe(lower.length);
        });

        it('returns empty for no match', () => {
            expect(searchClauses('xyznonexistent').length).toBe(0);
        });
    });

    describe('getClausesByCategory', () => {
        it('returns clauses in a category', () => {
            const results = getClausesByCategory('confidentiality');
            expect(results.length).toBeGreaterThan(0);
            results.forEach((c) => expect(c.category).toBe('confidentiality'));
        });

        it('returns empty for unknown category', () => {
            expect(getClausesByCategory('nonexistent').length).toBe(0);
        });
    });

    describe('getClauseCategories', () => {
        it('returns unique categories', () => {
            const categories = getClauseCategories();
            expect(categories.length).toBeGreaterThan(0);
            expect(new Set(categories).size).toBe(categories.length);
        });

        it('includes known categories', () => {
            const categories = getClauseCategories();
            expect(categories).toContain('confidentiality');
            expect(categories).toContain('termination');
        });
    });

    describe('getClausesByRisk', () => {
        it('filters by risk level', () => {
            const lowRisk = getClausesByRisk('low');
            expect(lowRisk.length).toBeGreaterThan(0);
            lowRisk.forEach((c) => expect(c.riskLevel).toBe('low'));
        });

        it('returns high risk clauses', () => {
            const highRisk = getClausesByRisk('high');
            expect(highRisk.length).toBeGreaterThan(0);
        });
    });
});
