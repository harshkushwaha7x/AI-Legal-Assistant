/**
 * Legal document type descriptions and helpers
 */

export const DOCUMENT_TYPE_INFO: Record<
    string,
    {
        title: string;
        description: string;
        commonClauses: string[];
        typicalUse: string;
    }
> = {
    NDA: {
        title: 'Non-Disclosure Agreement',
        description: 'Protects confidential information shared between parties.',
        commonClauses: [
            'Definition of Confidential Information',
            'Obligations of Receiving Party',
            'Term and Duration',
            'Exclusions from Confidentiality',
            'Remedies for Breach',
        ],
        typicalUse: 'Business partnerships, employment, investor discussions',
    },
    LEASE: {
        title: 'Lease Agreement',
        description: 'Governs the rental of property between landlord and tenant.',
        commonClauses: [
            'Rent Amount and Due Date',
            'Security Deposit',
            'Maintenance Responsibilities',
            'Termination Conditions',
            'Renewal Terms',
        ],
        typicalUse: 'Residential or commercial property rental',
    },
    CONTRACT: {
        title: 'General Contract',
        description: 'A legally binding agreement between two or more parties.',
        commonClauses: [
            'Scope of Work',
            'Payment Terms',
            'Liability and Indemnification',
            'Governing Law',
            'Dispute Resolution',
        ],
        typicalUse: 'Service agreements, vendor contracts, freelance work',
    },
    EMPLOYMENT: {
        title: 'Employment Agreement',
        description: 'Defines the terms and conditions of employment.',
        commonClauses: [
            'Position and Duties',
            'Compensation and Benefits',
            'Non-Compete Clause',
            'Intellectual Property Assignment',
            'Termination Provisions',
        ],
        typicalUse: 'Hiring employees, contractor agreements',
    },
    PARTNERSHIP: {
        title: 'Partnership Agreement',
        description: 'Establishes the terms of a business partnership.',
        commonClauses: [
            'Capital Contributions',
            'Profit/Loss Distribution',
            'Management and Voting Rights',
            'Exit and Buyout Provisions',
            'Dispute Resolution',
        ],
        typicalUse: 'Starting a business with partners',
    },
    CUSTOM: {
        title: 'Custom Document',
        description: 'A custom legal document generated based on user specifications.',
        commonClauses: [
            'Terms as specified by user',
            'Custom provisions',
        ],
        typicalUse: 'Specialized legal documents',
    },
};

/**
 * Get document description by type
 */
export function getDocumentTypeInfo(type: string) {
    return DOCUMENT_TYPE_INFO[type] || DOCUMENT_TYPE_INFO.CUSTOM;
}
