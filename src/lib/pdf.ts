/**
 * File text extraction utilities
 *
 * Server-side helpers for extracting text content from uploaded files.
 * PDF extraction requires a runtime library; this provides the dispatch
 * interface and plain-text fallback.
 */

/**
 * Extract text from a file based on its MIME type
 */
export async function extractTextFromFile(
    buffer: Buffer,
    mimeType: string
): Promise<string> {
    switch (mimeType) {
        case 'text/plain':
            return buffer.toString('utf-8');

        case 'application/pdf':
            return extractFromPdf(buffer);

        case 'application/msword':
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            return extractFromDocx(buffer);

        default:
            throw new Error(`Unsupported file type: ${mimeType}`);
    }
}

/**
 * Extract text from a PDF buffer
 * Uses basic text layer extraction; for production, integrate pdf-parse or similar.
 */
async function extractFromPdf(buffer: Buffer): Promise<string> {
    try {
        // Dynamic import to avoid bundling in client
        const pdfParse = (await import('pdf-parse')).default;
        const data = await pdfParse(buffer);
        return data.text;
    } catch {
        // Fallback: attempt raw text extraction
        const text = buffer.toString('utf-8');
        const readable = text.replace(/[^\x20-\x7E\n\r\t]/g, ' ').trim();
        return readable || 'Unable to extract text from PDF. Please try a text-based document.';
    }
}

/**
 * Extract text from a DOCX buffer
 * Extracts raw XML content; for production, integrate mammoth or similar.
 */
async function extractFromDocx(buffer: Buffer): Promise<string> {
    try {
        const mammoth = await import('mammoth');
        const result = await mammoth.extractRawText({ buffer });
        return result.value;
    } catch {
        const text = buffer.toString('utf-8');
        // Strip XML tags for basic extraction
        return text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    }
}

/**
 * Count words in a text string
 */
export function wordCount(text: string): number {
    return text
        .trim()
        .split(/\s+/)
        .filter((w) => w.length > 0).length;
}

/**
 * Count characters (excluding whitespace)
 */
export function charCount(text: string): number {
    return text.replace(/\s/g, '').length;
}

/**
 * Get a preview excerpt from text
 */
export function textPreview(text: string, maxLength: number = 200): string {
    if (text.length <= maxLength) return text;
    const truncated = text.slice(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + '...';
}
