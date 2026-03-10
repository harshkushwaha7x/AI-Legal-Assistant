/**
 * Feature flag system for gradual rollouts
 */

interface FeatureFlag {
    name: string;
    description: string;
    enabled: boolean;
    rolloutPercentage?: number;
}

const FLAGS: Record<string, FeatureFlag> = {
    AI_CHAT_V2: {
        name: 'AI Chat V2',
        description: 'New AI chat interface with streaming responses',
        enabled: false,
    },
    ADVANCED_ANALYTICS: {
        name: 'Advanced Analytics',
        description: 'Detailed usage analytics and insights dashboard',
        enabled: false,
    },
    BATCH_REVIEW: {
        name: 'Batch Contract Review',
        description: 'Upload and review multiple contracts simultaneously',
        enabled: false,
    },
    COLLABORATIVE_EDITING: {
        name: 'Collaborative Editing',
        description: 'Real-time collaborative document editing',
        enabled: false,
    },
    DARK_MODE_TOGGLE: {
        name: 'Dark Mode Toggle',
        description: 'Allow users to switch between dark and light themes',
        enabled: true,
    },
    EXPORT_DOCX: {
        name: 'DOCX Export',
        description: 'Export documents as Microsoft Word files',
        enabled: true,
    },
};

/**
 * Check if a feature flag is enabled
 */
export function isFeatureEnabled(flag: keyof typeof FLAGS): boolean {
    const feature = FLAGS[flag];
    if (!feature) return false;

    if (feature.rolloutPercentage !== undefined) {
        const hash = simpleHash(flag);
        return hash % 100 < feature.rolloutPercentage;
    }

    return feature.enabled;
}

/**
 * Get all feature flags
 */
export function getAllFlags(): Record<string, FeatureFlag> {
    return { ...FLAGS };
}

/**
 * Get enabled features only
 */
export function getEnabledFeatures(): string[] {
    return Object.entries(FLAGS)
        .filter(([, flag]) => flag.enabled)
        .map(([key]) => key);
}

function simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}
