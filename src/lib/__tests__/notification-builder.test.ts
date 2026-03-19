import {
    documentCreatedNotification,
    reviewCompletedNotification,
    escalationUpdateNotification,
    subscriptionWarningNotification,
    systemAlertNotification,
    welcomeNotification,
} from '@/lib/notification-builder';

describe('Notification Builder', () => {
    describe('documentCreatedNotification', () => {
        it('builds correct payload', () => {
            const n = documentCreatedNotification('My NDA', 'doc-123');
            expect(n.type).toBe('document_created');
            expect(n.title).toBe('Document Created');
            expect(n.message).toContain('My NDA');
            expect(n.priority).toBe('low');
            expect(n.actionUrl).toContain('doc-123');
        });
    });

    describe('reviewCompletedNotification', () => {
        it('sets high priority for critical risk', () => {
            const n = reviewCompletedNotification('Contract', 'CRITICAL', 'rev-1');
            expect(n.priority).toBe('high');
            expect(n.metadata?.riskLevel).toBe('CRITICAL');
        });

        it('sets medium priority for low risk', () => {
            const n = reviewCompletedNotification('Contract', 'LOW', 'rev-2');
            expect(n.priority).toBe('medium');
        });
    });

    describe('escalationUpdateNotification', () => {
        it('includes subject and status', () => {
            const n = escalationUpdateNotification('Lease Dispute', 'In Progress', 'esc-1');
            expect(n.message).toContain('Lease Dispute');
            expect(n.message).toContain('In Progress');
            expect(n.actionUrl).toContain('esc-1');
        });
    });

    describe('subscriptionWarningNotification', () => {
        it('includes usage percentage', () => {
            const n = subscriptionWarningNotification('documents', 90);
            expect(n.priority).toBe('high');
            expect(n.message).toContain('90%');
            expect(n.message).toContain('documents');
        });
    });

    describe('systemAlertNotification', () => {
        it('uses provided title and message', () => {
            const n = systemAlertNotification('Maintenance', 'Scheduled downtime at 2 AM');
            expect(n.title).toBe('Maintenance');
            expect(n.message).toContain('downtime');
            expect(n.type).toBe('system_alert');
        });
    });

    describe('welcomeNotification', () => {
        it('includes user name', () => {
            const n = welcomeNotification('John');
            expect(n.message).toContain('John');
            expect(n.type).toBe('welcome');
            expect(n.priority).toBe('low');
        });
    });
});
