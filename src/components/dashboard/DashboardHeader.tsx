'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    Menu,
    Bell,
    ChevronRight,
    User,
    Settings,
    LogOut,
    CreditCard,
    HelpCircle,
    Crown,
} from 'lucide-react';

/* ── Breadcrumb label map ─────────────────────────────── */
const labelMap: Record<string, string> = {
    dashboard: 'Dashboard',
    documents: 'Documents',
    reviews: 'Contract Review',
    chat: 'AI Chat',
    research: 'Legal Research',
    escalations: 'Escalations',
    templates: 'Templates',
    settings: 'Settings',
    support: 'Help & Support',
};

interface DashboardHeaderProps {
    onMenuToggle: () => void;
}

export default function DashboardHeader({ onMenuToggle }: DashboardHeaderProps) {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    // Build breadcrumbs from pathname
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs = segments.map((seg, i) => ({
        label: labelMap[seg] || seg.charAt(0).toUpperCase() + seg.slice(1),
        href: '/' + segments.slice(0, i + 1).join('/'),
        isLast: i === segments.length - 1,
    }));

    const initials =
        session?.user?.name
            ?.split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2) || '?';

    const tierColor =
        session?.user?.subscription === 'PRO'
            ? 'text-primary-400'
            : session?.user?.subscription === 'ENTERPRISE'
                ? 'text-amber-400'
                : 'text-surface-500';

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/5 bg-surface-950/80 px-4 backdrop-blur-xl sm:px-6">
            {/* Left: hamburger + breadcrumbs */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuToggle}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-surface-400 transition-colors hover:bg-white/5 hover:text-white lg:hidden"
                    aria-label="Toggle sidebar"
                >
                    <Menu className="h-5 w-5" />
                </button>

                {/* Breadcrumbs */}
                <nav className="hidden sm:flex items-center gap-1 text-sm">
                    {breadcrumbs.map((crumb) => (
                        <span key={crumb.href} className="flex items-center gap-1">
                            {crumb.href !== '/dashboard' && (
                                <ChevronRight className="h-3.5 w-3.5 text-surface-600" />
                            )}
                            {crumb.isLast ? (
                                <span className="font-medium text-white">{crumb.label}</span>
                            ) : (
                                <Link
                                    href={crumb.href}
                                    className="text-surface-400 transition-colors hover:text-white"
                                >
                                    {crumb.label}
                                </Link>
                            )}
                        </span>
                    ))}
                </nav>
            </div>

            {/* Right: notifications + profile */}
            <div className="flex items-center gap-2">
                {/* Notifications */}
                <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-surface-400 transition-colors hover:bg-white/5 hover:text-white">
                    <Bell className="h-[18px] w-[18px]" />
                    <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary-500" />
                </button>

                {/* Plan badge */}
                <div className={`hidden sm:flex items-center gap-1.5 rounded-lg border border-white/5 px-2.5 py-1.5 text-xs font-medium ${tierColor}`}>
                    <Crown className="h-3 w-3" />
                    {session?.user?.subscription || 'Free'}
                </div>

                {/* Profile dropdown */}
                <div ref={profileRef} className="relative">
                    <button
                        onClick={() => setProfileOpen(!profileOpen)}
                        className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition-colors hover:bg-white/5"
                    >
                        {session?.user?.image ? (
                            <img
                                src={session.user.image}
                                alt=""
                                className="h-8 w-8 rounded-lg object-cover"
                            />
                        ) : (
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600/20 text-xs font-bold text-primary-400">
                                {initials}
                            </div>
                        )}
                        <div className="hidden md:block text-left">
                            <p className="text-sm font-medium text-white leading-tight">
                                {session?.user?.name || 'User'}
                            </p>
                            <p className="text-[11px] text-surface-500 leading-tight">
                                {session?.user?.email}
                            </p>
                        </div>
                    </button>

                    {/* Dropdown */}
                    {profileOpen && (
                        <div className="absolute right-0 top-full mt-2 w-56 animate-fade-in rounded-xl border border-white/5 bg-surface-900 p-1.5 shadow-xl shadow-black/20">
                            <div className="border-b border-white/5 px-3 py-2.5 mb-1.5">
                                <p className="text-sm font-medium text-white">{session?.user?.name}</p>
                                <p className="text-xs text-surface-500">{session?.user?.email}</p>
                            </div>

                            <Link
                                href="/dashboard/settings"
                                onClick={() => setProfileOpen(false)}
                                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-surface-300 transition-colors hover:bg-white/5 hover:text-white"
                            >
                                <User className="h-4 w-4" />
                                Profile
                            </Link>
                            <Link
                                href="/dashboard/settings?tab=billing"
                                onClick={() => setProfileOpen(false)}
                                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-surface-300 transition-colors hover:bg-white/5 hover:text-white"
                            >
                                <CreditCard className="h-4 w-4" />
                                Billing
                            </Link>
                            <Link
                                href="/dashboard/settings"
                                onClick={() => setProfileOpen(false)}
                                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-surface-300 transition-colors hover:bg-white/5 hover:text-white"
                            >
                                <Settings className="h-4 w-4" />
                                Settings
                            </Link>
                            <Link
                                href="/dashboard/support"
                                onClick={() => setProfileOpen(false)}
                                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-surface-300 transition-colors hover:bg-white/5 hover:text-white"
                            >
                                <HelpCircle className="h-4 w-4" />
                                Help & Support
                            </Link>

                            <div className="my-1.5 border-t border-white/5" />

                            <button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10"
                            >
                                <LogOut className="h-4 w-4" />
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
