import {
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    getPermissions,
    getRoles,
    isRoleAtLeast,
} from '@/lib/permissions';

describe('Permissions', () => {
    describe('hasPermission', () => {
        it('admin has all permissions', () => {
            expect(hasPermission('admin', 'documents:create')).toBe(true);
            expect(hasPermission('admin', 'users:manage')).toBe(true);
            expect(hasPermission('admin', 'billing:manage')).toBe(true);
        });

        it('viewer has limited permissions', () => {
            expect(hasPermission('viewer', 'documents:read')).toBe(true);
            expect(hasPermission('viewer', 'documents:create')).toBe(false);
            expect(hasPermission('viewer', 'users:manage')).toBe(false);
        });

        it('client can read but not delete', () => {
            expect(hasPermission('client', 'documents:read')).toBe(true);
            expect(hasPermission('client', 'documents:delete')).toBe(false);
        });

        it('attorney can approve reviews', () => {
            expect(hasPermission('attorney', 'reviews:approve')).toBe(true);
        });

        it('paralegal cannot approve reviews', () => {
            expect(hasPermission('paralegal', 'reviews:approve')).toBe(false);
        });
    });

    describe('hasAllPermissions', () => {
        it('returns true when all permissions present', () => {
            expect(hasAllPermissions('admin', ['documents:read', 'documents:create'])).toBe(true);
        });

        it('returns false when any permission missing', () => {
            expect(hasAllPermissions('viewer', ['documents:read', 'documents:create'])).toBe(false);
        });
    });

    describe('hasAnyPermission', () => {
        it('returns true when at least one permission present', () => {
            expect(hasAnyPermission('viewer', ['documents:read', 'documents:create'])).toBe(true);
        });

        it('returns false when no permissions match', () => {
            expect(hasAnyPermission('viewer', ['documents:create', 'users:manage'])).toBe(false);
        });
    });

    describe('getPermissions', () => {
        it('returns permissions array for a role', () => {
            const perms = getPermissions('client');
            expect(Array.isArray(perms)).toBe(true);
            expect(perms).toContain('documents:read');
            expect(perms).not.toContain('users:manage');
        });

        it('admin has the most permissions', () => {
            const adminPerms = getPermissions('admin');
            const viewerPerms = getPermissions('viewer');
            expect(adminPerms.length).toBeGreaterThan(viewerPerms.length);
        });
    });

    describe('getRoles', () => {
        it('returns all 5 roles', () => {
            const roles = getRoles();
            expect(roles).toHaveLength(5);
            expect(roles).toContain('admin');
            expect(roles).toContain('viewer');
        });
    });

    describe('isRoleAtLeast', () => {
        it('admin is at least viewer', () => {
            expect(isRoleAtLeast('admin', 'viewer')).toBe(true);
        });

        it('viewer is not at least attorney', () => {
            expect(isRoleAtLeast('viewer', 'attorney')).toBe(false);
        });

        it('role is at least itself', () => {
            expect(isRoleAtLeast('paralegal', 'paralegal')).toBe(true);
        });

        it('follows hierarchy: viewer < client < paralegal < attorney < admin', () => {
            expect(isRoleAtLeast('client', 'viewer')).toBe(true);
            expect(isRoleAtLeast('paralegal', 'client')).toBe(true);
            expect(isRoleAtLeast('attorney', 'paralegal')).toBe(true);
            expect(isRoleAtLeast('admin', 'attorney')).toBe(true);
        });
    });
});
