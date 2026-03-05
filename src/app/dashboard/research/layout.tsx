import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Legal Research',
    description:
        'AI-powered legal research — search statutes, case law, and regulations with intelligent analysis.',
};

export default function ResearchLayout({ children }: { children: React.ReactNode }) {
    return children;
}
