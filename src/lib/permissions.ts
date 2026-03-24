/**
 * Permission system for role-based access control
 * Defines roles, permissions, and authorization checks
 */

export type Role = 'admin' | 'attorney' | 'paralegal' | 'client' | 'viewer';

export type Permission =
    | 'documents:create'
    | 'documents:read'
    | 'documents:update'
    | 'documents:delete'
    | 'documents:share'
    | 'documents:export'
    | 'reviews:create'
    | 'reviews:read'
    | 'reviews:approve'
    | 'escalations:create'
    | 'escalations:read'
    | 'escalations:resolve'
    | 'chat:access'
    | 'templates:manage'
    | 'users:manage'
    | 'settings:manage'
    | 'audit:read'
    | 'billing:manage';

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
    admin: [
        'documents:create', 'documents:read', 'documents:update', 'documents:delete',
        'documents:share', 'documents:export',
        'reviews:create', 'reviews:read', 'reviews:approve',
        'escalations:create', 'escalations:read', 'escalations:resolve',
        'chat:access', 'templates:manage', 'users:manage', 'settings:manage',
        'audit:read', 'billing:manage',
    ],
    attorney: [
        'documents:create', 'documents:read', 'documents:update',
        'documents:share', 'documents:export',
        'reviews:create', 'reviews:read', 'reviews:approve',
        'escalations:create', 'escalations:read', 'escalations:resolve',
        'chat:access', 'templates:manage', 'audit:read',
    ],
    paralegal: [
        'documents:create', 'documents:read', 'documents:update',
        'documents:share', 'documents:export',
        'reviews:create', 'reviews:read',
        'escalations:create', 'escalations:read',
        'chat:access',
    ],
    client: [
        'documents:read', 'documents:export',
        'reviews:read',
        'escalations:create', 'escalations:read',
        'chat:access',
    ],
    viewer: [
        'documents:read',
        'reviews:read',
        'escalations:read',
    ],
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: Role, permission: Permission): boolean {
    return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/**
 * Check if a role has ALL of the specified permissions
 */
export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
    return permissions.every((p) => hasPermission(role, p));
}

/**
 * Check if a role has ANY of the specified permissions
 */
export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
    return permissions.some((p) => hasPermission(role, p));
}

/**
 * Get all permissions for a role
 */
export function getPermissions(role: Role): Permission[] {
    return [...(ROLE_PERMISSIONS[role] || [])];
}

/**
 * Get all available roles
 */
export function getRoles(): Role[] {
    return Object.keys(ROLE_PERMISSIONS) as Role[];
}

/**
 * Check if roleA has higher or equal privilege than roleB
 */
export function isRoleAtLeast(roleA: Role, minimumRole: Role): boolean {
    const hierarchy: Role[] = ['viewer', 'client', 'paralegal', 'attorney', 'admin'];
    return hierarchy.indexOf(roleA) >= hierarchy.indexOf(minimumRole);
}
