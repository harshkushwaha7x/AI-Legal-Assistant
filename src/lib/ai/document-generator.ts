import { DocumentTypeId } from '@/lib/validations/document';

/* ── System prompts per document type ───────────────────────── */

const SYSTEM_PROMPT_BASE = `You are a senior legal document drafting AI assistant. 
You generate professional, legally sound documents based on user inputs.
IMPORTANT RULES:
- Output ONLY the document content in clean, properly formatted text
- Use standard legal formatting with numbered sections and subsections
- Include all standard legal clauses appropriate for the document type
- Use the specific details provided by the user
- Add appropriate legal language, definitions, and boilerplate clauses
- Include signature blocks at the end
- Do NOT include any commentary, explanations, or markdown — only the document itself
- Use professional legal terminology while keeping language clear`;

const DOCUMENT_PROMPTS: Record<DocumentTypeId, string> = {
    NDA: `${SYSTEM_PROMPT_BASE}
Generate a comprehensive Non-Disclosure Agreement (NDA) with the following sections:
1. Identification of Parties
2. Definition of Confidential Information
3. Obligations of Receiving Party
4. Exclusions from Confidential Information
5. Term and Duration
6. Return of Materials
7. Remedies for Breach
8. Miscellaneous Provisions (Governing Law, Severability, Entire Agreement)
9. Signature Blocks`,

    LEASE: `${SYSTEM_PROMPT_BASE}
Generate a comprehensive Residential Lease Agreement with the following sections:
1. Identification of Parties
2. Property Description
3. Lease Term
4. Rent and Payment Terms
5. Security Deposit
6. Use of Premises
7. Maintenance and Repairs
8. Utilities
9. Rules and Regulations
10. Termination and Default
11. Entry by Landlord
12. Governing Law
13. Signature Blocks`,

    CONTRACT: `${SYSTEM_PROMPT_BASE}
Generate a comprehensive Service Agreement with the following sections:
1. Identification of Parties
2. Scope of Services
3. Compensation and Payment Terms
4. Term and Termination
5. Independent Contractor Status
6. Confidentiality
7. Intellectual Property
8. Limitation of Liability
9. Indemnification
10. Dispute Resolution
11. General Provisions
12. Signature Blocks`,

    EMPLOYMENT: `${SYSTEM_PROMPT_BASE}
Generate a comprehensive Employment Agreement with the following sections:
1. Identification of Parties
2. Position and Duties
3. Compensation and Benefits
4. Work Schedule
5. At-Will Employment / Term
6. Confidentiality and Non-Disclosure
7. Non-Compete and Non-Solicitation
8. Intellectual Property Assignment
9. Termination
10. Severance
11. Governing Law
12. Signature Blocks`,

    PARTNERSHIP: `${SYSTEM_PROMPT_BASE}
Generate a comprehensive Partnership Agreement with the following sections:
1. Identification of Partners
2. Partnership Name and Purpose
3. Capital Contributions
4. Profit and Loss Distribution
5. Management and Voting
6. Partner Duties and Restrictions
7. Banking and Accounting
8. Admission of New Partners
9. Withdrawal and Dissolution
10. Dispute Resolution
11. Governing Law
12. Signature Blocks`,
};

export function buildDocumentPrompt(
    type: DocumentTypeId,
    fields: Record<string, string>,
    additionalInstructions?: string
): { system: string; user: string } {
    const fieldEntries = Object.entries(fields)
        .filter(([, value]) => value && value.trim())
        .map(([key, value]) => `- ${key}: ${value}`)
        .join('\n');

    const userPrompt = `Generate the document using these details:

${fieldEntries}

${additionalInstructions ? `Additional instructions: ${additionalInstructions}` : ''}

Today's date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`;

    return {
        system: DOCUMENT_PROMPTS[type],
        user: userPrompt,
    };
}

/* ── Fallback: local template generation (no AI key needed) ── */

export function generateFallbackDocument(
    type: DocumentTypeId,
    fields: Record<string, string>
): string {
    const date = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    switch (type) {
        case 'NDA':
            return generateNDATemplate(fields, date);
        case 'LEASE':
            return generateLeaseTemplate(fields, date);
        case 'CONTRACT':
            return generateContractTemplate(fields, date);
        case 'EMPLOYMENT':
            return generateEmploymentTemplate(fields, date);
        case 'PARTNERSHIP':
            return generatePartnershipTemplate(fields, date);
        default:
            return 'Document type not supported.';
    }
}

