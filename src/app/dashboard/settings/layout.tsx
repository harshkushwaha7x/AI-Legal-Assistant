import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Settings',
    description: 'Manage your LegalAI account preferences, notifications, and configuration.',
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    return children;
}
