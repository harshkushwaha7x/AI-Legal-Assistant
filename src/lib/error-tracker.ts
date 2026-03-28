/**
 * Error tracking utility for structured error reporting
 */

interface ErrorContext {
    module: string;
    action: string;
    userId?: string;
    metadata?: Record<string, unknown>;
}

interface TrackedError {
    id: string;
    message: string;
    stack?: string;
    context: ErrorContext;
    timestamp: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
}

class ErrorTracker {
    private errors: TrackedError[] = [];
    private maxErrors = 100;

    track(error: Error, context: ErrorContext, severity: TrackedError['severity'] = 'medium'): TrackedError {
        const tracked: TrackedError = {
            id: crypto.randomUUID?.() || `err_${Date.now()}`,
            message: error.message,
            stack: error.stack,
            context,
            timestamp: new Date().toISOString(),
            severity,
        };

        this.errors.push(tracked);

        // Keep buffer bounded
        if (this.errors.length > this.maxErrors) {
            this.errors = this.errors.slice(-this.maxErrors);
        }

        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error(`[ErrorTracker] ${severity.toUpperCase()} — ${context.module}.${context.action}:`, error.message);
        }

        return tracked;
    }

    getRecent(count: number = 10): TrackedError[] {
        return this.errors.slice(-count).reverse();
    }

    getBySeverity(severity: TrackedError['severity']): TrackedError[] {
        return this.errors.filter((e) => e.severity === severity);
    }

    getByModule(module: string): TrackedError[] {
        return this.errors.filter((e) => e.context.module === module);
    }

    clear(): void {
        this.errors = [];
    }

    getStats(): { total: number; bySeverity: Record<string, number>; byModule: Record<string, number> } {
        const bySeverity: Record<string, number> = {};
        const byModule: Record<string, number> = {};
        for (const err of this.errors) {
            bySeverity[err.severity] = (bySeverity[err.severity] || 0) + 1;
            byModule[err.context.module] = (byModule[err.context.module] || 0) + 1;
        }
        return { total: this.errors.length, bySeverity, byModule };
    }

    exportAll(): TrackedError[] {
        return [...this.errors];
    }
}

export const errorTracker = new ErrorTracker();

/**
 * Convenience function to track errors
 */
export function trackError(
    error: unknown,
    module: string,
    action: string,
    severity: TrackedError['severity'] = 'medium'
): TrackedError {
    const err = error instanceof Error ? error : new Error(String(error));
    return errorTracker.track(err, { module, action }, severity);
}
