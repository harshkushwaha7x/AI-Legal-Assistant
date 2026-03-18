/**
 * Document comparison utility
 * Compares two text documents and produces a diff summary
 */

export interface DiffChunk {
    type: 'added' | 'removed' | 'unchanged';
    content: string;
    lineStart: number;
    lineEnd: number;
}

export interface DiffSummary {
    chunks: DiffChunk[];
    additions: number;
    deletions: number;
    unchanged: number;
    similarity: number;
}

/**
 * Split text into lines for comparison
 */
function splitLines(text: string): string[] {
    return text.split(/\r?\n/);
}

/**
 * Simple longest common subsequence diff algorithm
 */
export function compareDocuments(original: string, modified: string): DiffSummary {
    const originalLines = splitLines(original);
    const modifiedLines = splitLines(modified);

    // Build LCS table
    const m = originalLines.length;
    const n = modifiedLines.length;
    const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (originalLines[i - 1] === modifiedLines[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    // Backtrack to build diff
    const chunks: DiffChunk[] = [];
    let i = m;
    let j = n;
    const rawDiff: { type: 'added' | 'removed' | 'unchanged'; line: string }[] = [];

    while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && originalLines[i - 1] === modifiedLines[j - 1]) {
            rawDiff.unshift({ type: 'unchanged', line: originalLines[i - 1] });
            i--;
            j--;
        } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
            rawDiff.unshift({ type: 'added', line: modifiedLines[j - 1] });
            j--;
        } else {
            rawDiff.unshift({ type: 'removed', line: originalLines[i - 1] });
            i--;
        }
    }

    // Group consecutive same-type lines into chunks
    let additions = 0;
    let deletions = 0;
    let unchanged = 0;
    let lineCounter = 1;

    for (let k = 0; k < rawDiff.length; k++) {
        const entry = rawDiff[k];
        const lastChunk = chunks[chunks.length - 1];

        if (lastChunk && lastChunk.type === entry.type) {
            lastChunk.content += '\n' + entry.line;
            lastChunk.lineEnd = lineCounter;
        } else {
            chunks.push({
                type: entry.type,
                content: entry.line,
                lineStart: lineCounter,
                lineEnd: lineCounter,
            });
        }

        if (entry.type === 'added') additions++;
        else if (entry.type === 'removed') deletions++;
        else unchanged++;

        lineCounter++;
    }

    const totalLines = Math.max(m, n);
    const similarity = totalLines > 0 ? unchanged / totalLines : 1;

    return { chunks, additions, deletions, unchanged, similarity };
}

/**
 * Generate a human-readable diff summary
 */
export function formatDiffSummary(diff: DiffSummary): string {
    const parts: string[] = [];

    if (diff.additions > 0) {
        parts.push(`${diff.additions} line${diff.additions !== 1 ? 's' : ''} added`);
    }
    if (diff.deletions > 0) {
        parts.push(`${diff.deletions} line${diff.deletions !== 1 ? 's' : ''} removed`);
    }
    if (diff.unchanged > 0) {
        parts.push(`${diff.unchanged} line${diff.unchanged !== 1 ? 's' : ''} unchanged`);
    }

    parts.push(`${(diff.similarity * 100).toFixed(1)}% similar`);

    return parts.join(', ');
}

/**
 * Check if two documents are identical
 */
export function areDocumentsIdentical(a: string, b: string): boolean {
    return a.trim() === b.trim();
}
