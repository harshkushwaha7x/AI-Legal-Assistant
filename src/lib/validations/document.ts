import { z } from 'zod';

export const DOCUMENT_TYPES = [
    {
        id: 'NDA',
        label: 'Non-Disclosure Agreement',
        description: 'Protect confidential information between parties.',
        icon: 'ShieldCheck',
        fields: [
            { name: 'partyA', label: 'Disclosing Party (Your Name/Company)', type: 'text', required: true },
            { name: 'partyB', label: 'Receiving Party (Other Name/Company)', type: 'text', required: true },
            { name: 'purpose', label: 'Purpose of Disclosure', type: 'textarea', required: true, placeholder: 'e.g., Evaluating a potential business partnership' },
            { name: 'duration', label: 'Duration (years)', type: 'select', options: ['1', '2', '3', '5', '10'], required: true },
            { name: 'jurisdiction', label: 'Governing Jurisdiction', type: 'text', required: true, placeholder: 'e.g., State of California' },
            { name: 'mutual', label: 'Mutual NDA?', type: 'checkbox' },
        ],
    },
    {
        id: 'LEASE',
        label: 'Residential Lease Agreement',
        description: 'Rental agreement between landlord and tenant.',
        icon: 'Home',
        fields: [
            { name: 'landlordName', label: 'Landlord Name', type: 'text', required: true },
            { name: 'tenantName', label: 'Tenant Name', type: 'text', required: true },
            { name: 'propertyAddress', label: 'Property Address', type: 'textarea', required: true },
            { name: 'monthlyRent', label: 'Monthly Rent ($)', type: 'text', required: true },
            { name: 'securityDeposit', label: 'Security Deposit ($)', type: 'text', required: true },
            { name: 'leaseStart', label: 'Lease Start Date', type: 'date', required: true },
            { name: 'leaseDuration', label: 'Lease Duration', type: 'select', options: ['6 months', '1 year', '2 years'], required: true },
            { name: 'jurisdiction', label: 'State/Jurisdiction', type: 'text', required: true },
        ],
    },
    {
        id: 'CONTRACT',
        label: 'Service Agreement',
        description: 'General service contract between provider and client.',
        icon: 'FileText',
        fields: [
            { name: 'providerName', label: 'Service Provider Name', type: 'text', required: true },
            { name: 'clientName', label: 'Client Name', type: 'text', required: true },
            { name: 'serviceDescription', label: 'Description of Services', type: 'textarea', required: true },
            { name: 'compensation', label: 'Compensation / Payment Terms', type: 'textarea', required: true },
            { name: 'startDate', label: 'Start Date', type: 'date', required: true },
            { name: 'endDate', label: 'End Date', type: 'date' },
            { name: 'jurisdiction', label: 'Governing Jurisdiction', type: 'text', required: true },
        ],
    },
    {
        id: 'EMPLOYMENT',
        label: 'Employment Agreement',
        description: 'Employment contract between employer and employee.',
        icon: 'Briefcase',
        fields: [
            { name: 'employerName', label: 'Employer / Company Name', type: 'text', required: true },
            { name: 'employeeName', label: 'Employee Name', type: 'text', required: true },
            { name: 'jobTitle', label: 'Job Title', type: 'text', required: true },
            { name: 'salary', label: 'Annual Salary ($)', type: 'text', required: true },
            { name: 'startDate', label: 'Start Date', type: 'date', required: true },
            { name: 'employmentType', label: 'Employment Type', type: 'select', options: ['Full-time', 'Part-time', 'Contract'], required: true },
            { name: 'benefits', label: 'Benefits Description', type: 'textarea', placeholder: 'Health insurance, PTO, 401k, etc.' },
            { name: 'jurisdiction', label: 'State/Jurisdiction', type: 'text', required: true },
        ],
    },
    {
        id: 'PARTNERSHIP',
        label: 'Partnership Agreement',
        description: 'Define terms between business partners.',
        icon: 'Users',
        fields: [
            { name: 'partnerA', label: 'Partner A Name', type: 'text', required: true },
            { name: 'partnerB', label: 'Partner B Name', type: 'text', required: true },
            { name: 'businessName', label: 'Partnership / Business Name', type: 'text', required: true },
            { name: 'businessPurpose', label: 'Business Purpose', type: 'textarea', required: true },
            { name: 'capitalContributions', label: 'Capital Contributions', type: 'textarea', required: true },
            { name: 'profitSplit', label: 'Profit/Loss Split', type: 'text', required: true, placeholder: 'e.g., 50/50, 60/40' },
            { name: 'jurisdiction', label: 'Governing Jurisdiction', type: 'text', required: true },
        ],
    },
] as const;

export type DocumentTypeId = typeof DOCUMENT_TYPES[number]['id'];

export const generateDocumentSchema = z.object({
    type: z.enum(['NDA', 'LEASE', 'CONTRACT', 'EMPLOYMENT', 'PARTNERSHIP']),
    title: z.string().min(1, 'Title is required').max(200),
    fields: z.record(z.string(), z.any()),
    additionalInstructions: z.string().max(1000).optional(),
});

export type GenerateDocumentInput = z.infer<typeof generateDocumentSchema>;
