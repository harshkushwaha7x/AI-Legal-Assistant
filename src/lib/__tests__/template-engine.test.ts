import {
    renderTemplate,
    extractVariables,
    validateTemplateValues,
    getDefaultValues,
    countUnresolved,
    NDA_TEMPLATE,
} from '@/lib/template-engine';

describe('Template Engine', () => {
    describe('renderTemplate', () => {
        it('replaces variables', () => {
            const result = renderTemplate('Hello {{NAME}}, welcome to {{COMPANY}}', {
                NAME: 'Alice',
                COMPANY: 'Acme',
            });
            expect(result).toBe('Hello Alice, welcome to Acme');
        });

        it('leaves unresolved variables intact', () => {
            const result = renderTemplate('Hello {{NAME}}', {});
            expect(result).toBe('Hello {{NAME}}');
        });

        it('handles empty template', () => {
            expect(renderTemplate('', { NAME: 'Test' })).toBe('');
        });

        it('replaces multiple occurrences', () => {
            const result = renderTemplate('{{X}} and {{X}}', { X: 'yes' });
            expect(result).toBe('yes and yes');
        });
    });

    describe('extractVariables', () => {
        it('extracts variable names', () => {
            const vars = extractVariables('{{PARTY_A}} and {{PARTY_B}} on {{DATE}}');
            expect(vars).toContain('PARTY_A');
            expect(vars).toContain('PARTY_B');
            expect(vars).toContain('DATE');
        });

        it('returns unique names only', () => {
            const vars = extractVariables('{{NAME}} is {{NAME}}');
            expect(vars).toHaveLength(1);
        });

        it('returns empty for no variables', () => {
            expect(extractVariables('plain text')).toHaveLength(0);
        });
    });

    describe('validateTemplateValues', () => {
        it('passes when all required values provided', () => {
            const result = validateTemplateValues(NDA_TEMPLATE, {
                PARTY_A: 'Acme',
                PARTY_B: 'Widget',
                EFFECTIVE_DATE: '2024-01-01',
                DURATION: '2',
                GOVERNING_STATE: 'Delaware',
            });
            expect(result.valid).toBe(true);
            expect(result.missing).toHaveLength(0);
        });

        it('fails when required values missing', () => {
            const result = validateTemplateValues(NDA_TEMPLATE, {
                PARTY_A: 'Acme',
            });
            expect(result.valid).toBe(false);
            expect(result.missing.length).toBeGreaterThan(0);
        });

        it('reports specific missing fields', () => {
            const result = validateTemplateValues(NDA_TEMPLATE, {
                PARTY_A: 'Acme',
                PARTY_B: 'Widget',
                EFFECTIVE_DATE: '2024-01-01',
                DURATION: '2',
            });
            expect(result.missing).toContain('GOVERNING_STATE');
        });
    });

    describe('getDefaultValues', () => {
        it('extracts defaults from template', () => {
            const defaults = getDefaultValues(NDA_TEMPLATE);
            expect(defaults.DURATION).toBe('2');
            expect(defaults.GOVERNING_STATE).toBe('Delaware');
        });

        it('does not include fields without defaults', () => {
            const defaults = getDefaultValues(NDA_TEMPLATE);
            expect(defaults.PARTY_A).toBeUndefined();
        });
    });

    describe('countUnresolved', () => {
        it('counts remaining variables', () => {
            expect(countUnresolved('Hello {{NAME}} at {{PLACE}}')).toBe(2);
        });

        it('returns 0 when all resolved', () => {
            expect(countUnresolved('Hello Alice at Home')).toBe(0);
        });
    });

    describe('NDA_TEMPLATE', () => {
        it('has required fields', () => {
            expect(NDA_TEMPLATE.id).toBeTruthy();
            expect(NDA_TEMPLATE.name).toBe('Standard NDA');
            expect(NDA_TEMPLATE.variables.length).toBeGreaterThan(0);
            expect(NDA_TEMPLATE.body).toContain('{{PARTY_A}}');
        });

        it('renders completely with all values', () => {
            const rendered = renderTemplate(NDA_TEMPLATE.body, {
                PARTY_A: 'Acme Corp',
                PARTY_B: 'Widget Inc',
                EFFECTIVE_DATE: 'January 1, 2024',
                DURATION: '2',
                GOVERNING_STATE: 'Delaware',
            });
            expect(countUnresolved(rendered)).toBe(0);
            expect(rendered).toContain('Acme Corp');
        });
    });
});
