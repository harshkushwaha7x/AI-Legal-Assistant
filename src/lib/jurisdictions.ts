/**
 * Jurisdiction database
 * Legal jurisdiction configurations for document generation and compliance
 */

export interface Jurisdiction {
    code: string;
    name: string;
    region: string;
    legalSystem: 'common-law' | 'civil-law' | 'mixed';
    currency: string;
    languageCode: string;
    dateFormat: string;
    noticeDefault: number; // default notice period in days
    arbClause: boolean; // arbitration commonly used
}

export const JURISDICTIONS: Jurisdiction[] = [
    { code: 'US-CA', name: 'California, USA', region: 'North America', legalSystem: 'common-law', currency: 'USD', languageCode: 'en-US', dateFormat: 'MM/DD/YYYY', noticeDefault: 30, arbClause: true },
    { code: 'US-NY', name: 'New York, USA', region: 'North America', legalSystem: 'common-law', currency: 'USD', languageCode: 'en-US', dateFormat: 'MM/DD/YYYY', noticeDefault: 30, arbClause: true },
    { code: 'US-DE', name: 'Delaware, USA', region: 'North America', legalSystem: 'common-law', currency: 'USD', languageCode: 'en-US', dateFormat: 'MM/DD/YYYY', noticeDefault: 30, arbClause: true },
    { code: 'US-TX', name: 'Texas, USA', region: 'North America', legalSystem: 'common-law', currency: 'USD', languageCode: 'en-US', dateFormat: 'MM/DD/YYYY', noticeDefault: 30, arbClause: true },
    { code: 'GB', name: 'United Kingdom', region: 'Europe', legalSystem: 'common-law', currency: 'GBP', languageCode: 'en-GB', dateFormat: 'DD/MM/YYYY', noticeDefault: 28, arbClause: true },
    { code: 'CA-ON', name: 'Ontario, Canada', region: 'North America', legalSystem: 'common-law', currency: 'CAD', languageCode: 'en-CA', dateFormat: 'YYYY-MM-DD', noticeDefault: 30, arbClause: true },
    { code: 'AU', name: 'Australia', region: 'Oceania', legalSystem: 'common-law', currency: 'AUD', languageCode: 'en-AU', dateFormat: 'DD/MM/YYYY', noticeDefault: 30, arbClause: true },
    { code: 'IN', name: 'India', region: 'Asia', legalSystem: 'common-law', currency: 'INR', languageCode: 'en-IN', dateFormat: 'DD/MM/YYYY', noticeDefault: 30, arbClause: true },
    { code: 'DE', name: 'Germany', region: 'Europe', legalSystem: 'civil-law', currency: 'EUR', languageCode: 'de-DE', dateFormat: 'DD.MM.YYYY', noticeDefault: 14, arbClause: false },
    { code: 'FR', name: 'France', region: 'Europe', legalSystem: 'civil-law', currency: 'EUR', languageCode: 'fr-FR', dateFormat: 'DD/MM/YYYY', noticeDefault: 15, arbClause: false },
    { code: 'JP', name: 'Japan', region: 'Asia', legalSystem: 'civil-law', currency: 'JPY', languageCode: 'ja-JP', dateFormat: 'YYYY/MM/DD', noticeDefault: 14, arbClause: true },
    { code: 'SG', name: 'Singapore', region: 'Asia', legalSystem: 'common-law', currency: 'SGD', languageCode: 'en-SG', dateFormat: 'DD/MM/YYYY', noticeDefault: 30, arbClause: true },
    { code: 'AE', name: 'United Arab Emirates', region: 'Middle East', legalSystem: 'civil-law', currency: 'AED', languageCode: 'ar-AE', dateFormat: 'DD/MM/YYYY', noticeDefault: 30, arbClause: true },
    { code: 'BR', name: 'Brazil', region: 'South America', legalSystem: 'civil-law', currency: 'BRL', languageCode: 'pt-BR', dateFormat: 'DD/MM/YYYY', noticeDefault: 30, arbClause: true },
    { code: 'ZA', name: 'South Africa', region: 'Africa', legalSystem: 'mixed', currency: 'ZAR', languageCode: 'en-ZA', dateFormat: 'YYYY/MM/DD', noticeDefault: 30, arbClause: true },
];

/**
 * Find a jurisdiction by code
 */
export function getJurisdiction(code: string): Jurisdiction | undefined {
    return JURISDICTIONS.find((j) => j.code === code);
}

/**
 * Get jurisdictions by region
 */
export function getJurisdictionsByRegion(region: string): Jurisdiction[] {
    return JURISDICTIONS.filter((j) => j.region === region);
}

/**
 * Get all unique regions
 */
export function getRegions(): string[] {
    return [...new Set(JURISDICTIONS.map((j) => j.region))];
}

/**
 * Get jurisdictions by legal system type
 */
export function getJurisdictionsBySystem(system: Jurisdiction['legalSystem']): Jurisdiction[] {
    return JURISDICTIONS.filter((j) => j.legalSystem === system);
}

/**
 * Search jurisdictions by name or code
 */
export function searchJurisdictions(query: string): Jurisdiction[] {
    const q = query.toLowerCase();
    return JURISDICTIONS.filter(
        (j) =>
            j.name.toLowerCase().includes(q) ||
            j.code.toLowerCase().includes(q)
    );
}

/**
 * Format a date according to jurisdiction rules
 */
export function formatJurisdictionDate(date: Date, jurisdiction: Jurisdiction): string {
    return date.toLocaleDateString(jurisdiction.languageCode);
}
