import Link from 'next/link';
import { Scale } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

const footerLinks = {
    Product: [
        { label: 'Features', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'API Docs', href: '/docs' },
        { label: 'Changelog', href: '/changelog' },
    ],
    Company: [
        { label: 'About', href: '/about' },
        { label: 'Blog', href: '/blog' },
        { label: 'Careers', href: '/careers' },
        { label: 'Contact', href: '/contact' },
    ],
    Legal: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Cookie Policy', href: '/cookies' },
        { label: 'Disclaimer', href: '/disclaimer' },
    ],
};

export default function Footer() {
    return (
        <footer className="border-t border-white/5 bg-surface-950">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Main footer */}
                <div className="grid grid-cols-2 gap-8 py-12 md:grid-cols-4">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
                                <Scale className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-lg font-bold text-white">{APP_NAME}</span>
                        </Link>
                        <p className="mt-3 text-sm leading-relaxed text-surface-400">
                            AI-powered legal assistant for everyone. Generate documents, review contracts, and get legal answers instantly.
                        </p>
                    </div>

                    {/* Link columns */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title}>
                            <h3 className="text-sm font-semibold text-white">{title}</h3>
                            <ul className="mt-3 space-y-2">
                                {links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-surface-400 transition-colors hover:text-primary-400"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="flex flex-col items-center justify-between gap-4 border-t border-white/5 py-6 sm:flex-row">
                    <p className="text-xs text-surface-500">
                        &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
                    </p>
                    <p className="text-xs text-surface-600">
                        This is an AI tool and does not constitute legal advice. Consult a licensed attorney for legal matters.
                    </p>
                </div>
            </div>
        </footer>
    );
}
