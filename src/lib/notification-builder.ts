/**
 * Notification builder utility
 * Constructs notification payloads for different application events
 */

export type NotificationType =
    | 'document_created'
    | 'document_shared'
    | 'review_completed'
    | 'escalation_update'
    | 'system_alert'
    | 'subscription_warning'
    | 'welcome';

export interface NotificationPayload {
    type: NotificationType;
    title: string;
    message: string;
    priority: 'low' | 'medium' | 'high';
    actionUrl?: string;
    actionLabel?: string;
    metadata?: Record<string, unknown>;
}

/**
 * Build a document created notification
 */
export function documentCreatedNotification(
    docTitle: string,
    docId: string
): NotificationPayload {
    return {
        type: 'document_created',
        title: 'Document Created',
        message: `Your document "${docTitle}" has been created successfully.`,
        priority: 'low',
        actionUrl: `/dashboard/documents/${docId}`,
        actionLabel: 'View Document',
    };
}

/**
 * Build a review completed notification
 */
export function reviewCompletedNotification(
    contractName: string,
    riskLevel: string,
    reviewId: string
): NotificationPayload {
    const priority = riskLevel === 'HIGH' || riskLevel === 'CRITICAL' ? 'high' : 'medium';
    return {
        type: 'review_completed',
        title: 'Contract Review Complete',
        message: `Review of "${contractName}" is complete. Risk level: ${riskLevel}.`,
        priority,
        actionUrl: `/dashboard/reviews/${reviewId}`,
        actionLabel: 'View Review',
        metadata: { riskLevel },
    };
}

/**
 * Build an escalation update notification
 */
export function escalationUpdateNotification(
    subject: string,
    status: string,
    escalationId: string
): NotificationPayload {
    return {
        type: 'escalation_update',
        title: 'Escalation Updated',
        message: `Your escalation "${subject}" has been updated to: ${status}.`,
        priority: 'medium',
        actionUrl: `/dashboard/escalations/${escalationId}`,
        actionLabel: 'View Details',
        metadata: { status },
    };
}

/**
 * Build a subscription warning notification
 */
export function subscriptionWarningNotification(
    resource: string,
    usagePercent: number
): NotificationPayload {
    return {
        type: 'subscription_warning',
        title: 'Usage Limit Warning',
        message: `You have used ${usagePercent}% of your ${resource} limit. Consider upgrading your plan.`,
        priority: 'high',
        actionUrl: '/dashboard/settings',
        actionLabel: 'Upgrade Plan',
        metadata: { resource, usagePercent },
    };
}

/**
 * Build a system alert notification
 */
export function systemAlertNotification(
    title: string,
    message: string
): NotificationPayload {
    return {
        type: 'system_alert',
        title,
        message,
        priority: 'medium',
    };
}

/**
 * Build a welcome notification for new users
 */
export function welcomeNotification(userName: string): NotificationPayload {
    return {
        type: 'welcome',
        title: 'Welcome to LegalAI',
        message: `Hello ${userName}, welcome to your AI-powered legal assistant. Start by creating your first document or asking a legal question.`,
        priority: 'low',
        actionUrl: '/dashboard',
        actionLabel: 'Get Started',
    };
}
