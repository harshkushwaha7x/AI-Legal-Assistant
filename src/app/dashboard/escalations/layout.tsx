import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Lawyer Escalation',
    description:
        'Submit complex legal matters for professional attorney review with priority tracking.',
};

export default function EscalationsLayout({ children }: { children: React.ReactNode }) {
    return children;
}
