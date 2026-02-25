import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import AuthProvider from '@/components/providers/AuthProvider';
import './globals.css';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
});

export const metadata: Metadata = {
    title: {
        default: 'LegalAI — AI-Powered Legal Assistant',
        template: '%s | LegalAI',
    },
    description:
        'Generate legal documents, review contracts with AI risk scoring, and get instant legal answers. Built for individuals and law firms.',
    keywords: [
        'AI legal assistant',
        'contract review',
        'legal document generator',
        'NDA generator',
        'AI lawyer',
        'legal tech',
        'contract analysis',
    ],
    authors: [{ name: 'LegalAI' }],
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://legalai.app',
        siteName: 'LegalAI',
        title: 'LegalAI — AI-Powered Legal Assistant',
        description:
            'Generate legal documents, review contracts with AI risk scoring, and get instant legal answers.',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'LegalAI — AI-Powered Legal Assistant',
        description:
            'Generate legal documents, review contracts with AI risk scoring, and get instant legal answers.',
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className={inter.variable}>
            <body className="min-h-screen bg-surface-950 text-surface-100 antialiased">
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
