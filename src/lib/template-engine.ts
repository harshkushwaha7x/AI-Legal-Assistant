/**
 * Template engine for legal document generation
 * Replaces template variables with provided values and supports conditionals
 */

export interface TemplateVariable {
    key: string;
    label: string;
    type: 'text' | 'date' | 'number' | 'select';
    required: boolean;
    defaultValue?: string;
    options?: string[];
    placeholder?: string;
}

export interface DocumentTemplate {
    id: string;
    name: string;
    category: string;
    description: string;
    variables: TemplateVariable[];
    body: string;
}

/**
 * Replace template variables in a string
 * Variables are denoted as {{VARIABLE_NAME}}
 */
export function renderTemplate(
    template: string,
    values: Record<string, string>
): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return values[key] !== undefined ? values[key] : match;
    });
}

/**
 * Extract all variable names from a template string
 */
export function extractVariables(template: string): string[] {
    const matches = template.matchAll(/\{\{(\w+)\}\}/g);
    return [...new Set([...matches].map((m) => m[1]))];
}

/**
 * Validate that all required variables have values
 */
export function validateTemplateValues(
    templateDef: DocumentTemplate,
    values: Record<string, string>
): { valid: boolean; missing: string[] } {
    const missing = templateDef.variables
        .filter((v) => v.required && !values[v.key]?.trim())
        .map((v) => v.key);

    return { valid: missing.length === 0, missing };
}

/**
 * Build default values map from a template definition
 */
export function getDefaultValues(templateDef: DocumentTemplate): Record<string, string> {
    const defaults: Record<string, string> = {};
    for (const variable of templateDef.variables) {
        if (variable.defaultValue) {
            defaults[variable.key] = variable.defaultValue;
        }
    }
    return defaults;
}

/**
 * Count unresolved variables in rendered output
 */
export function countUnresolved(rendered: string): number {
    const matches = rendered.match(/\{\{\w+\}\}/g);
    return matches ? matches.length : 0;
}

/**
 * Pre-built NDA template
 */
export const NDA_TEMPLATE: DocumentTemplate = {
    id: 'nda-standard',
    name: 'Standard NDA',
    category: 'NDA',
    description: 'Mutual non-disclosure agreement between two parties.',
    variables: [
        { key: 'PARTY_A', label: 'First Party Name', type: 'text', required: true, placeholder: 'Acme Corp' },
        { key: 'PARTY_B', label: 'Second Party Name', type: 'text', required: true, placeholder: 'Widget Inc' },
        { key: 'EFFECTIVE_DATE', label: 'Effective Date', type: 'date', required: true },
        { key: 'DURATION', label: 'Duration (years)', type: 'number', required: true, defaultValue: '2' },
        { key: 'GOVERNING_STATE', label: 'Governing State', type: 'text', required: true, defaultValue: 'Delaware' },
    ],
    body: `MUTUAL NON-DISCLOSURE AGREEMENT

This Mutual Non-Disclosure Agreement ("Agreement") is entered into as of {{EFFECTIVE_DATE}} (the "Effective Date") by and between:

{{PARTY_A}} ("First Party") and {{PARTY_B}} ("Second Party"), collectively referred to as the "Parties."

1. DEFINITION OF CONFIDENTIAL INFORMATION
"Confidential Information" means any non-public information disclosed by either Party to the other, whether orally, in writing, or by any other means, that is designated as confidential or that reasonably should be understood to be confidential.

2. OBLIGATIONS
Each Party agrees to: (a) hold the other Party's Confidential Information in strict confidence; (b) not disclose such information to third parties without prior written consent; (c) use such information solely for the purpose of evaluating or engaging in business discussions between the Parties.

3. TERM
This Agreement shall remain in effect for {{DURATION}} years from the Effective Date.

4. GOVERNING LAW
This Agreement shall be governed by the laws of the State of {{GOVERNING_STATE}}.

IN WITNESS WHEREOF, the Parties have executed this Agreement as of the Effective Date.

________________________          ________________________
{{PARTY_A}}                       {{PARTY_B}}`,
};
