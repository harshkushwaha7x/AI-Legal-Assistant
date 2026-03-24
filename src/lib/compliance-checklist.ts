/**
 * Compliance checklist engine
 * Generates compliance requirements based on document type and jurisdiction
 */

export interface ComplianceItem {
    id: string;
    label: string;
    description: string;
    category: string;
    severity: 'required' | 'recommended' | 'optional';
    checked: boolean;
}

export interface ComplianceChecklist {
    documentType: string;
    jurisdiction: string;
    items: ComplianceItem[];
    createdAt: string;
}

const COMMON_ITEMS: Omit<ComplianceItem, 'checked'>[] = [
    { id: 'parties-identified', label: 'All parties clearly identified', description: 'Full legal names and addresses of all parties are present', category: 'Parties', severity: 'required' },
    { id: 'effective-date', label: 'Effective date specified', description: 'Agreement includes a clear effective date', category: 'Dates', severity: 'required' },
    { id: 'term-defined', label: 'Term and duration defined', description: 'Agreement specifies start and end dates or renewal terms', category: 'Dates', severity: 'required' },
    { id: 'governing-law', label: 'Governing law clause', description: 'Applicable laws and jurisdiction for disputes are specified', category: 'Legal', severity: 'required' },
    { id: 'signatures', label: 'Signature blocks present', description: 'Appropriate signature lines for all parties', category: 'Execution', severity: 'required' },
    { id: 'definitions', label: 'Key terms defined', description: 'Important terms are clearly defined in the agreement', category: 'Clarity', severity: 'recommended' },
    { id: 'notice-provisions', label: 'Notice provisions included', description: 'Method and address for official communications', category: 'Communication', severity: 'recommended' },
    { id: 'severability', label: 'Severability clause', description: 'Invalid provisions do not void the entire agreement', category: 'Legal', severity: 'recommended' },
    { id: 'entire-agreement', label: 'Entire agreement clause', description: 'Document constitutes the full agreement between parties', category: 'Legal', severity: 'recommended' },
    { id: 'amendment-process', label: 'Amendment process defined', description: 'Procedure for modifying the agreement is specified', category: 'Legal', severity: 'optional' },
];

const NDA_ITEMS: Omit<ComplianceItem, 'checked'>[] = [
    { id: 'conf-definition', label: 'Confidential information defined', description: 'Clear definition of what constitutes confidential information', category: 'Confidentiality', severity: 'required' },
    { id: 'exclusions', label: 'Exclusions listed', description: 'Information excluded from confidentiality obligations', category: 'Confidentiality', severity: 'required' },
    { id: 'return-destroy', label: 'Return/destruction clause', description: 'Obligation to return or destroy confidential materials', category: 'Confidentiality', severity: 'recommended' },
];

const EMPLOYMENT_ITEMS: Omit<ComplianceItem, 'checked'>[] = [
    { id: 'compensation', label: 'Compensation details', description: 'Salary, benefits, and payment terms clearly stated', category: 'Compensation', severity: 'required' },
    { id: 'duties', label: 'Job duties described', description: 'Role, responsibilities, and reporting structure defined', category: 'Role', severity: 'required' },
    { id: 'termination-terms', label: 'Termination provisions', description: 'Conditions and notice periods for termination', category: 'Termination', severity: 'required' },
    { id: 'benefits', label: 'Benefits outlined', description: 'Health, retirement, and other benefits specified', category: 'Compensation', severity: 'recommended' },
];

const LEASE_ITEMS: Omit<ComplianceItem, 'checked'>[] = [
    { id: 'property-desc', label: 'Property description', description: 'Complete address and description of the leased property', category: 'Property', severity: 'required' },
    { id: 'rent-amount', label: 'Rent amount specified', description: 'Monthly rent, due date, and payment method', category: 'Financial', severity: 'required' },
    { id: 'security-deposit', label: 'Security deposit terms', description: 'Deposit amount, conditions for return, and deduction rights', category: 'Financial', severity: 'required' },
    { id: 'maintenance', label: 'Maintenance responsibilities', description: 'Landlord and tenant maintenance obligations', category: 'Property', severity: 'recommended' },
];

const TYPE_ITEMS: Record<string, Omit<ComplianceItem, 'checked'>[]> = {
    NDA: NDA_ITEMS,
    EMPLOYMENT: EMPLOYMENT_ITEMS,
    LEASE: LEASE_ITEMS,
};

/**
 * Generate a compliance checklist for the given document type
 */
export function generateChecklist(
    documentType: string,
    jurisdiction: string
): ComplianceChecklist {
    const typeSpecific = TYPE_ITEMS[documentType.toUpperCase()] || [];
    const allItems = [...COMMON_ITEMS, ...typeSpecific].map((item) => ({
        ...item,
        checked: false,
    }));

    return {
        documentType,
        jurisdiction,
        items: allItems,
        createdAt: new Date().toISOString(),
    };
}

/**
 * Toggle a checklist item
 */
export function toggleItem(
    checklist: ComplianceChecklist,
    itemId: string
): ComplianceChecklist {
    return {
        ...checklist,
        items: checklist.items.map((item) =>
            item.id === itemId ? { ...item, checked: !item.checked } : item
        ),
    };
}

/**
 * Calculate compliance score (0-100)
 */
export function getComplianceScore(checklist: ComplianceChecklist): number {
    const weights = { required: 3, recommended: 2, optional: 1 };
    const total = checklist.items.reduce((sum, i) => sum + weights[i.severity], 0);
    const checked = checklist.items
        .filter((i) => i.checked)
        .reduce((sum, i) => sum + weights[i.severity], 0);

    return total > 0 ? Math.round((checked / total) * 100) : 0;
}

/**
 * Get items grouped by category
 */
export function getItemsByCategory(
    checklist: ComplianceChecklist
): Record<string, ComplianceItem[]> {
    const groups: Record<string, ComplianceItem[]> = {};
    for (const item of checklist.items) {
        if (!groups[item.category]) groups[item.category] = [];
        groups[item.category].push(item);
    }
    return groups;
}

/**
 * Get counts of incomplete required items
 */
export function getIncompleteRequired(checklist: ComplianceChecklist): ComplianceItem[] {
    return checklist.items.filter((i) => i.severity === 'required' && !i.checked);
}
