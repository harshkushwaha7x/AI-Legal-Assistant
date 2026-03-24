/**
 * Document redaction utility
 * Detects and redacts sensitive information from legal documents
 */

export interface RedactionRule {
    id: string;
    name: string;
    pattern: RegExp;
    replacement: string;
    category: string;
}

export interface RedactionResult {
    redacted: string;
    matches: { rule: string; original: string; position: number }[];
    totalRedactions: number;
}

const DEFAULT_RULES: RedactionRule[] = [
    {
        id: 'ssn',
        name: 'Social Security Number',
        pattern: /\b\d{3}-\d{2}-\d{4}\b/g,
        replacement: '[SSN REDACTED]',
        category: 'PII',
    },
    {
        id: 'email',
        name: 'Email Address',
        pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
        replacement: '[EMAIL REDACTED]',
        category: 'Contact',
    },
    {
        id: 'phone-us',
        name: 'US Phone Number',
        pattern: /\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
        replacement: '[PHONE REDACTED]',
        category: 'Contact',
    },
    {
        id: 'credit-card',
        name: 'Credit Card Number',
        pattern: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g,
        replacement: '[CC REDACTED]',
        category: 'Financial',
    },
    {
        id: 'ein',
        name: 'Employer ID Number',
        pattern: /\b\d{2}-\d{7}\b/g,
        replacement: '[EIN REDACTED]',
        category: 'Business',
    },
    {
        id: 'date-of-birth',
        name: 'Date of Birth Pattern',
        pattern: /\b(?:DOB|Date of Birth|Born)[:\s]+\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/gi,
        replacement: '[DOB REDACTED]',
        category: 'PII',
    },
    {
        id: 'bank-account',
        name: 'Bank Account Number',
        pattern: /\b(?:account|acct)[#:\s]*\d{8,17}\b/gi,
        replacement: '[ACCOUNT REDACTED]',
        category: 'Financial',
    },
];

/**
 * Apply redaction rules to text
 */
export function redactText(
    text: string,
    rules: RedactionRule[] = DEFAULT_RULES
): RedactionResult {
    const matches: RedactionResult['matches'] = [];
    let result = text;

    for (const rule of rules) {
        // Reset regex state
        const regex = new RegExp(rule.pattern.source, rule.pattern.flags);
        let match: RegExpExecArray | null;

        while ((match = regex.exec(text)) !== null) {
            matches.push({
                rule: rule.name,
                original: match[0],
                position: match.index,
            });
        }

        result = result.replace(
            new RegExp(rule.pattern.source, rule.pattern.flags),
            rule.replacement
        );
    }

    return {
        redacted: result,
        matches,
        totalRedactions: matches.length,
    };
}

/**
 * Get available redaction categories
 */
export function getRedactionCategories(rules: RedactionRule[] = DEFAULT_RULES): string[] {
    return [...new Set(rules.map((r) => r.category))];
}

/**
 * Filter rules by category
 */
export function getRulesByCategory(
    category: string,
    rules: RedactionRule[] = DEFAULT_RULES
): RedactionRule[] {
    return rules.filter((r) => r.category === category);
}

/**
 * Check if text contains sensitive information
 */
export function containsSensitiveData(
    text: string,
    rules: RedactionRule[] = DEFAULT_RULES
): boolean {
    return rules.some((rule) => new RegExp(rule.pattern.source, rule.pattern.flags).test(text));
}

export { DEFAULT_RULES };
