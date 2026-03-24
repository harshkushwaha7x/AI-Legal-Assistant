import {
    createAuditEntry,
    AuditLog,
} from '@/lib/audit-trail';

import {
    getSecurityHeaders,
} from '@/lib/security-headers';

import {
    computeSignature,
} from '@/lib/webhook';

describe('Integration: Security + Audit', () => {
    describe('Audit entry with security context', () => {
        it('records security-relevant audit events', () => {
            const log = new AuditLog();
            const entry = log.record('read', 'document', 'doc-sensitive-1', 'user-1', {
                accessLevel: 'confidential',
                ipAddress: '10.0.0.1',
                headers: Object.keys(getSecurityHeaders()),
            });

            expect(entry.action).toBe('read');
            expect(entry.details?.accessLevel).toBe('confidential');
            expect(Array.isArray(entry.details?.headers)).toBe(true);
        });

        it('tracks multiple security actions in sequence', () => {
            const log = new AuditLog();
            log.record('read', 'document', 'doc-1', 'user-1');
            log.record('download', 'document', 'doc-1', 'user-1');
            log.record('share', 'document', 'doc-1', 'user-1', { sharedWith: 'user-2' });

            const docActions = log.getByEntity('document', 'doc-1');
            expect(docActions).toHaveLength(3);
            expect(docActions.map((e) => e.action)).toEqual(['read', 'download', 'share']);
        });
    });

    describe('Webhook signing consistency', () => {
        it('produces consistent signatures for same input', () => {
            const secret = 'integration-test-secret';
            const body = JSON.stringify({ event: 'document.created', id: 'test-123' });

            const sig1 = computeSignature(secret, body);
            const sig2 = computeSignature(secret, body);
            expect(sig1).toBe(sig2);
        });

        it('produces different signatures for different secrets', () => {
            const body = JSON.stringify({ event: 'test' });
            const sig1 = computeSignature('secret-a', body);
            const sig2 = computeSignature('secret-b', body);
            expect(sig1).not.toBe(sig2);
        });
    });
});
