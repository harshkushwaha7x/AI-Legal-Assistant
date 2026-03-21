import {
    buildWebhookPayload,
    computeSignature,
    createWebhookHeaders,
    verifyWebhookSignature,
} from '@/lib/webhook';

const TEST_SECRET = 'test-secret-key-abc123';

describe('Webhook Utilities', () => {
    describe('buildWebhookPayload', () => {
        it('builds a valid payload', () => {
            const payload = buildWebhookPayload('document.created', { id: 'doc-1', title: 'NDA' });
            expect(payload.event).toBe('document.created');
            expect(payload.version).toBe('1');
            expect(payload.data.id).toBe('doc-1');
            expect(payload.id).toBeTruthy();
            expect(payload.createdAt).toBeTruthy();
        });

        it('includes timestamp', () => {
            const payload = buildWebhookPayload('review.completed', {});
            expect(new Date(payload.createdAt).getTime()).toBeLessThanOrEqual(Date.now());
        });

        it('generates unique IDs', () => {
            const p1 = buildWebhookPayload('user.registered', {});
            const p2 = buildWebhookPayload('user.registered', {});
            expect(p1.id).not.toBe(p2.id);
        });
    });

    describe('computeSignature', () => {
        it('produces a hex string', () => {
            const sig = computeSignature('secret', 'body');
            expect(/^[a-f0-9]{64}$/.test(sig)).toBe(true);
        });

        it('is deterministic', () => {
            const sig1 = computeSignature('secret', 'body');
            const sig2 = computeSignature('secret', 'body');
            expect(sig1).toBe(sig2);
        });

        it('changes with different inputs', () => {
            const sig1 = computeSignature('secret', 'body1');
            const sig2 = computeSignature('secret', 'body2');
            expect(sig1).not.toBe(sig2);
        });
    });

    describe('createWebhookHeaders', () => {
        it('returns required headers', () => {
            const headers = createWebhookHeaders(TEST_SECRET, '{"test":true}');
            expect(headers['Content-Type']).toBe('application/json');
            expect(headers['X-Webhook-Timestamp']).toBeTruthy();
            expect(headers['X-Webhook-Signature']).toMatch(/^sha256=/);
        });
    });

    describe('verifyWebhookSignature', () => {
        it('verifies a valid signature', () => {
            const body = '{"event":"document.created"}';
            const timestamp = Date.now().toString();
            const signedContent = `${timestamp}.${body}`;
            const sig = `sha256=${computeSignature(TEST_SECRET, signedContent)}`;

            const result = verifyWebhookSignature(TEST_SECRET, body, sig, timestamp);
            expect(result.valid).toBe(true);
        });

        it('rejects invalid signature', () => {
            const body = '{"event":"document.created"}';
            const timestamp = Date.now().toString();

            const result = verifyWebhookSignature(TEST_SECRET, body, 'sha256=invalidsig', timestamp);
            expect(result.valid).toBe(false);
            expect(result.reason).toBeTruthy();
        });

        it('rejects expired timestamp', () => {
            const body = 'test';
            const oldTimestamp = (Date.now() - 10 * 60 * 1000).toString(); // 10 min ago
            const signedContent = `${oldTimestamp}.${body}`;
            const sig = `sha256=${computeSignature(TEST_SECRET, signedContent)}`;

            const result = verifyWebhookSignature(TEST_SECRET, body, sig, oldTimestamp, 5 * 60 * 1000);
            expect(result.valid).toBe(false);
            expect(result.reason).toContain('too old');
        });

        it('rejects invalid timestamp format', () => {
            const result = verifyWebhookSignature(TEST_SECRET, 'body', 'sha256=abc', 'not-a-number');
            expect(result.valid).toBe(false);
            expect(result.reason).toContain('timestamp');
        });
    });
});
