import {
    generateChecklist,
    toggleItem,
    getComplianceScore,
    getItemsByCategory,
    getIncompleteRequired,
} from '@/lib/compliance-checklist';

describe('Compliance Checklist', () => {
    describe('generateChecklist', () => {
        it('creates a checklist with common items', () => {
            const cl = generateChecklist('OTHER', 'US-CA');
            expect(cl.items.length).toBeGreaterThan(5);
            expect(cl.documentType).toBe('OTHER');
            expect(cl.jurisdiction).toBe('US-CA');
        });

        it('adds NDA-specific items', () => {
            const cl = generateChecklist('NDA', 'US-CA');
            const ids = cl.items.map((i) => i.id);
            expect(ids).toContain('conf-definition');
            expect(ids).toContain('exclusions');
        });

        it('adds employment-specific items', () => {
            const cl = generateChecklist('EMPLOYMENT', 'GB');
            const ids = cl.items.map((i) => i.id);
            expect(ids).toContain('compensation');
            expect(ids).toContain('duties');
        });

        it('adds lease-specific items', () => {
            const cl = generateChecklist('LEASE', 'US-NY');
            const ids = cl.items.map((i) => i.id);
            expect(ids).toContain('property-desc');
            expect(ids).toContain('rent-amount');
        });

        it('all items start unchecked', () => {
            const cl = generateChecklist('NDA', 'US-CA');
            cl.items.forEach((i) => expect(i.checked).toBe(false));
        });
    });

    describe('toggleItem', () => {
        it('toggles an item on', () => {
            const cl = generateChecklist('NDA', 'US-CA');
            const updated = toggleItem(cl, cl.items[0].id);
            expect(updated.items[0].checked).toBe(true);
        });

        it('toggles an item off', () => {
            let cl = generateChecklist('NDA', 'US-CA');
            cl = toggleItem(cl, cl.items[0].id); // on
            cl = toggleItem(cl, cl.items[0].id); // off
            expect(cl.items[0].checked).toBe(false);
        });
    });

    describe('getComplianceScore', () => {
        it('returns 0 for no checked items', () => {
            const cl = generateChecklist('NDA', 'US-CA');
            expect(getComplianceScore(cl)).toBe(0);
        });

        it('increases as items are checked', () => {
            let cl = generateChecklist('NDA', 'US-CA');
            cl = toggleItem(cl, cl.items[0].id);
            expect(getComplianceScore(cl)).toBeGreaterThan(0);
        });

        it('returns 100 when all checked', () => {
            let cl = generateChecklist('NDA', 'US-CA');
            for (const item of cl.items) {
                cl = toggleItem(cl, item.id);
            }
            expect(getComplianceScore(cl)).toBe(100);
        });
    });

    describe('getItemsByCategory', () => {
        it('groups items by category', () => {
            const cl = generateChecklist('NDA', 'US-CA');
            const grouped = getItemsByCategory(cl);
            expect(Object.keys(grouped).length).toBeGreaterThan(1);
            for (const [cat, items] of Object.entries(grouped)) {
                items.forEach((i) => expect(i.category).toBe(cat));
            }
        });
    });

    describe('getIncompleteRequired', () => {
        it('returns all required items when none checked', () => {
            const cl = generateChecklist('NDA', 'US-CA');
            const incomplete = getIncompleteRequired(cl);
            expect(incomplete.length).toBeGreaterThan(0);
            incomplete.forEach((i) => expect(i.severity).toBe('required'));
        });

        it('decreases as required items are completed', () => {
            let cl = generateChecklist('NDA', 'US-CA');
            const initial = getIncompleteRequired(cl).length;
            const firstRequired = cl.items.find((i) => i.severity === 'required');
            if (firstRequired) {
                cl = toggleItem(cl, firstRequired.id);
                expect(getIncompleteRequired(cl).length).toBe(initial - 1);
            }
        });
    });
});
