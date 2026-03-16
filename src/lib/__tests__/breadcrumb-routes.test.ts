import {
    generateBreadcrumbs,
    isDashboardRoute,
    getParentRoute,
} from '@/lib/breadcrumb-routes';

describe('Breadcrumb Routes', () => {
    describe('generateBreadcrumbs', () => {
        it('generates breadcrumbs for dashboard path', () => {
            const crumbs = generateBreadcrumbs('/dashboard');
            expect(crumbs).toHaveLength(1);
            expect(crumbs[0].label).toBe('Dashboard');
            expect(crumbs[0].href).toBe('/dashboard');
        });

        it('generates nested breadcrumbs', () => {
            const crumbs = generateBreadcrumbs('/dashboard/documents');
            expect(crumbs).toHaveLength(2);
            expect(crumbs[0].label).toBe('Dashboard');
            expect(crumbs[1].label).toBe('Documents');
        });

        it('handles unknown segments with formatting', () => {
            const crumbs = generateBreadcrumbs('/dashboard/some-page');
            expect(crumbs[1].label).toBe('Some Page');
        });

        it('maps known routes correctly', () => {
            const crumbs = generateBreadcrumbs('/dashboard/chat');
            expect(crumbs[1].label).toBe('AI Chat');
        });
    });

    describe('isDashboardRoute', () => {
        it('returns true for dashboard paths', () => {
            expect(isDashboardRoute('/dashboard')).toBe(true);
            expect(isDashboardRoute('/dashboard/documents')).toBe(true);
        });

        it('returns false for non-dashboard paths', () => {
            expect(isDashboardRoute('/')).toBe(false);
            expect(isDashboardRoute('/login')).toBe(false);
        });
    });

    describe('getParentRoute', () => {
        it('returns parent path', () => {
            expect(getParentRoute('/dashboard/documents')).toBe('/dashboard');
        });

        it('returns root for top-level paths', () => {
            expect(getParentRoute('/dashboard')).toBe('/');
        });
    });
});
