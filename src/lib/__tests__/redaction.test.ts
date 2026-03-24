import {
    redactText,
    getRedactionCategories,
    getRulesByCategory,
    containsSensitiveData,
    DEFAULT_RULES,
} from '@/lib/redaction';

describe('Redaction', () => {
    describe('redactText', () => {
        it('redacts SSN', () => {
            const result = redactText('SSN is 123-45-6789');
            expect(result.redacted).toContain('[SSN REDACTED]');
            expect(result.redacted).not.toContain('123-45-6789');
            expect(result.totalRedactions).toBeGreaterThan(0);
        });

        it('redacts email addresses', () => {
            const result = redactText('Contact john@example.com for details');
            expect(result.redacted).toContain('[EMAIL REDACTED]');
            expect(result.redacted).not.toContain('john@example.com');
        });

        it('redacts credit card numbers', () => {
            const result = redactText('Card: 4111-1111-1111-1111');
            expect(result.redacted).toContain('[CC REDACTED]');
        });

        it('redacts EIN', () => {
            const result = redactText('EIN: 12-3456789');
            expect(result.redacted).toContain('[EIN REDACTED]');
        });

        it('tracks match details', () => {
            const result = redactText('Email: test@mail.com, SSN: 123-45-6789');
            expect(result.matches.length).toBeGreaterThanOrEqual(2);
            expect(result.matches.some((m) => m.rule === 'Email Address')).toBe(true);
        });

        it('leaves clean text unchanged', () => {
            const clean = 'This is a normal legal document with no PII.';
            const result = redactText(clean);
            expect(result.redacted).toBe(clean);
            expect(result.totalRedactions).toBe(0);
        });

        it('handles multiple instances', () => {
            const result = redactText('Call 123-456-7890 or 987-654-3210');
            expect(result.totalRedactions).toBeGreaterThanOrEqual(2);
        });
    });

    describe('getRedactionCategories', () => {
        it('returns unique categories', () => {
            const cats = getRedactionCategories();
            expect(cats.length).toBeGreaterThan(0);
            expect(new Set(cats).size).toBe(cats.length);
        });

        it('includes PII and Financial', () => {
            const cats = getRedactionCategories();
            expect(cats).toContain('PII');
            expect(cats).toContain('Financial');
        });
    });

    describe('getRulesByCategory', () => {
        it('filters rules by category', () => {
            const pii = getRulesByCategory('PII');
            expect(pii.length).toBeGreaterThan(0);
            pii.forEach((r) => expect(r.category).toBe('PII'));
        });

        it('returns empty for unknown category', () => {
            expect(getRulesByCategory('NonExistent')).toHaveLength(0);
        });
    });

    describe('containsSensitiveData', () => {
        it('detects SSN', () => {
            expect(containsSensitiveData('SSN: 123-45-6789')).toBe(true);
        });

        it('returns false for clean text', () => {
            expect(containsSensitiveData('No sensitive data here')).toBe(false);
        });
    });

    describe('DEFAULT_RULES', () => {
        it('has 7 rules', () => {
            expect(DEFAULT_RULES).toHaveLength(7);
        });

        it('all rules have required fields', () => {
            DEFAULT_RULES.forEach((r) => {
                expect(r.id).toBeTruthy();
                expect(r.name).toBeTruthy();
                expect(r.pattern).toBeInstanceOf(RegExp);
                expect(r.replacement).toBeTruthy();
                expect(r.category).toBeTruthy();
            });
        });
    });
});
