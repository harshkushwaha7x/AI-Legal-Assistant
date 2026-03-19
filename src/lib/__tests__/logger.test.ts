import { createLogger } from '@/lib/logger';

describe('Logger', () => {
    let consoleSpy: {
        log: jest.SpyInstance;
        warn: jest.SpyInstance;
        error: jest.SpyInstance;
    };

    beforeEach(() => {
        consoleSpy = {
            log: jest.spyOn(console, 'log').mockImplementation(),
            warn: jest.spyOn(console, 'warn').mockImplementation(),
            error: jest.spyOn(console, 'error').mockImplementation(),
        };
    });

    afterEach(() => {
        consoleSpy.log.mockRestore();
        consoleSpy.warn.mockRestore();
        consoleSpy.error.mockRestore();
    });

    describe('createLogger', () => {
        it('creates a logger with all levels', () => {
            const logger = createLogger('TestModule');
            expect(logger.debug).toBeDefined();
            expect(logger.info).toBeDefined();
            expect(logger.warn).toBeDefined();
            expect(logger.error).toBeDefined();
        });

        it('info calls console.log', () => {
            const logger = createLogger('Test');
            logger.info('test message');
            expect(consoleSpy.log).toHaveBeenCalled();
            const output = consoleSpy.log.mock.calls[0][0];
            expect(output).toContain('[INFO]');
            expect(output).toContain('[Test]');
            expect(output).toContain('test message');
        });

        it('warn calls console.warn', () => {
            const logger = createLogger('Test');
            logger.warn('warning message');
            expect(consoleSpy.warn).toHaveBeenCalled();
            const output = consoleSpy.warn.mock.calls[0][0];
            expect(output).toContain('[WARN]');
        });

        it('error calls console.error', () => {
            const logger = createLogger('Test');
            logger.error('error message');
            expect(consoleSpy.error).toHaveBeenCalled();
            const output = consoleSpy.error.mock.calls[0][0];
            expect(output).toContain('[ERROR]');
        });

        it('includes data in output', () => {
            const logger = createLogger('Test');
            logger.info('message', { key: 'value' });
            const output = consoleSpy.log.mock.calls[0][0];
            expect(output).toContain('key');
            expect(output).toContain('value');
        });

        it('includes timestamp', () => {
            const logger = createLogger('Test');
            logger.info('timed message');
            const output = consoleSpy.log.mock.calls[0][0];
            // ISO timestamp format check
            expect(output).toMatch(/\d{4}-\d{2}-\d{2}T/);
        });
    });
});
