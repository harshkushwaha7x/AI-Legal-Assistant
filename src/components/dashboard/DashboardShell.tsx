'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

export default function DashboardShell({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname();

    // Close mobile sidebar on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    return (
        <div className="flex min-h-screen bg-surface-950">
            {/* Desktop sidebar */}
            <div className="hidden lg:block">
                <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
            </div>

            {/* Mobile sidebar overlay */}
            {mobileOpen && (
                <>
                    <div
                        className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
                        onClick={() => setMobileOpen(false)}
                    />
                    <div className="fixed inset-y-0 left-0 z-40 lg:hidden">
                        <Sidebar collapsed={false} onToggle={() => setMobileOpen(false)} />
                    </div>
                </>
            )}

            {/* Main content area */}
            <div
                className={`flex flex-1 flex-col transition-all duration-300 ${collapsed ? 'lg:ml-[68px]' : 'lg:ml-[260px]'
                    }`}
            >
                <DashboardHeader onMenuToggle={() => setMobileOpen(!mobileOpen)} />
                <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
            </div>
        </div>
    );
}
