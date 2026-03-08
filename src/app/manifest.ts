import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'LegalAI — AI-Powered Legal Assistant',
        short_name: 'LegalAI',
        description: 'Generate legal documents, review contracts, and get AI-powered legal answers.',
        start_url: '/dashboard',
        display: 'standalone',
        background_color: '#020617',
        theme_color: '#4f46e5',
        orientation: 'portrait-primary',
        categories: ['productivity', 'business', 'utilities'],
        icons: [
            {
                src: '/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
            },
            {
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
        ],
    };
}
