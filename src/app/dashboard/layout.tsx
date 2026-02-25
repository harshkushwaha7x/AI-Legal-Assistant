import type { Metadata } from 'next';
import DashboardShell from '@/components/dashboard/DashboardShell';

export const metadata: Metadata = {
    title: 'Dashboard',
    description: 'Your LegalAI dashboard — manage documents, reviews, and legal AI tools.',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return <DashboardShell>{children}</DashboardShell>;
}
