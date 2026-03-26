import {
    renderTemplate,
    extractVariables,
    validateTemplateValues,
    NDA_TEMPLATE,
} from '@/lib/template-engine';

import {
    generateChecklist,
    toggleItem,
    getComplianceScore,
    getIncompleteRequired,
} from '@/lib/compliance-checklist';

import {
    hasPermission,
    isRoleAtLeast,
} from '@/lib/permissions';

import {
    redactText,
    containsSensitiveData,
} from '@/lib/redaction';

describe('Integration: Document Lifecycle', () => {
    describe('NDA creation → compliance → redaction pipeline', () => {
        it('renders template, checks compliance, and redacts PII', () => {
            // Step 1: Render NDA template
            const values = {
                PARTY_A: 'Acme Corp',
                PARTY_B: 'Widget Inc',
                EFFECTIVE_DATE: 'January 1, 2024',
                DURATION: '2',
                GOVERNING_STATE: 'Delaware',
            };
            const rendered = renderTemplate(NDA_TEMPLATE.body, values);
            expect(rendered).toContain('Acme Corp');
            expect(rendered).toContain('Widget Inc');

            // Step 2: Generate compliance checklist
            const checklist = generateChecklist('NDA', 'US-DE');
            expect(checklist.items.length).toBeGreaterThan(10);

            // Step 3: Complete some items
            let cl = checklist;
            cl = toggleItem(cl, 'parties-identified');
            cl = toggleItem(cl, 'effective-date');
            cl = toggleItem(cl, 'governing-law');
            const score = getComplianceScore(cl);
            expect(score).toBeGreaterThan(0);

            // Step 4: Check for PII in rendered document
            const withPII = rendered + '\nContact: john@acme.com, SSN: 123-45-6789';
            expect(containsSensitiveData(withPII)).toBe(true);

            // Step 5: Redact PII
            const redacted = redactText(withPII);
            expect(redacted.totalRedactions).toBeGreaterThanOrEqual(2);
            expect(redacted.redacted).not.toContain('123-45-6789');
            expect(redacted.redacted).not.toContain('john@acme.com');
        });
    });

    describe('Permission gated operations', () => {
        it('attorney can create and approve, client cannot', () => {
            expect(hasPermission('attorney', 'documents:create')).toBe(true);
            expect(hasPermission('attorney', 'reviews:approve')).toBe(true);
            expect(hasPermission('client', 'documents:create')).toBe(false);
            expect(hasPermission('client', 'reviews:approve')).toBe(false);
        });

        it('role hierarchy determines access levels', () => {
            expect(isRoleAtLeast('admin', 'viewer')).toBe(true);
            expect(isRoleAtLeast('viewer', 'admin')).toBe(false);
            expect(isRoleAtLeast('paralegal', 'client')).toBe(true);
        });
    });
});
