'use client';

import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface Tab {
    id: string;
    label: string;
    icon?: LucideIcon;
    href?: string;
    count?: number;
}

interface TabsProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (id: string) => void;
}

export default function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
    return (
        <div className="flex items-center gap-1 rounded-xl bg-white/[2%] p-1 ring-1 ring-white/5">
            {tabs.map((tab) => {
                const isActive = tab.id === activeTab;
                const content = (
                    <>
                        {tab.icon && <tab.icon className={`h-3.5 w-3.5 ${isActive ? 'text-primary-400' : ''}`} />}
                        <span>{tab.label}</span>
                        {tab.count !== undefined && (
                            <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${isActive
                                    ? 'bg-primary-500/15 text-primary-400'
                                    : 'bg-white/5 text-surface-600'
                                }`}>
                                {tab.count}
                            </span>
                        )}
                    </>
                );

                const className = `flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition-all ${isActive
                        ? 'bg-white/5 text-white shadow-sm'
                        : 'text-surface-400 hover:text-surface-200'
                    }`;

                if (tab.href) {
                    return (
                        <Link key={tab.id} href={tab.href} className={className}>
                            {content}
                        </Link>
                    );
                }

                return (
                    <button key={tab.id} onClick={() => onTabChange(tab.id)} className={className}>
                        {content}
                    </button>
                );
            })}
        </div>
    );
}
