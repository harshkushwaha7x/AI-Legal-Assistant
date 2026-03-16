/**
 * Legal glossary - common legal terms and plain-English definitions
 * Used by AI chat and research features to provide context
 */

export interface GlossaryTerm {
    term: string;
    definition: string;
    category: string;
    relatedTerms?: string[];
}

export const LEGAL_GLOSSARY: GlossaryTerm[] = [
    {
        term: 'Affidavit',
        definition: 'A written statement confirmed by oath or affirmation, used as evidence in court.',
        category: 'court',
        relatedTerms: ['Deposition', 'Testimony'],
    },
    {
        term: 'Arbitration',
        definition: 'A private dispute resolution process where a neutral third party makes a binding decision instead of going to court.',
        category: 'dispute-resolution',
        relatedTerms: ['Mediation', 'Litigation'],
    },
    {
        term: 'Breach of Contract',
        definition: 'When one party fails to fulfill their obligations under a contract without a lawful excuse.',
        category: 'contract',
        relatedTerms: ['Damages', 'Remedies'],
    },
    {
        term: 'Clause',
        definition: 'A specific section or provision within a legal document that addresses a particular point.',
        category: 'contract',
        relatedTerms: ['Provision', 'Term'],
    },
    {
        term: 'Damages',
        definition: 'Monetary compensation awarded to a party who has suffered loss or injury due to another party\'s actions.',
        category: 'remedies',
        relatedTerms: ['Compensatory Damages', 'Punitive Damages'],
    },
    {
        term: 'Deposition',
        definition: 'Sworn out-of-court testimony given by a witness, recorded for later use in court proceedings.',
        category: 'court',
        relatedTerms: ['Affidavit', 'Discovery'],
    },
    {
        term: 'Due Diligence',
        definition: 'A comprehensive investigation or audit of a potential investment or product to confirm all facts before entering an agreement.',
        category: 'business',
        relatedTerms: ['Disclosure', 'Fiduciary Duty'],
    },
    {
        term: 'Escrow',
        definition: 'A financial arrangement where a third party holds funds or assets until specific conditions of a transaction are met.',
        category: 'transaction',
        relatedTerms: ['Trust', 'Settlement'],
    },
    {
        term: 'Fiduciary Duty',
        definition: 'A legal obligation to act in the best interest of another party, such as a trustee for a beneficiary.',
        category: 'business',
        relatedTerms: ['Due Diligence', 'Trust'],
    },
    {
        term: 'Force Majeure',
        definition: 'A contract clause that frees both parties from liability when an extraordinary event beyond their control prevents fulfillment.',
        category: 'contract',
        relatedTerms: ['Act of God', 'Impossibility'],
    },
    {
        term: 'Indemnification',
        definition: 'A contractual obligation where one party agrees to compensate the other for losses or damages.',
        category: 'contract',
        relatedTerms: ['Liability', 'Hold Harmless'],
    },
    {
        term: 'Injunction',
        definition: 'A court order requiring a party to do or refrain from doing a specific act.',
        category: 'court',
        relatedTerms: ['Restraining Order', 'Specific Performance'],
    },
    {
        term: 'Intellectual Property',
        definition: 'Creations of the mind (inventions, literary works, designs, symbols) that are protected by law through patents, copyrights, and trademarks.',
        category: 'ip',
        relatedTerms: ['Patent', 'Copyright', 'Trademark'],
    },
    {
        term: 'Jurisdiction',
        definition: 'The official power granted to a legal body to administer justice within a defined geographic area or over certain types of cases.',
        category: 'court',
        relatedTerms: ['Venue', 'Forum'],
    },
    {
        term: 'Liability',
        definition: 'Legal responsibility for one\'s acts or omissions, which may result in an obligation to pay damages.',
        category: 'general',
        relatedTerms: ['Negligence', 'Indemnification'],
    },
    {
        term: 'Lien',
        definition: 'A legal claim or hold on property as security for a debt or obligation.',
        category: 'property',
        relatedTerms: ['Mortgage', 'Encumbrance'],
    },
    {
        term: 'Litigation',
        definition: 'The process of taking legal action through the court system to resolve a dispute.',
        category: 'court',
        relatedTerms: ['Arbitration', 'Mediation'],
    },
    {
        term: 'Mediation',
        definition: 'A voluntary dispute resolution process where a neutral mediator helps parties reach a mutually acceptable agreement.',
        category: 'dispute-resolution',
        relatedTerms: ['Arbitration', 'Negotiation'],
    },
    {
        term: 'Non-Disclosure Agreement (NDA)',
        definition: 'A legally binding contract that establishes a confidential relationship between parties regarding shared information.',
        category: 'contract',
        relatedTerms: ['Confidentiality', 'Trade Secret'],
    },
    {
        term: 'Power of Attorney',
        definition: 'A legal document giving one person the authority to act on behalf of another in legal or financial matters.',
        category: 'general',
        relatedTerms: ['Agent', 'Principal'],
    },
    {
        term: 'Precedent',
        definition: 'A previous court decision that serves as an authority for deciding subsequent similar cases.',
        category: 'court',
        relatedTerms: ['Case Law', 'Stare Decisis'],
    },
    {
        term: 'Statute of Limitations',
        definition: 'The maximum time period after an event within which legal proceedings may be initiated.',
        category: 'general',
        relatedTerms: ['Deadline', 'Tolling'],
    },
    {
        term: 'Tort',
        definition: 'A wrongful act other than a breach of contract that results in injury to another party and for which courts impose liability.',
        category: 'general',
        relatedTerms: ['Negligence', 'Liability'],
    },
    {
        term: 'Waiver',
        definition: 'The voluntary relinquishment of a known right, claim, or privilege.',
        category: 'contract',
        relatedTerms: ['Release', 'Estoppel'],
    },
];

/**
 * Search glossary terms
 */
export function searchGlossary(query: string): GlossaryTerm[] {
    const q = query.toLowerCase();
    return LEGAL_GLOSSARY.filter(
        (t) =>
            t.term.toLowerCase().includes(q) ||
            t.definition.toLowerCase().includes(q) ||
            t.category.toLowerCase().includes(q)
    );
}

/**
 * Get glossary terms by category
 */
export function getGlossaryByCategory(category: string): GlossaryTerm[] {
    return LEGAL_GLOSSARY.filter((t) => t.category === category);
}

/**
 * Get all unique glossary categories
 */
export function getGlossaryCategories(): string[] {
    return [...new Set(LEGAL_GLOSSARY.map((t) => t.category))];
}
