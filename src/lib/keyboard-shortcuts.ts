/**
 * Keyboard shortcuts configuration
 * Central registry of all keyboard shortcuts used in the application
 */

export interface ShortcutConfig {
    key: string;
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    description: string;
    category: string;
}

export const KEYBOARD_SHORTCUTS: ShortcutConfig[] = [
    // Navigation
    { key: 'k', ctrl: true, description: 'Open command palette', category: 'Navigation' },
    { key: 'h', ctrl: true, description: 'Go to dashboard home', category: 'Navigation' },
    { key: 'd', ctrl: true, shift: true, description: 'Go to documents', category: 'Navigation' },
    { key: 'j', ctrl: true, description: 'Go to AI chat', category: 'Navigation' },

    // Actions
    { key: 'n', ctrl: true, description: 'Create new document', category: 'Actions' },
    { key: 's', ctrl: true, description: 'Save current document', category: 'Actions' },
    { key: 'e', ctrl: true, description: 'Export current document', category: 'Actions' },

    // UI
    { key: '/', description: 'Focus search', category: 'UI' },
    { key: '?', shift: true, description: 'Show keyboard shortcuts', category: 'UI' },
    { key: 'Escape', description: 'Close modal or dialog', category: 'UI' },
    { key: '.', ctrl: true, description: 'Toggle sidebar', category: 'UI' },
];

/**
 * Get shortcuts grouped by category
 */
export function getShortcutsByCategory(): Record<string, ShortcutConfig[]> {
    return KEYBOARD_SHORTCUTS.reduce(
        (groups, shortcut) => {
            if (!groups[shortcut.category]) {
                groups[shortcut.category] = [];
            }
            groups[shortcut.category].push(shortcut);
            return groups;
        },
        {} as Record<string, ShortcutConfig[]>
    );
}

/**
 * Format a shortcut for display (e.g., "Ctrl+K")
 */
export function formatShortcut(shortcut: ShortcutConfig): string {
    const parts: string[] = [];
    if (shortcut.ctrl) parts.push('Ctrl');
    if (shortcut.shift) parts.push('Shift');
    if (shortcut.alt) parts.push('Alt');
    parts.push(shortcut.key.length === 1 ? shortcut.key.toUpperCase() : shortcut.key);
    return parts.join('+');
}
