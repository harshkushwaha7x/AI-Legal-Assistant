import {
    toCSV,
    toJSON,
    generateFilename,
    estimateExportSize,
    type ExportColumn,
} from '@/lib/data-export';

describe('Data Export', () => {
    const SAMPLE_DATA = [
        { id: '1', title: 'NDA Agreement', status: 'active', pages: 5 },
        { id: '2', title: 'Employment Contract', status: 'draft', pages: 12 },
        { id: '3', title: 'Lease, Unit "B"', status: 'active', pages: 8 },
    ];

    const COLUMNS: ExportColumn[] = [
        { key: 'id', header: 'ID' },
        { key: 'title', header: 'Title' },
        { key: 'status', header: 'Status' },
        { key: 'pages', header: 'Pages', transform: (v) => `${v} pages` },
    ];

    describe('toCSV', () => {
        it('generates valid CSV with headers', () => {
            const csv = toCSV(SAMPLE_DATA, COLUMNS);
            const lines = csv.split('\n');
            expect(lines[0]).toBe('ID,Title,Status,Pages');
            expect(lines.length).toBe(4); // header + 3 rows
        });

        it('applies column transforms', () => {
            const csv = toCSV(SAMPLE_DATA, COLUMNS);
            expect(csv).toContain('5 pages');
        });

        it('escapes commas in fields', () => {
            const csv = toCSV(SAMPLE_DATA, COLUMNS);
            // "Lease, Unit "B"" should be escaped
            expect(csv).toContain('"');
        });

        it('handles empty data', () => {
            const csv = toCSV([], COLUMNS);
            expect(csv).toBe('ID,Title,Status,Pages');
        });
    });

    describe('toJSON', () => {
        it('generates valid JSON', () => {
            const json = toJSON(SAMPLE_DATA);
            expect(() => JSON.parse(json)).not.toThrow();
        });

        it('pretty prints by default', () => {
            const json = toJSON(SAMPLE_DATA);
            expect(json).toContain('\n');
        });

        it('compact mode', () => {
            const json = toJSON(SAMPLE_DATA, false);
            expect(json).not.toContain('\n');
        });
    });

    describe('generateFilename', () => {
        it('includes prefix and extension', () => {
            const name = generateFilename('documents', 'csv');
            expect(name).toMatch(/^documents_\d{4}-\d{2}-\d{2}\.csv$/);
        });

        it('sanitizes special characters', () => {
            const name = generateFilename('my docs/files', 'json');
            expect(name).not.toContain('/');
            expect(name).not.toContain(' ');
        });
    });

    describe('estimateExportSize', () => {
        it('returns bytes and formatted size', () => {
            const size = estimateExportSize('hello');
            expect(size.bytes).toBe(5);
            expect(size.formatted).toContain('B');
        });

        it('formats KB', () => {
            const largeStr = 'x'.repeat(2048);
            const size = estimateExportSize(largeStr);
            expect(size.formatted).toContain('KB');
        });
    });
});
