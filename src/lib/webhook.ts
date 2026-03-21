/**
 * Webhook utility
 * Builds typed event payloads, signs outbound webhooks, and verifies inbound signatures
 */

import crypto from 'crypto';

export type WebhookEventType =
    | 'document.created'
    | 'document.updated'
    | 'document.deleted'
    | 'review.completed'
    | 'escalation.created'
    | 'escalation.resolved'
    | 'chat.session.started'
    | 'user.registered';

export interface WebhookPayload {
    id: string;
    event: WebhookEventType;
    createdAt: string;
    data: Record<string, unknown>;
    version: '1';
}

/**
 * Build a webhook event payload
 */
export function buildWebhookPayload(
    event: WebhookEventType,
    data: Record<string, unknown>
): WebhookPayload {
    return {
        id: crypto.randomUUID(),
        event,
        createdAt: new Date().toISOString(),
        data,
        version: '1',
    };
}

/**
 * Compute HMAC-SHA256 signature for a payload string
 */
export function computeSignature(secret: string, body: string): string {
    return crypto
        .createHmac('sha256', secret)
        .update(body, 'utf8')
        .digest('hex');
}

/**
 * Create headers for an outbound signed webhook request
 */
export function createWebhookHeaders(
    secret: string,
    body: string
): Record<string, string> {
    const timestamp = Date.now().toString();
    const signedContent = `${timestamp}.${body}`;
    const signature = computeSignature(secret, signedContent);

    return {
        'Content-Type': 'application/json',
        'X-Webhook-Timestamp': timestamp,
        'X-Webhook-Signature': `sha256=${signature}`,
    };
}

/**
 * Verify an inbound webhook signature
 * @param secret - The shared webhook secret
 * @param body - Raw request body string
 * @param signatureHeader - Value of X-Webhook-Signature header
 * @param timestampHeader - Value of X-Webhook-Timestamp header
 * @param toleranceMs - Maximum allowed age in milliseconds (default 5 minutes)
 */
export function verifyWebhookSignature(
    secret: string,
    body: string,
    signatureHeader: string,
    timestampHeader: string,
    toleranceMs = 5 * 60 * 1000
): { valid: boolean; reason?: string } {
    // Check timestamp to prevent replay attacks
    const timestamp = parseInt(timestampHeader, 10);
    if (isNaN(timestamp)) {
        return { valid: false, reason: 'Invalid timestamp header' };
    }

    const age = Date.now() - timestamp;
    if (age > toleranceMs) {
        return { valid: false, reason: 'Webhook timestamp too old' };
    }

    // Verify signature
    const signedContent = `${timestampHeader}.${body}`;
    const expected = `sha256=${computeSignature(secret, signedContent)}`;

    const isValid = crypto.timingSafeEqual(
        Buffer.from(expected, 'utf8'),
        Buffer.from(signatureHeader, 'utf8')
    );

    return isValid
        ? { valid: true }
        : { valid: false, reason: 'Signature mismatch' };
}
