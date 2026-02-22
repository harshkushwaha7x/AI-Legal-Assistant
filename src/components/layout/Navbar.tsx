'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Scale } from 'lucide-react';
import { NAV_ITEMS, APP_NAME } from '@/lib/constants';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? 'glass shadow-lg shadow-black/10'
                    : 'bg-transparent'
                }`}
        >
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 transition-transform group-hover:scale-110">
                            <Scale className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white">
                            {APP_NAME}
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex md:items-center md:gap-1">
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="rounded-lg px-4 py-2 text-sm font-medium text-surface-300 transition-colors hover:bg-white/5 hover:text-white"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop auth */}
                    <div className="hidden md:flex md:items-center md:gap-3">
                        <Link
                            href="/login"
                            className="rounded-lg px-4 py-2 text-sm font-medium text-surface-300 transition-colors hover:text-white"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/signup"
                            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-600/25"
                        >
                            Get Started
                        </Link>
                    </div>

                    {/* Mobile toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="inline-flex items-center justify-center rounded-lg p-2 text-surface-400 hover:bg-white/5 hover:text-white md:hidden"
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile menu */}
                {isOpen && (
                    <div className="border-t border-white/5 pb-4 pt-2 md:hidden animate-fade-in">
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className="block rounded-lg px-4 py-2.5 text-sm font-medium text-surface-300 transition-colors hover:bg-white/5 hover:text-white"
                            >
                                {item.label}
                            </Link>
                        ))}
                        <div className="mt-3 flex flex-col gap-2 px-4">
                            <Link
                                href="/login"
                                className="rounded-lg border border-white/10 px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-white/5"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/signup"
                                className="rounded-lg bg-primary-600 px-4 py-2.5 text-center text-sm font-medium text-white transition-all hover:bg-primary-500"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}