function generateNDATemplate(f: Record<string, string>, date: string): string {
    return `NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into as of ${date} ("Effective Date"), by and between:

DISCLOSING PARTY: ${f.partyA || '_______________'}
("Disclosing Party")

RECEIVING PARTY: ${f.partyB || '_______________'}
("Receiving Party")

${f.mutual === 'true' ? '(This is a Mutual Non-Disclosure Agreement. Each party may be both a Disclosing Party and Receiving Party.)' : ''}

RECITALS

WHEREAS, the Disclosing Party possesses certain confidential and proprietary information; and

WHEREAS, the Receiving Party desires to receive certain confidential information for the purpose of ${f.purpose || '_______________'} ("Purpose");

NOW, THEREFORE, in consideration of the mutual covenants contained herein, the parties agree as follows:

1. DEFINITION OF CONFIDENTIAL INFORMATION

"Confidential Information" means any and all non-public information, in any form, disclosed by the Disclosing Party to the Receiving Party, including but not limited to: trade secrets, business plans, financial information, customer lists, technical data, software, inventions, processes, designs, drawings, engineering, marketing plans, and any other information designated as confidential.

2. OBLIGATIONS OF RECEIVING PARTY

The Receiving Party agrees to:
(a) Hold and maintain the Confidential Information in strict confidence;
(b) Not disclose Confidential Information to any third parties without prior written consent;
(c) Not use the Confidential Information for any purpose except the Purpose;
(d) Protect the Confidential Information with at least the same degree of care used to protect its own confidential information, but no less than reasonable care.

3. EXCLUSIONS

Confidential Information shall not include information that:
(a) Is or becomes publicly available through no fault of the Receiving Party;
(b) Was already known to the Receiving Party prior to disclosure;
(c) Is independently developed by the Receiving Party without reference to the Confidential Information;
(d) Is rightfully received from a third party without restriction.

4. TERM

This Agreement shall remain in effect for a period of ${f.duration || '___'} year(s) from the Effective Date.

5. RETURN OF MATERIALS

Upon termination or request, the Receiving Party shall promptly return or destroy all materials containing Confidential Information.

6. REMEDIES

The Receiving Party acknowledges that a breach may cause irreparable harm, and the Disclosing Party shall be entitled to seek injunctive relief in addition to any other available remedies.

7. GOVERNING LAW

This Agreement shall be governed by the laws of ${f.jurisdiction || '_______________'}.

8. ENTIRE AGREEMENT

This Agreement constitutes the entire agreement between the parties regarding the subject matter herein and supersedes all prior agreements and understandings.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.


DISCLOSING PARTY:                    RECEIVING PARTY:

_________________________            _________________________
${f.partyA || 'Name'}                              ${f.partyB || 'Name'}

Date: ___________________            Date: ___________________`;
}

function generateLeaseTemplate(f: Record<string, string>, date: string): string {
    return `RESIDENTIAL LEASE AGREEMENT

This Residential Lease Agreement ("Lease") is entered into as of ${date}, by and between:

LANDLORD: ${f.landlordName || '_______________'}
TENANT: ${f.tenantName || '_______________'}

1. PREMISES
The Landlord hereby leases to the Tenant the property located at:
${f.propertyAddress || '_______________'}

2. TERM
This Lease shall commence on ${f.leaseStart || '_______________'} and shall continue for a period of ${f.leaseDuration || '_______________'}.

3. RENT
The Tenant shall pay monthly rent of $${f.monthlyRent || '___'} due on the first day of each month.

4. SECURITY DEPOSIT
The Tenant shall pay a security deposit of $${f.securityDeposit || '___'} upon execution of this Lease.

5. USE OF PREMISES
The premises shall be used exclusively for residential purposes.

6. MAINTENANCE AND REPAIRS
The Landlord shall maintain the structural components. The Tenant shall maintain the premises in clean and habitable condition.

7. UTILITIES
Unless otherwise specified, the Tenant shall be responsible for all utilities.

8. ENTRY BY LANDLORD
The Landlord may enter the premises with 24 hours written notice for inspections, repairs, or showings.

9. TERMINATION
Either party may terminate with 30 days written notice at the end of the lease term.

10. GOVERNING LAW
This Lease shall be governed by the laws of ${f.jurisdiction || '_______________'}.

IN WITNESS WHEREOF:

LANDLORD:                             TENANT:

_________________________            _________________________
${f.landlordName || 'Name'}                              ${f.tenantName || 'Name'}

Date: ___________________            Date: ___________________`;
}

