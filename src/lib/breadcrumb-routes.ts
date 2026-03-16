/**
 * Breadcrumb route configuration
 * Maps URL paths to human-readable labels for the breadcrumb component
 */

export interface BreadcrumbRoute {
    label: string;
    href: string;
}

const ROUTE_LABELS: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/dashboard/documents': 'Documents',
    '/dashboard/chat': 'AI Chat',
    '/dashboard/review': 'Contract Review',
    '/dashboard/research': 'Legal Research',
    '/dashboard/templates': 'Templates',
    '/dashboard/escalations': 'Escalations',
    '/dashboard/settings': 'Settings',
    '/dashboard/support': 'Support',
    '/dashboard/reviews': 'Reviews',
};

/**
 * Generate breadcrumb items from a pathname
 */
export function generateBreadcrumbs(pathname: string): BreadcrumbRoute[] {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbRoute[] = [];

    let currentPath = '';
    for (const segment of segments) {
        currentPath += `/${segment}`;
        const label = ROUTE_LABELS[currentPath] || formatSegment(segment);
        breadcrumbs.push({ label, href: currentPath });
    }

    return breadcrumbs;
}

/**
 * Format a URL segment as a readable label
 */
function formatSegment(segment: string): string {
    return segment
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Check if a path is a dashboard route
 */
export function isDashboardRoute(pathname: string): boolean {
    return pathname.startsWith('/dashboard');
}

/**
 * Get the parent route for back navigation
 */
export function getParentRoute(pathname: string): string {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length <= 1) return '/';
    segments.pop();
    return '/' + segments.join('/');
}
