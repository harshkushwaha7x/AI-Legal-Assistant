import type { Metadata } from 'next';

/**
 * SEO metadata generation utilities
 */

const SITE_NAME = 'LegalAI';
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://legalai.app';
const DEFAULT_DESCRIPTION =
    'AI-powered legal assistant for document generation, contract review, and legal research. Get instant legal information in plain English.';

/**
 * Generate metadata for a page
 */
export function generatePageMetadata({
    title,
    description,
    path = '',
    noIndex = false,
}: {
    title: string;
    description?: string;
    path?: string;
    noIndex?: boolean;
}): Metadata {
    const fullTitle = `${title} | ${SITE_NAME}`;
    const desc = description || DEFAULT_DESCRIPTION;
    const url = `${SITE_URL}${path}`;

    return {
        title: fullTitle,
        description: desc,
        openGraph: {
            title: fullTitle,
            description: desc,
            url,
            siteName: SITE_NAME,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: fullTitle,
            description: desc,
        },
        alternates: {
            canonical: url,
        },
        ...(noIndex && {
            robots: {
                index: false,
                follow: false,
            },
        }),
    };
}

/**
 * Structured data for legal service (JSON-LD)
 */
export function generateLegalServiceSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: SITE_NAME,
        applicationCategory: 'LegalService',
        description: DEFAULT_DESCRIPTION,
        url: SITE_URL,
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
        },
        operatingSystem: 'Web',
    };
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbSchema(
    items: { name: string; href: string }[]
) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `${SITE_URL}${item.href}`,
        })),
    };
}
