import { validate, validateForm, required, email, minLength, maxLength, passwordStrength } from '@/lib/validation';

describe('Validation Utilities', () => {
    describe('required rule', () => {
        it('fails for empty string', () => {
            expect(required.validate('')).toBe(false);
        });

        it('passes for non-empty string', () => {
            expect(required.validate('John')).toBe(true);
        });

        it('fails for whitespace-only', () => {
            expect(required.validate('   ')).toBe(false);
        });
    });

    describe('email rule', () => {
        it('accepts valid email', () => {
            expect(email.validate('test@example.com')).toBe(true);
        });

        it('rejects invalid email', () => {
            expect(email.validate('not-an-email')).toBe(false);
        });

        it('rejects empty string', () => {
            expect(email.validate('')).toBe(false);
        });
    });

    describe('minLength rule', () => {
        it('accepts string meeting minimum', () => {
            const rule = minLength(3);
            expect(rule.validate('abc')).toBe(true);
        });

        it('rejects string below minimum', () => {
            const rule = minLength(5);
            expect(rule.validate('ab')).toBe(false);
        });
    });

    describe('maxLength rule', () => {
        it('accepts string within limit', () => {
            const rule = maxLength(10);
            expect(rule.validate('hello')).toBe(true);
        });

        it('rejects string exceeding limit', () => {
            const rule = maxLength(3);
            expect(rule.validate('hello')).toBe(false);
        });
    });

    describe('passwordStrength rule', () => {
        it('accepts strong passwords', () => {
            expect(passwordStrength.validate('MyPass123')).toBe(true);
        });

        it('rejects weak passwords', () => {
            expect(passwordStrength.validate('abc')).toBe(false);
        });
    });

    describe('validate', () => {
        it('returns valid for passing rules', () => {
            const result = validate('test@example.com', [required, email]);
            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('returns errors for failing rules', () => {
            const result = validate('', [required, email]);
            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
        });
    });

    describe('validateForm', () => {
        it('returns valid for correct form', () => {
            const result = validateForm({
                name: { value: 'John', rules: [required] },
                email: { value: 'john@example.com', rules: [required, email] },
            });
            expect(result.valid).toBe(true);
        });

        it('returns errors for invalid form', () => {
            const result = validateForm({
                name: { value: '', rules: [required] },
                email: { value: 'invalid', rules: [email] },
            });
            expect(result.valid).toBe(false);
            expect(result.errors).toHaveProperty('name');
            expect(result.errors).toHaveProperty('email');
        });
    });
});
