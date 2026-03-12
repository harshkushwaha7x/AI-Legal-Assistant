/**
 * Accessibility utilities
 */

/**
 * Generate a unique ID for aria attributes
 */
let counter = 0;
export function generateAriaId(prefix: string = 'aria'): string {
    counter++;
    return `${prefix}-${counter}`;
}

/**
 * Screen reader only text (visually hidden)
 */
export const srOnlyClass = 'absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0';

/**
 * Trap focus within a container element
 */
export function trapFocus(container: HTMLElement): () => void {
    const focusableSelectors = [
        'a[href]',
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    const focusableElements = container.querySelectorAll(focusableSelectors);
    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

    function handleKeyDown(e: KeyboardEvent) {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable?.focus();
            }
        } else {
            if (document.activeElement === lastFocusable) {
                e.preventDefault();
                firstFocusable?.focus();
            }
        }
    }

    container.addEventListener('keydown', handleKeyDown);
    firstFocusable?.focus();

    return () => container.removeEventListener('keydown', handleKeyDown);
}

/**
 * Announce a message to screen readers via live region
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    const el = document.createElement('div');
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', priority);
    el.setAttribute('aria-atomic', 'true');
    el.className = srOnlyClass;
    el.textContent = message;
    document.body.appendChild(el);

    setTimeout(() => {
        document.body.removeChild(el);
    }, 1000);
}

/**
 * Common ARIA role descriptions
 */
export const ARIA_LABELS = {
    closeButton: 'Close',
    menuButton: 'Open menu',
    searchInput: 'Search',
    notification: 'Notification',
    loading: 'Loading content',
    expandSection: 'Expand section',
    collapseSection: 'Collapse section',
    pagination: 'Page navigation',
    sortAscending: 'Sort ascending',
    sortDescending: 'Sort descending',
} as const;
