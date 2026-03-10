'use client';

import { Scale, Heart } from 'lucide-react';
import Link from 'next/link';

export default function DashboardFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-auto border-t border-white/5 px-6 py-4">
            <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
                <div className="flex items-center gap-2 text-xs text-surface-500">
                    <Scale className="h-3 w-3" />
                    <span>© {currentYear} LegalAI. All rights reserved.</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-surface-600">
                    <Link href="/dashboard/support" className="transition-colors hover:text-surface-300">
                        Help
                    </Link>
                    <Link href="/dashboard/settings" className="transition-colors hover:text-surface-300">
                        Settings
                    </Link>
                    <span className="flex items-center gap-1">
                        Built with <Heart className="h-3 w-3 text-red-400" /> by LegalAI
                    </span>
                </div>
            </div>
        </footer>
    );
}
