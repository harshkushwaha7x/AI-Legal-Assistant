import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature, type WebhookPayload } from '@/lib/webhook';
import { createLogger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

const logger = createLogger('Webhooks');
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || '';

/**
 * POST /api/webhooks
 * Inbound webhook handler with HMAC-SHA256 signature verification
 */
export async function POST(req: NextRequest) {
    const body = await req.text();
    const signatureHeader = req.headers.get('X-Webhook-Signature') || '';
    const timestampHeader = req.headers.get('X-Webhook-Timestamp') || '';

    // Verify signature if secret is configured
    if (WEBHOOK_SECRET) {
        const verification = verifyWebhookSignature(
            WEBHOOK_SECRET,
            body,
            signatureHeader,
            timestampHeader
        );

        if (!verification.valid) {
            logger.warn('Webhook signature verification failed', { reason: verification.reason });
            return NextResponse.json(
                { error: 'Invalid webhook signature' },
                { status: 401 }
            );
        }
    }

    let payload: WebhookPayload;
    try {
        payload = JSON.parse(body);
    } catch {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    if (!payload.event || !payload.id) {
        return NextResponse.json({ error: 'Missing required payload fields' }, { status: 400 });
    }

    logger.info('Received webhook event', { event: payload.event, id: payload.id });

    // Dispatch by event type
    try {
        await dispatchWebhookEvent(payload);
    } catch (error) {
        logger.error('Webhook dispatch failed', { event: payload.event, error });
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
    }

    return NextResponse.json({ received: true, id: payload.id });
}

/**
 * Dispatch webhook events to appropriate handlers
 */
async function dispatchWebhookEvent(payload: WebhookPayload): Promise<void> {
    switch (payload.event) {
        case 'document.created':
        case 'document.updated':
        case 'document.deleted':
            logger.info('Document event received', { event: payload.event, data: payload.data });
            break;

        case 'review.completed':
            logger.info('Review completed event received', { data: payload.data });
            break;

        case 'escalation.created':
        case 'escalation.resolved':
            logger.info('Escalation event received', { event: payload.event, data: payload.data });
            break;

        case 'user.registered':
            logger.info('User registered event received', { data: payload.data });
            break;

        default:
            logger.warn('Unknown webhook event type', { event: payload.event });
    }
}
