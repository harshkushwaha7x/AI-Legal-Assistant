import {
    formatShortcut,
    getShortcutsByCategory,
    KEYBOARD_SHORTCUTS,
} from '@/lib/keyboard-shortcuts';

describe('Keyboard Shortcuts', () => {
    describe('KEYBOARD_SHORTCUTS', () => {
        it('contains multiple shortcuts', () => {
            expect(KEYBOARD_SHORTCUTS.length).toBeGreaterThan(5);
        });

        it('each shortcut has required fields', () => {
            KEYBOARD_SHORTCUTS.forEach((s) => {
                expect(s.key).toBeTruthy();
                expect(s.description).toBeTruthy();
                expect(s.category).toBeTruthy();
            });
        });
    });

    describe('formatShortcut', () => {
        it('formats simple key', () => {
            const result = formatShortcut({ key: '/', description: 'test', category: 'UI' });
            expect(result).toBe('/');
        });

        it('formats ctrl+key', () => {
            const result = formatShortcut({ key: 'k', ctrl: true, description: 'test', category: 'Nav' });
            expect(result).toBe('Ctrl+K');
        });

        it('formats ctrl+shift+key', () => {
            const result = formatShortcut({ key: 'd', ctrl: true, shift: true, description: 'test', category: 'Nav' });
            expect(result).toBe('Ctrl+Shift+D');
        });

        it('formats special keys', () => {
            const result = formatShortcut({ key: 'Escape', description: 'test', category: 'UI' });
            expect(result).toBe('Escape');
        });
    });

    describe('getShortcutsByCategory', () => {
        it('groups shortcuts by category', () => {
            const groups = getShortcutsByCategory();
            expect(groups).toHaveProperty('Navigation');
            expect(groups).toHaveProperty('Actions');
            expect(groups).toHaveProperty('UI');
        });

        it('contains all shortcuts', () => {
            const groups = getShortcutsByCategory();
            const totalInGroups = Object.values(groups).reduce(
                (sum, arr) => sum + arr.length,
                0
            );
            expect(totalInGroups).toBe(KEYBOARD_SHORTCUTS.length);
        });
    });
});
