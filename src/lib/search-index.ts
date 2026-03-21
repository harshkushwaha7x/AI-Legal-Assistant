/**
 * Client-side in-memory full-text search index
 * Builds a term-frequency index for fast multi-field search with relevance ranking
 */

export interface SearchRecord {
    id: string;
    [key: string]: unknown;
}

export interface SearchResult<T extends SearchRecord> {
    record: T;
    score: number;
    matchedFields: string[];
}

interface IndexEntry {
    id: string;
    fieldTerms: Record<string, string[]>;
}

interface SearchIndexOptions {
    /** Fields to index for search */
    fields: string[];
    /** Field boost weights (default 1.0) */
    boosts?: Partial<Record<string, number>>;
}

/**
 * Tokenize a string into normalized search terms
 */
function tokenize(text: unknown): string[] {
    if (text === null || text === undefined) return [];
    return String(text)
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, ' ')
        .split(/\s+/)
        .filter((t) => t.length > 1);
}

/**
 * Full-text search index for client-side use
 */
export class SearchIndex<T extends SearchRecord> {
    private entries: Map<string, IndexEntry> = new Map();
    private records: Map<string, T> = new Map();
    private options: Required<SearchIndexOptions>;

    constructor(options: SearchIndexOptions) {
        this.options = {
            fields: options.fields,
            boosts: options.boosts ?? {},
        };
    }

    /**
     * Add or update a record in the index
     */
    add(record: T): void {
        const fieldTerms: Record<string, string[]> = {};

        for (const field of this.options.fields) {
            fieldTerms[field] = tokenize(record[field]);
        }

        this.entries.set(record.id, { id: record.id, fieldTerms });
        this.records.set(record.id, record);
    }

    /**
     * Add multiple records at once
     */
    addAll(records: T[]): void {
        records.forEach((r) => this.add(r));
    }

    /**
     * Remove a record by ID
     */
    remove(id: string): void {
        this.entries.delete(id);
        this.records.delete(id);
    }

    /**
     * Search for records matching the query
     */
    search(query: string, limit = 20): SearchResult<T>[] {
        if (!query.trim()) return [];

        const queryTerms = tokenize(query);
        if (queryTerms.length === 0) return [];

        const results: SearchResult<T>[] = [];

        for (const [id, entry] of this.entries) {
            let score = 0;
            const matchedFields: string[] = [];

            for (const field of this.options.fields) {
                const fieldTokens = entry.fieldTerms[field] || [];
                const boost = (this.options.boosts as Record<string, number>)[field] ?? 1.0;
                let fieldScore = 0;

                for (const term of queryTerms) {
                    // Exact match
                    if (fieldTokens.includes(term)) {
                        fieldScore += 2 * boost;
                    } else {
                        // Partial match
                        const partial = fieldTokens.some((t) => t.includes(term) || term.includes(t));
                        if (partial) fieldScore += 1 * boost;
                    }
                }

                if (fieldScore > 0) {
                    score += fieldScore;
                    matchedFields.push(field);
                }
            }

            if (score > 0) {
                const record = this.records.get(id);
                if (record) {
                    results.push({ record, score, matchedFields });
                }
            }
        }

        // Sort by score descending, then by ID for stability
        return results
            .sort((a, b) => b.score - a.score || a.record.id.localeCompare(b.record.id))
            .slice(0, limit);
    }

    /**
     * Get total number of indexed records
     */
    get size(): number {
        return this.records.size;
    }

    /**
     * Clear all records from the index
     */
    clear(): void {
        this.entries.clear();
        this.records.clear();
    }
}

/**
 * Highlight matching terms in text
 */
export function highlightMatches(
    text: string,
    query: string,
    marker = { open: '<mark>', close: '</mark>' }
): string {
    if (!query.trim()) return text;

    const terms = tokenize(query);
    let result = text;

    for (const term of terms) {
        const regex = new RegExp(`(${term})`, 'gi');
        result = result.replace(regex, `${marker.open}$1${marker.close}`);
    }

    return result;
}
