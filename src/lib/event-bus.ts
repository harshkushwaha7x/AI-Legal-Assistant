/**
 * Event emitter for application-level event bus
 * Enables decoupled communication between modules
 */

type EventHandler<T = unknown> = (data: T) => void;

class EventBus {
    private handlers: Map<string, Set<EventHandler>> = new Map();

    /**
     * Subscribe to an event
     */
    on<T = unknown>(event: string, handler: EventHandler<T>): () => void {
        if (!this.handlers.has(event)) {
            this.handlers.set(event, new Set());
        }
        this.handlers.get(event)!.add(handler as EventHandler);

        // Return unsubscribe function
        return () => {
            this.handlers.get(event)?.delete(handler as EventHandler);
        };
    }

    /**
     * Subscribe to an event once (auto-unsubscribes after first call)
     */
    once<T = unknown>(event: string, handler: EventHandler<T>): () => void {
        const wrapper: EventHandler<T> = (data) => {
            handler(data);
            this.handlers.get(event)?.delete(wrapper as EventHandler);
        };
        return this.on(event, wrapper);
    }

    /**
     * Emit an event with data
     */
    emit<T = unknown>(event: string, data?: T): void {
        const eventHandlers = this.handlers.get(event);
        if (eventHandlers) {
            eventHandlers.forEach((handler) => handler(data));
        }
    }

    /**
     * Remove all handlers for an event or all events
     */
    clear(event?: string): void {
        if (event) {
            this.handlers.delete(event);
        } else {
            this.handlers.clear();
        }
    }

    /**
     * Get the number of handlers for an event
     */
    listenerCount(event: string): number {
        return this.handlers.get(event)?.size || 0;
    }
}

// Singleton event bus instance
export const eventBus = new EventBus();

// Pre-defined application events
export const APP_EVENTS = {
    DOCUMENT_CREATED: 'document:created',
    DOCUMENT_UPDATED: 'document:updated',
    DOCUMENT_DELETED: 'document:deleted',
    DOCUMENT_EXPORTED: 'document:exported',
    CHAT_MESSAGE_SENT: 'chat:message:sent',
    CHAT_SESSION_CREATED: 'chat:session:created',
    REVIEW_STARTED: 'review:started',
    REVIEW_COMPLETED: 'review:completed',
    ESCALATION_CREATED: 'escalation:created',
    ESCALATION_RESOLVED: 'escalation:resolved',
    TEMPLATE_USED: 'template:used',
    COMPLIANCE_CHECKED: 'compliance:checked',
    NOTIFICATION_RECEIVED: 'notification:received',
    USER_LOGGED_IN: 'user:logged_in',
    USER_LOGGED_OUT: 'user:logged_out',
    THEME_CHANGED: 'theme:changed',
    ERROR_OCCURRED: 'error:occurred',
} as const;

export default EventBus;
