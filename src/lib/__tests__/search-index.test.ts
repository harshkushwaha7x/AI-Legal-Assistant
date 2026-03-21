import { SearchIndex, highlightMatches, type SearchRecord } from '@/lib/search-index';

interface TestDoc extends SearchRecord {
    title: string;
    content: string;
    type: string;
}

const SAMPLE_RECORDS: TestDoc[] = [
    { id: '1', title: 'NDA Agreement', content: 'Non-disclosure agreement for business partners', type: 'document' },
    { id: '2', title: 'Employment Contract', content: 'Standard employment terms and conditions', type: 'document' },
    { id: '3', title: 'Lease Agreement', content: 'Residential property lease terms', type: 'document' },
    { id: '4', title: 'IP License', content: 'Intellectual property licensing terms and royalties', type: 'document' },
    { id: '5', title: 'Privacy Policy', content: 'Data privacy and GDPR compliance document', type: 'review' },
];

describe('SearchIndex', () => {
    let index: SearchIndex<TestDoc>;

    beforeEach(() => {
        index = new SearchIndex<TestDoc>({
            fields: ['title', 'content'],
            boosts: { title: 2, content: 1 },
        });
        index.addAll(SAMPLE_RECORDS);
    });

    describe('add / size', () => {
        it('indexes all records', () => {
            expect(index.size).toBe(5);
        });

        it('updates existing record', () => {
            index.add({ id: '1', title: 'Updated NDA', content: 'changed', type: 'document' });
            expect(index.size).toBe(5);
            const results = index.search('Updated NDA');
            expect(results[0].record.title).toBe('Updated NDA');
        });
    });

    describe('remove', () => {
        it('removes a record', () => {
            index.remove('1');
            expect(index.size).toBe(4);
            const results = index.search('NDA');
            expect(results.find((r) => r.record.id === '1')).toBeUndefined();
        });
    });

    describe('search', () => {
        it('returns empty for empty query', () => {
            expect(index.search('')).toHaveLength(0);
        });

        it('finds records by title', () => {
            const results = index.search('employment');
            expect(results.length).toBeGreaterThan(0);
            expect(results[0].record.title).toContain('Employment');
        });

        it('finds records by content', () => {
            const results = index.search('royalties');
            expect(results.length).toBeGreaterThan(0);
        });

        it('title boost scores higher', () => {
            // "agreement" is in both title and content, but NDA has it in title
            const results = index.search('agreement');
            expect(results.length).toBeGreaterThan(0);
            // Higher score results come first
            expect(results[0].score).toBeGreaterThanOrEqual(results[results.length - 1].score);
        });

        it('returns matchedFields', () => {
            const results = index.search('NDA');
            expect(results[0].matchedFields).toContain('title');
        });

        it('returns empty for no matches', () => {
            expect(index.search('xyznonexistent')).toHaveLength(0);
        });

        it('respects limit parameter', () => {
            const results = index.search('agreement', 2);
            expect(results.length).toBeLessThanOrEqual(2);
        });
    });

    describe('clear', () => {
        it('removes all records', () => {
            index.clear();
            expect(index.size).toBe(0);
            expect(index.search('NDA')).toHaveLength(0);
        });
    });
});

describe('highlightMatches', () => {
    it('wraps matching terms', () => {
        const result = highlightMatches('Hello world', 'world', { open: '[', close: ']' });
        expect(result).toContain('[world]');
    });

    it('is case-insensitive', () => {
        const result = highlightMatches('Hello World', 'world', { open: '[', close: ']' });
        expect(result).toContain('[World]');
    });

    it('returns original text for empty query', () => {
        expect(highlightMatches('Hello world', '')).toBe('Hello world');
    });
});
