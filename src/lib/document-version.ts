/**
 * Document version tracking utility
 * Manages version history for legal documents
 */

export interface DocumentVersion {
    id: string;
    version: number;
    content: string;
    title: string;
    createdAt: string;
    createdBy: string;
    changeDescription: string;
    wordCount: number;
}

export interface VersionHistory {
    documentId: string;
    currentVersion: number;
    versions: DocumentVersion[];
}

/**
 * Create a new version entry
 */
export function createVersion(
    documentId: string,
    version: number,
    content: string,
    title: string,
    userId: string,
    changeDescription: string
): DocumentVersion {
    return {
        id: `${documentId}-v${version}`,
        version,
        content,
        title,
        createdAt: new Date().toISOString(),
        createdBy: userId,
        changeDescription,
        wordCount: content.split(/\s+/).filter(Boolean).length,
    };
}

/**
 * Get a formatted version label
 */
export function formatVersionLabel(version: number): string {
    return `v${version}.0`;
}

/**
 * Calculate changes between two versions
 */
export function getVersionChanges(
    oldVersion: DocumentVersion,
    newVersion: DocumentVersion
): {
    wordCountDelta: number;
    titleChanged: boolean;
    timeBetween: number;
} {
    return {
        wordCountDelta: newVersion.wordCount - oldVersion.wordCount,
        titleChanged: oldVersion.title !== newVersion.title,
        timeBetween:
            new Date(newVersion.createdAt).getTime() -
            new Date(oldVersion.createdAt).getTime(),
    };
}

/**
 * Sort versions by version number (newest first)
 */
export function sortVersions(versions: DocumentVersion[]): DocumentVersion[] {
    return [...versions].sort((a, b) => b.version - a.version);
}

/**
 * Get the latest version from a list
 */
export function getLatestVersion(versions: DocumentVersion[]): DocumentVersion | null {
    if (versions.length === 0) return null;
    return sortVersions(versions)[0];
}

/**
 * Check if content has changed from the latest version
 */
export function hasContentChanged(currentContent: string, latestVersion: DocumentVersion | null): boolean {
    if (!latestVersion) return true;
    return currentContent.trim() !== latestVersion.content.trim();
}
