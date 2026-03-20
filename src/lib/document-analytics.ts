/**
 * Document analytics utility
 * Calculates reading time, complexity metrics, and content statistics
 */

export interface DocumentStats {
    wordCount: number;
    sentenceCount: number;
    paragraphCount: number;
    avgWordsPerSentence: number;
    readingTimeMinutes: number;
    uniqueWordCount: number;
    longestSentenceWords: number;
}

export interface ReadabilityScore {
    score: number;
    level: 'simple' | 'moderate' | 'complex' | 'expert';
    description: string;
}

/**
 * Calculate document statistics
 */
export function calculateDocumentStats(text: string): DocumentStats {
    if (!text.trim()) {
        return {
            wordCount: 0,
            sentenceCount: 0,
            paragraphCount: 0,
            avgWordsPerSentence: 0,
            readingTimeMinutes: 0,
            uniqueWordCount: 0,
            longestSentenceWords: 0,
        };
    }

    const words = text.split(/\s+/).filter(Boolean);
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);

    const sentenceWordCounts = sentences.map(
        (s) => s.split(/\s+/).filter(Boolean).length
    );

    const uniqueWords = new Set(words.map((w) => w.toLowerCase().replace(/[^a-z]/g, '')));

    return {
        wordCount: words.length,
        sentenceCount: sentences.length,
        paragraphCount: paragraphs.length,
        avgWordsPerSentence:
            sentences.length > 0 ? Math.round(words.length / sentences.length) : 0,
        readingTimeMinutes: Math.max(1, Math.ceil(words.length / 200)),
        uniqueWordCount: uniqueWords.size,
        longestSentenceWords: Math.max(0, ...sentenceWordCounts),
    };
}

/**
 * Estimate legal document readability
 * Based on average sentence length and word complexity
 */
export function assessReadability(text: string): ReadabilityScore {
    const stats = calculateDocumentStats(text);

    if (stats.wordCount === 0) {
        return { score: 0, level: 'simple', description: 'No content to analyze.' };
    }

    // Simple heuristic based on avg sentence length and vocabulary density
    const avgSentenceLen = stats.avgWordsPerSentence;
    const vocabDensity = stats.uniqueWordCount / stats.wordCount;

    let score = 0;

    // Longer sentences increase complexity
    if (avgSentenceLen > 25) score += 3;
    else if (avgSentenceLen > 18) score += 2;
    else if (avgSentenceLen > 12) score += 1;

    // Higher vocabulary density indicates more varied language
    if (vocabDensity > 0.7) score += 2;
    else if (vocabDensity > 0.5) score += 1;

    // Longer documents tend to be more complex
    if (stats.wordCount > 5000) score += 2;
    else if (stats.wordCount > 2000) score += 1;

    // Normalize to 1-10
    const normalizedScore = Math.min(10, Math.max(1, score + 2));

    let level: ReadabilityScore['level'];
    let description: string;

    if (normalizedScore <= 3) {
        level = 'simple';
        description = 'Easy to understand. Suitable for general audiences.';
    } else if (normalizedScore <= 5) {
        level = 'moderate';
        description = 'Moderate complexity. May require some legal background.';
    } else if (normalizedScore <= 7) {
        level = 'complex';
        description = 'Complex language. Recommended for legal professionals.';
    } else {
        level = 'expert';
        description = 'Highly complex. Requires specialized legal expertise.';
    }

    return { score: normalizedScore, level, description };
}

/**
 * Extract key legal terms from text
 */
export function extractLegalTerms(text: string): string[] {
    const legalPatterns = [
        'indemnification', 'indemnify', 'liability', 'negligence',
        'breach', 'termination', 'confidential', 'proprietary',
        'jurisdiction', 'arbitration', 'governing law', 'force majeure',
        'warranty', 'representation', 'covenant', 'obligation',
        'remedy', 'damages', 'injunctive', 'intellectual property',
        'non-compete', 'non-solicitation', 'severability', 'waiver',
        'assignment', 'amendment', 'consideration', 'counterpart',
    ];

    const lowerText = text.toLowerCase();
    return legalPatterns.filter((term) => lowerText.includes(term));
}
