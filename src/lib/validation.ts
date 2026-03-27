/**
 * Form validation utilities
 */

export interface ValidationRule {
    validate: (value: string) => boolean;
    message: string;
}

export interface ValidationResult {
    valid: boolean;
    errors: string[];
}

/**
 * Validate a value against multiple rules
 */
export function validate(value: string, rules: ValidationRule[]): ValidationResult {
    const errors = rules
        .filter((rule) => !rule.validate(value))
        .map((rule) => rule.message);

    return { valid: errors.length === 0, errors };
}

// ── Common Validation Rules ─────────────────────────────

export const required: ValidationRule = {
    validate: (v) => v.trim().length > 0,
    message: 'This field is required',
};

export const email: ValidationRule = {
    validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    message: 'Please enter a valid email address',
};

export const minLength = (min: number): ValidationRule => ({
    validate: (v) => v.length >= min,
    message: `Must be at least ${min} characters`,
});

export const maxLength = (max: number): ValidationRule => ({
    validate: (v) => v.length <= max,
    message: `Must be no more than ${max} characters`,
});

export const pattern = (regex: RegExp, message: string): ValidationRule => ({
    validate: (v) => regex.test(v),
    message,
});

export const passwordStrength: ValidationRule = {
    validate: (v) =>
        v.length >= 8 &&
        /[A-Z]/.test(v) &&
        /[a-z]/.test(v) &&
        /[0-9]/.test(v),
    message: 'Password must be 8+ chars with uppercase, lowercase, and number',
};

export const url: ValidationRule = {
    validate: (v) => {
        try {
            new URL(v);
            return true;
        } catch {
            return false;
        }
    },
    message: 'Please enter a valid URL',
};

export const phone: ValidationRule = {
    validate: (v) => /^\+?[\d\s()-]{7,15}$/.test(v.trim()),
    message: 'Please enter a valid phone number',
};

export const numeric: ValidationRule = {
    validate: (v) => /^\d+$/.test(v),
    message: 'This field must contain only numbers',
};

export const dateString: ValidationRule = {
    validate: (v) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !isNaN(Date.parse(v)),
    message: 'Please enter a valid date (YYYY-MM-DD)',
};

export const matchesField = (fieldName: string, fieldValue: string): ValidationRule => ({
    validate: (v) => v === fieldValue,
    message: `Must match ${fieldName}`,
});

/**
 * Validate an entire form
 */
export function validateForm(
    fields: Record<string, { value: string; rules: ValidationRule[] }>
): { valid: boolean; errors: Record<string, string[]> } {
    const errors: Record<string, string[]> = {};
    let valid = true;

    for (const [field, { value, rules }] of Object.entries(fields)) {
        const result = validate(value, rules);
        if (!result.valid) {
            valid = false;
            errors[field] = result.errors;
        }
    }

    return { valid, errors };
}
