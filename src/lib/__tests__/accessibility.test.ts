import { generateAriaId, srOnlyClass, ARIA_LABELS } from '@/lib/accessibility';

describe('Accessibility Utilities', () => {
    describe('generateAriaId', () => {
        it('generates a string ID', () => {
            const id = generateAriaId();
            expect(typeof id).toBe('string');
            expect(id.length).toBeGreaterThan(0);
        });

        it('uses default prefix', () => {
            const id = generateAriaId();
            expect(id.startsWith('aria-')).toBe(true);
        });

        it('uses custom prefix', () => {
            const id = generateAriaId('modal');
            expect(id.startsWith('modal-')).toBe(true);
        });

        it('generates unique IDs on repeated calls', () => {
            const id1 = generateAriaId('test');
            const id2 = generateAriaId('test');
            expect(id1).not.toBe(id2);
        });
    });

    describe('srOnlyClass', () => {
        it('is a non-empty string', () => {
            expect(typeof srOnlyClass).toBe('string');
            expect(srOnlyClass.length).toBeGreaterThan(0);
        });

        it('contains overflow-hidden for visual hiding', () => {
            expect(srOnlyClass).toContain('overflow-hidden');
        });
    });

    describe('ARIA_LABELS', () => {
        it('contains close button label', () => {
            expect(ARIA_LABELS.closeButton).toBeTruthy();
        });

        it('contains search input label', () => {
            expect(ARIA_LABELS.searchInput).toBeTruthy();
        });

        it('contains loading label', () => {
            expect(ARIA_LABELS.loading).toBeTruthy();
        });

        it('contains pagination label', () => {
            expect(ARIA_LABELS.pagination).toBeTruthy();
        });

        it('contains all expected keys', () => {
            const expectedKeys = [
                'closeButton',
                'menuButton',
                'searchInput',
                'notification',
                'loading',
                'expandSection',
                'collapseSection',
                'pagination',
                'sortAscending',
                'sortDescending',
            ];
            for (const key of expectedKeys) {
                expect(ARIA_LABELS).toHaveProperty(key);
            }
        });
    });
});
