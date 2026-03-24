import {
    createAuditEntry,
    AuditLog,
} from '@/lib/audit-trail';

describe('Audit Trail', () => {
    describe('createAuditEntry', () => {
        it('creates an entry with all fields', () => {
            const entry = createAuditEntry('create', 'document', 'doc-1', 'user-1', { title: 'NDA' });
            expect(entry.id).toBeTruthy();
            expect(entry.action).toBe('create');
            expect(entry.entityType).toBe('document');
            expect(entry.entityId).toBe('doc-1');
            expect(entry.userId).toBe('user-1');
            expect(entry.timestamp).toBeTruthy();
            expect(entry.details?.title).toBe('NDA');
        });

        it('generates unique IDs', () => {
            const e1 = createAuditEntry('read', 'document', 'd1', 'u1');
            const e2 = createAuditEntry('read', 'document', 'd1', 'u1');
            expect(e1.id).not.toBe(e2.id);
        });
    });

    describe('AuditLog', () => {
        let log: AuditLog;

        beforeEach(() => {
            log = new AuditLog();
        });

        it('records and retrieves entries', () => {
            log.record('create', 'document', 'doc-1', 'user-1');
            expect(log.size).toBe(1);
        });

        it('queries by entity', () => {
            log.record('create', 'document', 'doc-1', 'user-1');
            log.record('update', 'document', 'doc-1', 'user-1');
            log.record('create', 'chat', 'chat-1', 'user-1');

            const docEntries = log.getByEntity('document', 'doc-1');
            expect(docEntries.length).toBe(2);
        });

        it('queries by user', () => {
            log.record('create', 'document', 'doc-1', 'user-1');
            log.record('create', 'document', 'doc-2', 'user-2');
            log.record('read', 'chat', 'chat-1', 'user-1');

            expect(log.getByUser('user-1').length).toBe(2);
            expect(log.getByUser('user-2').length).toBe(1);
        });

        it('queries by action', () => {
            log.record('create', 'document', 'doc-1', 'user-1');
            log.record('delete', 'document', 'doc-2', 'user-1');
            log.record('create', 'chat', 'chat-1', 'user-1');

            expect(log.getByAction('create').length).toBe(2);
            expect(log.getByAction('delete').length).toBe(1);
        });

        it('gets recent entries', () => {
            log.record('create', 'document', 'doc-1', 'user-1');
            log.record('create', 'document', 'doc-2', 'user-1');
            log.record('create', 'document', 'doc-3', 'user-1');

            const recent = log.getRecent(2);
            expect(recent.length).toBe(2);
            expect(recent[0].entityId).toBe('doc-3'); // newest first
        });

        it('exports all entries', () => {
            log.record('create', 'document', 'doc-1', 'user-1');
            log.record('update', 'document', 'doc-1', 'user-1');

            const exported = log.export();
            expect(exported.length).toBe(2);
        });

        it('clears log', () => {
            log.record('create', 'document', 'doc-1', 'user-1');
            log.clear();
            expect(log.size).toBe(0);
        });
    });
});
