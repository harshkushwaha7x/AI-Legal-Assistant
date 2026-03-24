'use client';

import { useMemo } from 'react';
import { Shield, ShieldCheck, ShieldAlert, ShieldX, Users } from 'lucide-react';
import { type Role, getPermissions, isRoleAtLeast } from '@/lib/permissions';

interface RolePermissionsViewProps {
    role: Role;
    highlightPermissions?: string[];
}

const ROLE_META: Record<Role, { label: string; color: string; icon: React.ElementType; bg: string }> = {
    admin: { label: 'Administrator', color: 'text-red-400', icon: ShieldAlert, bg: 'bg-red-500/10' },
    attorney: { label: 'Attorney', color: 'text-violet-400', icon: ShieldCheck, bg: 'bg-violet-500/10' },
    paralegal: { label: 'Paralegal', color: 'text-blue-400', icon: Shield, bg: 'bg-blue-500/10' },
    client: { label: 'Client', color: 'text-emerald-400', icon: Users, bg: 'bg-emerald-500/10' },
    viewer: { label: 'Viewer', color: 'text-surface-400', icon: ShieldX, bg: 'bg-surface-500/10' },
};

const PERMISSION_GROUPS: Record<string, { label: string; permissions: string[] }> = {
    documents: {
        label: 'Documents',
        permissions: ['documents:create', 'documents:read', 'documents:update', 'documents:delete', 'documents:share', 'documents:export'],
    },
    reviews: {
        label: 'Reviews',
        permissions: ['reviews:create', 'reviews:read', 'reviews:approve'],
    },
    escalations: {
        label: 'Escalations',
        permissions: ['escalations:create', 'escalations:read', 'escalations:resolve'],
    },
    system: {
        label: 'System',
        permissions: ['chat:access', 'templates:manage', 'users:manage', 'settings:manage', 'audit:read', 'billing:manage'],
    },
};

export default function RolePermissionsView({ role, highlightPermissions = [] }: RolePermissionsViewProps) {
    const meta = ROLE_META[role];
    const Icon = meta.icon;
    const permissions = useMemo(() => new Set(getPermissions(role)), [role]);

    return (
        <div className="glass-card rounded-2xl p-5 space-y-4">
            {/* Role header */}
            <div className="flex items-center gap-3">
                <div className={`rounded-lg p-2 ${meta.bg}`}>
                    <Icon className={`h-5 w-5 ${meta.color}`} />
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-white">{meta.label}</h3>
                    <p className="text-[10px] text-surface-500">
                        {permissions.size} permission{permissions.size !== 1 ? 's' : ''}
                    </p>
                </div>
            </div>

            {/* Permission groups */}
            <div className="space-y-3">
                {Object.entries(PERMISSION_GROUPS).map(([key, group]) => (
                    <div key={key}>
                        <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-surface-600">
                            {group.label}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            {group.permissions.map((perm) => {
                                const has = permissions.has(perm);
                                const action = perm.split(':')[1];
                                const highlighted = highlightPermissions.includes(perm);

                                return (
                                    <span
                                        key={perm}
                                        className={`rounded-md px-2 py-0.5 text-[10px] transition-colors ${
                                            has
                                                ? highlighted
                                                    ? 'bg-primary-500/20 text-primary-300 ring-1 ring-primary-500/30'
                                                    : 'bg-white/5 text-surface-300'
                                                : 'bg-white/[2%] text-surface-700 line-through'
                                        }`}
                                    >
                                        {action}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
