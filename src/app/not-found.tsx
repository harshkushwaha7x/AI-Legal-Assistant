import Link from 'next/link';
import { Scale, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 px-4 text-center">
            <div className="relative mb-8">
                <div className="absolute inset-0 rounded-full bg-primary-600/15 animate-pulse-glow" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary-600/10 ring-1 ring-primary-500/20">
                    <Scale className="h-10 w-10 text-primary-400" />
                </div>
            </div>

            <h1 className="text-7xl font-black text-white">404</h1>
            <h2 className="mt-3 text-xl font-bold text-surface-300">Page Not Found</h2>
            <p className="mt-2 max-w-md text-sm text-surface-500">
                The page you&apos;re looking for doesn&apos;t exist or has been moved.
                Check the URL or navigate back to a known page.
            </p>

            <div className="mt-8 flex items-center gap-3">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition-all hover:bg-primary-500"
                >
                    <Home className="h-4 w-4" />
                    Go Home
                </Link>
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-6 py-3 text-sm font-medium text-surface-300 transition-all hover:bg-white/5 hover:text-white"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Dashboard
                </Link>
            </div>
        </div>
    );
}
