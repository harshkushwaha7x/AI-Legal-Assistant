/**
 * Audit trail utility
 * Records and queries immutable audit entries for document and user actions
 */

export type AuditAction =
    | 'create'
    | 'read'
    | 'update'
    | 'delete'
    | 'share'
    | 'download'
    | 'sign'
    | 'review'
    | 'escalate'
    | 'approve'
    | 'reject';

export interface AuditEntry {
    id: string;
    action: AuditAction;
    entityType: string;
    entityId: string;
    userId: string;
    timestamp: string;
    details?: Record<string, unknown>;
    ipAddress?: string;
}

let counter = 0;

function generateAuditId(): string {
    counter += 1;
    return `audit-${Date.now()}-${counter}`;
}

/**
 * Create an audit entry
 */
export function createAuditEntry(
    action: AuditAction,
    entityType: string,
    entityId: string,
    userId: string,
    details?: Record<string, unknown>,
    ipAddress?: string
): AuditEntry {
    return {
        id: generateAuditId(),
        action,
        entityType,
        entityId,
        userId,
        timestamp: new Date().toISOString(),
        details,
        ipAddress,
    };
}

/**
 * In-memory audit log for client-side tracking
 */
export class AuditLog {
    private entries: AuditEntry[] = [];

    /**
     * Record a new entry
     */
    record(
        action: AuditAction,
        entityType: string,
        entityId: string,
        userId: string,
        details?: Record<string, unknown>
    ): AuditEntry {
        const entry = createAuditEntry(action, entityType, entityId, userId, details);
        this.entries.push(entry);
        return entry;
    }

    /**
     * Query entries by entity
     */
    getByEntity(entityType: string, entityId: string): AuditEntry[] {
        return this.entries.filter(
            (e) => e.entityType === entityType && e.entityId === entityId
        );
    }

    /**
     * Query entries by user
     */
    getByUser(userId: string): AuditEntry[] {
        return this.entries.filter((e) => e.userId === userId);
    }

    /**
     * Query entries by action type
     */
    getByAction(action: AuditAction): AuditEntry[] {
        return this.entries.filter((e) => e.action === action);
    }

    /**
     * Get entries within a time range
     */
    getByTimeRange(start: Date, end: Date): AuditEntry[] {
        return this.entries.filter((e) => {
            const t = new Date(e.timestamp).getTime();
            return t >= start.getTime() && t <= end.getTime();
        });
    }

    /**
     * Get recent entries
     */
    getRecent(count: number): AuditEntry[] {
        return this.entries.slice(-count).reverse();
    }

    /**
     * Get total count
     */
    get size(): number {
        return this.entries.length;
    }

    /**
     * Export all entries
     */
    export(): AuditEntry[] {
        return [...this.entries];
    }

    /**
     * Clear audit log
     */
    clear(): void {
        this.entries = [];
    }
}
