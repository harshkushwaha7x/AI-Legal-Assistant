'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav className="mb-4 flex items-center gap-1.5 text-xs text-surface-500">
            <Link
                href="/dashboard"
                className="flex items-center gap-1 transition-colors hover:text-white"
            >
                <Home className="h-3 w-3" />
                <span>Dashboard</span>
            </Link>
            {items.map((item, i) => (
                <span key={i} className="flex items-center gap-1.5">
                    <ChevronRight className="h-3 w-3 text-surface-700" />
                    {item.href ? (
                        <Link
                            href={item.href}
                            className="transition-colors hover:text-white"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-surface-300 font-medium">{item.label}</span>
                    )}
                </span>
            ))}
        </nav>
    );
}
