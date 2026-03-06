import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function DashboardNotFound() {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-800 ring-1 ring-white/10">
                <Search className="h-8 w-8 text-surface-500" />
            </div>

            <h2 className="text-2xl font-bold text-white">Page Not Found</h2>
            <p className="mt-2 max-w-sm text-sm text-surface-400">
                This dashboard page doesn&apos;t exist. Check the URL or navigate back to the dashboard.
            </p>

            <div className="mt-8 flex items-center gap-3">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-500"
                >
                    <Home className="h-4 w-4" />
                    Dashboard
                </Link>
                <button
                    onClick={() => history.back()}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-surface-300 transition-all hover:bg-white/5"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Go Back
                </button>
            </div>
        </div>
    );
}
