import {
    createVersion,
    formatVersionLabel,
    getVersionChanges,
    sortVersions,
    getLatestVersion,
    hasContentChanged,
    type DocumentVersion,
} from '@/lib/document-version';

describe('Document Version', () => {
    describe('createVersion', () => {
        it('creates a version with correct fields', () => {
            const v = createVersion('doc-1', 1, 'Hello world content', 'Test Doc', 'user-1', 'Initial');
            expect(v.id).toBe('doc-1-v1');
            expect(v.version).toBe(1);
            expect(v.title).toBe('Test Doc');
            expect(v.createdBy).toBe('user-1');
            expect(v.changeDescription).toBe('Initial');
            expect(v.wordCount).toBe(3);
            expect(v.createdAt).toBeTruthy();
        });
    });

    describe('formatVersionLabel', () => {
        it('formats version number', () => {
            expect(formatVersionLabel(1)).toBe('v1.0');
            expect(formatVersionLabel(10)).toBe('v10.0');
        });
    });

    describe('getVersionChanges', () => {
        it('calculates word count delta', () => {
            const v1 = createVersion('d', 1, 'one two', 'Title', 'u', 'v1');
            const v2 = createVersion('d', 2, 'one two three four', 'Title', 'u', 'v2');
            const changes = getVersionChanges(v1, v2);
            expect(changes.wordCountDelta).toBe(2);
            expect(changes.titleChanged).toBe(false);
        });

        it('detects title change', () => {
            const v1 = createVersion('d', 1, 'text', 'Old Title', 'u', 'v1');
            const v2 = createVersion('d', 2, 'text', 'New Title', 'u', 'v2');
            const changes = getVersionChanges(v1, v2);
            expect(changes.titleChanged).toBe(true);
        });
    });

    describe('sortVersions', () => {
        it('sorts newest first', () => {
            const versions: DocumentVersion[] = [
                createVersion('d', 1, 'a', 't', 'u', ''),
                createVersion('d', 3, 'c', 't', 'u', ''),
                createVersion('d', 2, 'b', 't', 'u', ''),
            ];
            const sorted = sortVersions(versions);
            expect(sorted[0].version).toBe(3);
            expect(sorted[1].version).toBe(2);
            expect(sorted[2].version).toBe(1);
        });
    });

    describe('getLatestVersion', () => {
        it('returns highest version', () => {
            const versions = [
                createVersion('d', 1, 'a', 't', 'u', ''),
                createVersion('d', 3, 'c', 't', 'u', ''),
            ];
            const latest = getLatestVersion(versions);
            expect(latest?.version).toBe(3);
        });

        it('returns null for empty array', () => {
            expect(getLatestVersion([])).toBeNull();
        });
    });

    describe('hasContentChanged', () => {
        it('returns true when content differs', () => {
            const v = createVersion('d', 1, 'old content', 't', 'u', '');
            expect(hasContentChanged('new content', v)).toBe(true);
        });

        it('returns false when content is same', () => {
            const v = createVersion('d', 1, 'same content', 't', 'u', '');
            expect(hasContentChanged('same content', v)).toBe(false);
        });

        it('returns true when no latest version', () => {
            expect(hasContentChanged('anything', null)).toBe(true);
        });
    });
});
