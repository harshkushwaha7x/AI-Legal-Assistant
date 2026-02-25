'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Scale,
    LayoutDashboard,
    FileText,
    ShieldCheck,
    MessageSquare,
    Search,
    UserCheck,
    Building2,
    Settings,
    HelpCircle,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

const navSections = [
    {
        label: 'Main',
        items: [
            { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
            { icon: FileText, label: 'Documents', href: '/dashboard/documents' },
            { icon: ShieldCheck, label: 'Contract Review', href: '/dashboard/reviews' },
            { icon: MessageSquare, label: 'AI Chat', href: '/dashboard/chat' },
            { icon: Search, label: 'Legal Research', href: '/dashboard/research' },
        ],
    },
    {
        label: 'Manage',
        items: [
            { icon: UserCheck, label: 'Escalations', href: '/dashboard/escalations' },
            { icon: Building2, label: 'Templates', href: '/dashboard/templates' },
        ],
    },
    {
        label: 'Account',
        items: [
            { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
            { icon: HelpCircle, label: 'Help & Support', href: '/dashboard/support' },
        ],
    },
];

interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside
            className={`fixed left-0 top-0 z-40 flex h-full flex-col border-r border-white/5 bg-surface-950 transition-all duration-300 ${collapsed ? 'w-[68px]' : 'w-[260px]'
                }`}
        >
            {/* Logo */}
            <div className="flex h-16 items-center justify-between border-b border-white/5 px-4">
                <Link href="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-600">
                        <Scale className="h-5 w-5 text-white" />
                    </div>
                    {!collapsed && (
                        <span className="text-lg font-bold text-white whitespace-nowrap">LegalAI</span>
                    )}
                </Link>
                <button
                    onClick={onToggle}
                    className="hidden lg:flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-surface-400 transition-colors hover:bg-white/5 hover:text-white"
                    aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {collapsed ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <ChevronLeft className="h-4 w-4" />
                    )}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 py-4">
                {navSections.map((section) => (
                    <div key={section.label} className="mb-6">
                        {!collapsed && (
                            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-surface-500">
                                {section.label}
                            </p>
                        )}
                        <ul className="space-y-1">
                            {section.items.map((item) => {
                                const isActive =
                                    pathname === item.href ||
                                    (item.href !== '/dashboard' && pathname.startsWith(item.href));
                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${isActive
                                                    ? 'bg-primary-600/15 text-primary-400'
                                                    : 'text-surface-400 hover:bg-white/5 hover:text-white'
                                                }`}
                                            title={collapsed ? item.label : undefined}
                                        >
                                            <item.icon
                                                className={`h-[18px] w-[18px] shrink-0 ${isActive ? 'text-primary-400' : 'text-surface-500 group-hover:text-white'
                                                    }`}
                                            />
                                            {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
                                            {isActive && !collapsed && (
                                                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-400" />
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>

            {/* Bottom section */}
            {!collapsed && (
                <div className="border-t border-white/5 p-4">
                    <div className="rounded-xl border border-primary-500/20 bg-primary-500/5 p-3">
                        <p className="text-xs font-semibold text-primary-300">Upgrade to Pro</p>
                        <p className="mt-1 text-[11px] leading-relaxed text-surface-400">
                            Unlock unlimited documents, advanced AI, and more.
                        </p>
                        <Link
                            href="/dashboard/settings?tab=billing"
                            className="mt-2.5 block rounded-lg bg-primary-600 py-1.5 text-center text-xs font-semibold text-white transition-colors hover:bg-primary-500"
                        >
                            Upgrade Now
                        </Link>
                    </div>
                </div>
            )}
        </aside>
    );
}
