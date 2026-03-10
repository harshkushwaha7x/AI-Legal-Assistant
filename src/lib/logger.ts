/**
 * Structured logger utility
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_COLORS: Record<LogLevel, string> = {
    debug: '\x1b[36m',
    info: '\x1b[32m',
    warn: '\x1b[33m',
    error: '\x1b[31m',
};

const RESET = '\x1b[0m';

function formatMessage(level: LogLevel, module: string, message: string, data?: unknown): string {
    const timestamp = new Date().toISOString();
    const prefix = `${LOG_COLORS[level]}[${level.toUpperCase()}]${RESET} ${timestamp} [${module}]`;

    if (data) {
        return `${prefix} ${message} ${JSON.stringify(data)}`;
    }

    return `${prefix} ${message}`;
}

/**
 * Create a scoped logger for a specific module
 */
export function createLogger(module: string) {
    return {
        debug: (message: string, data?: unknown) => {
            if (process.env.NODE_ENV === 'development') {
                console.log(formatMessage('debug', module, message, data));
            }
        },
        info: (message: string, data?: unknown) => {
            console.log(formatMessage('info', module, message, data));
        },
        warn: (message: string, data?: unknown) => {
            console.warn(formatMessage('warn', module, message, data));
        },
        error: (message: string, data?: unknown) => {
            console.error(formatMessage('error', module, message, data));
        },
    };
}

// Pre-configured loggers
export const apiLogger = createLogger('API');
export const authLogger = createLogger('Auth');
export const dbLogger = createLogger('Database');
export const aiLogger = createLogger('AI');