function generateContractTemplate(f: Record<string, string>, date: string): string {
    return `SERVICE AGREEMENT

This Service Agreement ("Agreement") is entered into as of ${date}, by and between:

SERVICE PROVIDER: ${f.providerName || '_______________'}
CLIENT: ${f.clientName || '_______________'}

1. SCOPE OF SERVICES
${f.serviceDescription || '_______________'}

2. COMPENSATION
${f.compensation || '_______________'}

3. TERM
This Agreement shall commence on ${f.startDate || '_______________'}${f.endDate ? ` and terminate on ${f.endDate}` : ' and shall continue until terminated by either party with 30 days written notice'}.

4. INDEPENDENT CONTRACTOR
The Service Provider is an independent contractor, not an employee.

5. CONFIDENTIALITY
Both parties agree to maintain confidentiality of proprietary information.

6. INTELLECTUAL PROPERTY
All work product created under this Agreement shall be owned by the Client upon full payment.

7. LIMITATION OF LIABILITY
Neither party shall be liable for indirect, incidental, or consequential damages.

8. GOVERNING LAW
This Agreement shall be governed by the laws of ${f.jurisdiction || '_______________'}.

IN WITNESS WHEREOF:

SERVICE PROVIDER:                     CLIENT:

_________________________            _________________________
${f.providerName || 'Name'}                              ${f.clientName || 'Name'}

Date: ___________________            Date: ___________________`;
}

function generateEmploymentTemplate(f: Record<string, string>, date: string): string {
    return `EMPLOYMENT AGREEMENT

This Employment Agreement ("Agreement") is entered into as of ${date}, by and between:

EMPLOYER: ${f.employerName || '_______________'}
EMPLOYEE: ${f.employeeName || '_______________'}

1. POSITION
The Employee is hired as ${f.jobTitle || '_______________'} on a ${f.employmentType || 'Full-time'} basis, commencing ${f.startDate || '_______________'}.

2. COMPENSATION
Annual salary of $${f.salary || '___'}${f.benefits ? `\n\nBenefits: ${f.benefits}` : ''}

3. DUTIES
The Employee shall perform duties as assigned and consistent with the position.

4. CONFIDENTIALITY
The Employee agrees to maintain strict confidentiality of all proprietary information.

5. NON-COMPETE
For 12 months following termination, the Employee shall not engage in competing business within the same geographic area.

6. TERMINATION
Either party may terminate with 2 weeks written notice. The Employer may terminate immediately for cause.

7. GOVERNING LAW
This Agreement shall be governed by the laws of ${f.jurisdiction || '_______________'}.

IN WITNESS WHEREOF:

EMPLOYER:                             EMPLOYEE:

_________________________            _________________________
${f.employerName || 'Name'}                              ${f.employeeName || 'Name'}

Date: ___________________            Date: ___________________`;
}

function generatePartnershipTemplate(f: Record<string, string>, date: string): string {
    return `PARTNERSHIP AGREEMENT

This Partnership Agreement ("Agreement") is entered into as of ${date}, by and between:

PARTNER A: ${f.partnerA || '_______________'}
PARTNER B: ${f.partnerB || '_______________'}

1. PARTNERSHIP NAME
${f.businessName || '_______________'}

2. PURPOSE
${f.businessPurpose || '_______________'}

3. CAPITAL CONTRIBUTIONS
${f.capitalContributions || '_______________'}

4. PROFIT AND LOSS DISTRIBUTION
Profits and losses shall be distributed ${f.profitSplit || '_______________'} between the partners.

5. MANAGEMENT
All partners shall have equal rights in the management and conduct of partnership business unless otherwise agreed.

6. BANKING
All partnership funds shall be deposited in accounts in the name of the partnership.

7. WITHDRAWAL
A partner may withdraw with 90 days written notice. The withdrawing partner's interest shall be determined by fair market valuation.

8. DISSOLUTION
The partnership may be dissolved by mutual agreement or as required by law.

9. GOVERNING LAW
This Agreement shall be governed by the laws of ${f.jurisdiction || '_______________'}.

IN WITNESS WHEREOF:

PARTNER A:                            PARTNER B:

_________________________            _________________________
${f.partnerA || 'Name'}                              ${f.partnerB || 'Name'}

Date: ___________________            Date: ___________________`;
}
