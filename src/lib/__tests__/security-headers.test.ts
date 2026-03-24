import {
    getSecurityHeaders,
} from '@/lib/security-headers';

describe('Security Headers', () => {
    it('returns a headers object', () => {
        const headers = getSecurityHeaders();
        expect(typeof headers).toBe('object');
    });

    it('includes Content-Security-Policy', () => {
        const headers = getSecurityHeaders();
        expect(headers['Content-Security-Policy']).toBeTruthy();
    });

    it('includes X-Frame-Options', () => {
        const headers = getSecurityHeaders();
        expect(headers['X-Frame-Options']).toBeTruthy();
    });

    it('includes X-Content-Type-Options', () => {
        const headers = getSecurityHeaders();
        expect(headers['X-Content-Type-Options']).toBe('nosniff');
    });

    it('includes Referrer-Policy', () => {
        const headers = getSecurityHeaders();
        expect(headers['Referrer-Policy']).toBeTruthy();
    });

    it('includes Strict-Transport-Security', () => {
        const headers = getSecurityHeaders();
        expect(headers['Strict-Transport-Security']).toBeTruthy();
        expect(headers['Strict-Transport-Security']).toContain('max-age');
    });

    it('includes X-XSS-Protection', () => {
        const headers = getSecurityHeaders();
        expect(headers['X-XSS-Protection']).toBeTruthy();
    });

    it('includes Permissions-Policy', () => {
        const headers = getSecurityHeaders();
        expect(headers['Permissions-Policy']).toBeTruthy();
    });
});
