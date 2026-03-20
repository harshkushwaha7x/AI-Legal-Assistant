import {
    getJurisdiction,
    getJurisdictionsByRegion,
    getRegions,
    getJurisdictionsBySystem,
    searchJurisdictions,
    JURISDICTIONS,
} from '@/lib/jurisdictions';

describe('Jurisdictions', () => {
    describe('JURISDICTIONS', () => {
        it('contains multiple jurisdictions', () => {
            expect(JURISDICTIONS.length).toBeGreaterThan(10);
        });

        it('each jurisdiction has required fields', () => {
            JURISDICTIONS.forEach((j) => {
                expect(j.code).toBeTruthy();
                expect(j.name).toBeTruthy();
                expect(j.region).toBeTruthy();
                expect(['common-law', 'civil-law', 'mixed']).toContain(j.legalSystem);
                expect(j.currency).toBeTruthy();
                expect(j.noticeDefault).toBeGreaterThan(0);
            });
        });

        it('has unique codes', () => {
            const codes = JURISDICTIONS.map((j) => j.code);
            expect(new Set(codes).size).toBe(codes.length);
        });
    });

    describe('getJurisdiction', () => {
        it('finds by exact code', () => {
            const j = getJurisdiction('US-CA');
            expect(j).toBeDefined();
            expect(j?.name).toContain('California');
        });

        it('returns undefined for unknown code', () => {
            expect(getJurisdiction('XX-XX')).toBeUndefined();
        });
    });

    describe('getJurisdictionsByRegion', () => {
        it('filters by region', () => {
            const results = getJurisdictionsByRegion('Europe');
            expect(results.length).toBeGreaterThan(0);
            results.forEach((j) => expect(j.region).toBe('Europe'));
        });

        it('returns empty for unknown region', () => {
            expect(getJurisdictionsByRegion('Antarctica').length).toBe(0);
        });
    });

    describe('getRegions', () => {
        it('returns unique regions', () => {
            const regions = getRegions();
            expect(regions.length).toBeGreaterThan(3);
            expect(new Set(regions).size).toBe(regions.length);
        });
    });

    describe('getJurisdictionsBySystem', () => {
        it('filters common-law systems', () => {
            const results = getJurisdictionsBySystem('common-law');
            expect(results.length).toBeGreaterThan(0);
            results.forEach((j) => expect(j.legalSystem).toBe('common-law'));
        });

        it('filters civil-law systems', () => {
            const results = getJurisdictionsBySystem('civil-law');
            expect(results.length).toBeGreaterThan(0);
        });
    });

    describe('searchJurisdictions', () => {
        it('finds by name', () => {
            const results = searchJurisdictions('California');
            expect(results.length).toBe(1);
        });

        it('finds by code', () => {
            const results = searchJurisdictions('GB');
            expect(results.length).toBe(1);
        });

        it('is case-insensitive', () => {
            expect(searchJurisdictions('india').length).toBe(1);
        });

        it('returns empty for no match', () => {
            expect(searchJurisdictions('zzz').length).toBe(0);
        });
    });
});
