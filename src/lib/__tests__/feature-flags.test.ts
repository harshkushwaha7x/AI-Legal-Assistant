import { isFeatureEnabled, getAllFlags, getEnabledFeatures } from '@/lib/feature-flags';

describe('Feature Flags', () => {
    describe('isFeatureEnabled', () => {
        it('returns true for enabled features', () => {
            expect(isFeatureEnabled('DARK_MODE_TOGGLE')).toBe(true);
            expect(isFeatureEnabled('EXPORT_DOCX')).toBe(true);
        });

        it('returns false for disabled features', () => {
            expect(isFeatureEnabled('AI_CHAT_V2')).toBe(false);
            expect(isFeatureEnabled('ADVANCED_ANALYTICS')).toBe(false);
        });

        it('returns false for unknown flags', () => {
            expect(isFeatureEnabled('NONEXISTENT_FLAG' as never)).toBe(false);
        });
    });

    describe('getAllFlags', () => {
        it('returns all feature flags', () => {
            const flags = getAllFlags();
            expect(flags).toHaveProperty('AI_CHAT_V2');
            expect(flags).toHaveProperty('DARK_MODE_TOGGLE');
            expect(flags).toHaveProperty('EXPORT_DOCX');
        });

        it('returns a copy (not mutable reference)', () => {
            const flags = getAllFlags();
            flags['NEW_FLAG' as string] = {
                name: 'test',
                description: 'test',
                enabled: true,
            };
            expect(getAllFlags()).not.toHaveProperty('NEW_FLAG');
        });
    });

    describe('getEnabledFeatures', () => {
        it('returns only enabled feature keys', () => {
            const enabled = getEnabledFeatures();
            expect(enabled).toContain('DARK_MODE_TOGGLE');
            expect(enabled).toContain('EXPORT_DOCX');
            expect(enabled).not.toContain('AI_CHAT_V2');
        });

        it('returns an array of strings', () => {
            const enabled = getEnabledFeatures();
            enabled.forEach((key) => {
                expect(typeof key).toBe('string');
            });
        });
    });
});
