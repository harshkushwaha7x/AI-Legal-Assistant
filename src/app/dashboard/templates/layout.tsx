import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Document Templates',
    description:
        'Browse pre-built legal document templates — NDAs, contracts, leases, and employment agreements.',
};

export default function TemplatesLayout({ children }: { children: React.ReactNode }) {
    return children;
}
