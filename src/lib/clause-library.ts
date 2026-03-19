/**
 * Contract clause library
 * Pre-built clause templates for common legal document sections
 */

export interface ClauseTemplate {
    id: string;
    name: string;
    category: string;
    description: string;
    content: string;
    jurisdiction?: string;
    riskLevel: 'low' | 'medium' | 'high';
}

export const CLAUSE_LIBRARY: ClauseTemplate[] = [
    {
        id: 'conf-standard',
        name: 'Standard Confidentiality',
        category: 'confidentiality',
        description: 'Basic mutual confidentiality clause protecting shared information.',
        content: 'Each party agrees to hold in confidence all Confidential Information disclosed by the other party. Confidential Information shall not be disclosed to any third party without prior written consent of the disclosing party. This obligation shall survive termination of this Agreement for a period of [DURATION] years.',
        riskLevel: 'low',
    },
    {
        id: 'conf-unilateral',
        name: 'One-Way Confidentiality',
        category: 'confidentiality',
        description: 'Unilateral NDA clause where only one party discloses.',
        content: 'The Receiving Party acknowledges that during the course of this engagement, it may receive Confidential Information belonging to the Disclosing Party. The Receiving Party agrees to: (a) maintain the confidentiality of such information; (b) not use such information for any purpose other than as contemplated by this Agreement; (c) not disclose such information to any third party without prior written consent.',
        riskLevel: 'low',
    },
    {
        id: 'indem-mutual',
        name: 'Mutual Indemnification',
        category: 'indemnification',
        description: 'Both parties indemnify each other against third-party claims.',
        content: 'Each party (the "Indemnifying Party") shall indemnify, defend, and hold harmless the other party and its officers, directors, employees, and agents from and against any and all claims, damages, losses, liabilities, costs, and expenses (including reasonable attorney fees) arising out of or relating to: (a) any breach of this Agreement by the Indemnifying Party; (b) any negligent or wrongful act or omission of the Indemnifying Party.',
        riskLevel: 'medium',
    },
    {
        id: 'limit-liability',
        name: 'Limitation of Liability',
        category: 'liability',
        description: 'Caps total liability and excludes consequential damages.',
        content: 'IN NO EVENT SHALL EITHER PARTY BE LIABLE TO THE OTHER FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, REGARDLESS OF THE CAUSE OF ACTION OR THE THEORY OF LIABILITY. THE TOTAL AGGREGATE LIABILITY OF EITHER PARTY UNDER THIS AGREEMENT SHALL NOT EXCEED THE TOTAL FEES PAID OR PAYABLE UNDER THIS AGREEMENT DURING THE [TWELVE (12)] MONTH PERIOD PRECEDING THE EVENT GIVING RISE TO THE CLAIM.',
        riskLevel: 'medium',
    },
    {
        id: 'term-convenience',
        name: 'Termination for Convenience',
        category: 'termination',
        description: 'Either party may terminate with written notice.',
        content: 'Either party may terminate this Agreement at any time, for any reason or no reason, by providing [THIRTY (30)] days prior written notice to the other party. Upon termination, all rights and obligations of the parties shall cease, except those that by their nature are intended to survive termination.',
        riskLevel: 'low',
    },
    {
        id: 'term-cause',
        name: 'Termination for Cause',
        category: 'termination',
        description: 'Termination upon material breach with cure period.',
        content: 'Either party may terminate this Agreement upon written notice if the other party materially breaches any provision of this Agreement and fails to cure such breach within [THIRTY (30)] days after receiving written notice thereof. In the event of termination for cause, the non-breaching party shall be entitled to pursue all available remedies at law or in equity.',
        riskLevel: 'low',
    },
    {
        id: 'force-majeure',
        name: 'Force Majeure',
        category: 'general',
        description: 'Excuses performance due to events beyond reasonable control.',
        content: 'Neither party shall be liable for any failure or delay in performing its obligations under this Agreement if such failure or delay results from circumstances beyond the reasonable control of that party, including but not limited to acts of God, natural disasters, war, terrorism, riots, embargoes, acts of civil or military authorities, fire, floods, accidents, strikes, or shortages of transportation, facilities, fuel, energy, labor, or materials.',
        riskLevel: 'low',
    },
    {
        id: 'governing-law',
        name: 'Governing Law and Jurisdiction',
        category: 'general',
        description: 'Specifies applicable law and dispute resolution forum.',
        content: 'This Agreement shall be governed by and construed in accordance with the laws of the State of [STATE], without giving effect to any choice or conflict of law provision. Any legal suit, action, or proceeding arising out of this Agreement shall be instituted in the federal or state courts located in [COUNTY], [STATE], and each party irrevocably submits to the exclusive jurisdiction of such courts.',
        jurisdiction: 'US',
        riskLevel: 'low',
    },
    {
        id: 'ip-assignment',
        name: 'IP Assignment',
        category: 'intellectual-property',
        description: 'Assigns all created IP to the hiring party.',
        content: 'All work product, inventions, discoveries, designs, and other intellectual property created by the Service Provider in connection with the performance of services under this Agreement (collectively, "Work Product") shall be the sole and exclusive property of the Client. The Service Provider hereby assigns to the Client all right, title, and interest in and to the Work Product, including all intellectual property rights therein.',
        riskLevel: 'medium',
    },
    {
        id: 'ip-license',
        name: 'IP License Grant',
        category: 'intellectual-property',
        description: 'Grants a non-exclusive license to use IP.',
        content: 'The Licensor hereby grants to the Licensee a non-exclusive, non-transferable, revocable license to use the Licensed Material solely for the purposes described in this Agreement. The Licensee shall not sublicense, modify, adapt, or create derivative works based on the Licensed Material without the prior written consent of the Licensor.',
        riskLevel: 'low',
    },
    {
        id: 'non-compete',
        name: 'Non-Compete',
        category: 'restrictive-covenants',
        description: 'Restricts competitive activities for a defined period.',
        content: 'During the term of this Agreement and for a period of [DURATION] following its termination, the Restricted Party shall not, directly or indirectly, engage in, own, manage, operate, or provide services to any business that competes with the Business within [GEOGRAPHIC AREA]. This restriction applies to activities that are substantially similar to the services provided under this Agreement.',
        riskLevel: 'high',
    },
    {
        id: 'non-solicit',
        name: 'Non-Solicitation',
        category: 'restrictive-covenants',
        description: 'Prevents solicitation of employees or clients.',
        content: 'During the term of this Agreement and for a period of [DURATION] following its termination, neither party shall, directly or indirectly, solicit, recruit, or hire any employee, contractor, or consultant of the other party, or solicit or attempt to divert any client or customer of the other party for competitive purposes.',
        riskLevel: 'medium',
    },
];

/**
 * Search clauses by query
 */
export function searchClauses(query: string): ClauseTemplate[] {
    const q = query.toLowerCase();
    return CLAUSE_LIBRARY.filter(
        (c) =>
            c.name.toLowerCase().includes(q) ||
            c.description.toLowerCase().includes(q) ||
            c.category.toLowerCase().includes(q)
    );
}

/**
 * Get clauses by category
 */
export function getClausesByCategory(category: string): ClauseTemplate[] {
    return CLAUSE_LIBRARY.filter((c) => c.category === category);
}

/**
 * Get all unique clause categories
 */
export function getClauseCategories(): string[] {
    return [...new Set(CLAUSE_LIBRARY.map((c) => c.category))];
}

/**
 * Get clauses by risk level
 */
export function getClausesByRisk(riskLevel: 'low' | 'medium' | 'high'): ClauseTemplate[] {
    return CLAUSE_LIBRARY.filter((c) => c.riskLevel === riskLevel);
}
