/**
 * Application-wide configuration constants
 */

export const APP_CONFIG = {
    name: 'LegalAI',
    description: 'AI-Powered Legal Assistant — Generate documents, review contracts, and research legal topics with AI.',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
} as const;

/**
 * Document types with labels and styling
 */
export const DOC_TYPE_CONFIG: Record<string, { label: string; short: string; color: string }> = {
    NDA: { label: 'Non-Disclosure Agreement', short: 'NDA', color: 'text-blue-400' },
    LEASE: { label: 'Lease Agreement', short: 'Lease', color: 'text-emerald-400' },
    CONTRACT: { label: 'General Contract', short: 'Contract', color: 'text-violet-400' },
    EMPLOYMENT: { label: 'Employment Agreement', short: 'Employment', color: 'text-amber-400' },
    PARTNERSHIP: { label: 'Partnership Agreement', short: 'Partnership', color: 'text-orange-400' },
    CUSTOM: { label: 'Custom Document', short: 'Custom', color: 'text-surface-400' },
};

/**
 * Risk level display configuration
 */
export const RISK_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
    LOW: { label: 'Low Risk', color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
    MEDIUM: { label: 'Medium Risk', color: 'text-amber-400', bg: 'bg-amber-500/15' },
    HIGH: { label: 'High Risk', color: 'text-orange-400', bg: 'bg-orange-500/15' },
    CRITICAL: { label: 'Critical Risk', color: 'text-red-400', bg: 'bg-red-500/15' },
};

/**
 * Document status display configuration
 */
export const DOC_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
    DRAFT: { label: 'Draft', color: 'text-surface-400', bg: 'bg-surface-500/15' },
    REVIEW: { label: 'In Review', color: 'text-blue-400', bg: 'bg-blue-500/15' },
    FINAL: { label: 'Final', color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
    ARCHIVED: { label: 'Archived', color: 'text-surface-500', bg: 'bg-surface-500/10' },
};

/**
 * Application limits
 */
export const APP_LIMITS = {
    MAX_FILE_SIZE: 10 * 1024 * 1024,
    MAX_CONTRACT_TEXT: 100000,
    MAX_CHAT_MESSAGE: 5000,
    MAX_ESCALATION_DESC: 5000,
    PAGINATION_DEFAULT: 20,
    PAGINATION_MAX: 100,
} as const;
