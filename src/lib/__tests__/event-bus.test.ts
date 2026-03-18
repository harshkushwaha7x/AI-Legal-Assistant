import EventBus, { eventBus, APP_EVENTS } from '@/lib/event-bus';

describe('EventBus', () => {
    let bus: EventBus;

    beforeEach(() => {
        bus = new EventBus();
    });

    describe('on/emit', () => {
        it('subscribes and receives events', () => {
            const handler = jest.fn();
            bus.on('test', handler);
            bus.emit('test', { value: 42 });
            expect(handler).toHaveBeenCalledWith({ value: 42 });
        });

        it('supports multiple handlers', () => {
            const handler1 = jest.fn();
            const handler2 = jest.fn();
            bus.on('test', handler1);
            bus.on('test', handler2);
            bus.emit('test', 'data');
            expect(handler1).toHaveBeenCalledWith('data');
            expect(handler2).toHaveBeenCalledWith('data');
        });

        it('returns unsubscribe function', () => {
            const handler = jest.fn();
            const unsub = bus.on('test', handler);
            unsub();
            bus.emit('test');
            expect(handler).not.toHaveBeenCalled();
        });

        it('does not call handlers for other events', () => {
            const handler = jest.fn();
            bus.on('eventA', handler);
            bus.emit('eventB');
            expect(handler).not.toHaveBeenCalled();
        });
    });

    describe('once', () => {
        it('fires handler only once', () => {
            const handler = jest.fn();
            bus.once('test', handler);
            bus.emit('test', 1);
            bus.emit('test', 2);
            expect(handler).toHaveBeenCalledTimes(1);
            expect(handler).toHaveBeenCalledWith(1);
        });
    });

    describe('clear', () => {
        it('clears handlers for a specific event', () => {
            const handler = jest.fn();
            bus.on('test', handler);
            bus.clear('test');
            bus.emit('test');
            expect(handler).not.toHaveBeenCalled();
        });

        it('clears all handlers', () => {
            const handlerA = jest.fn();
            const handlerB = jest.fn();
            bus.on('a', handlerA);
            bus.on('b', handlerB);
            bus.clear();
            bus.emit('a');
            bus.emit('b');
            expect(handlerA).not.toHaveBeenCalled();
            expect(handlerB).not.toHaveBeenCalled();
        });
    });

    describe('listenerCount', () => {
        it('returns correct count', () => {
            bus.on('test', () => {});
            bus.on('test', () => {});
            expect(bus.listenerCount('test')).toBe(2);
        });

        it('returns 0 for unknown event', () => {
            expect(bus.listenerCount('unknown')).toBe(0);
        });
    });

    describe('APP_EVENTS', () => {
        it('contains expected event constants', () => {
            expect(APP_EVENTS.DOCUMENT_CREATED).toBe('document:created');
            expect(APP_EVENTS.CHAT_MESSAGE_SENT).toBe('chat:message:sent');
            expect(APP_EVENTS.USER_LOGGED_IN).toBe('user:logged_in');
        });
    });

    describe('singleton eventBus', () => {
        it('is an instance of EventBus', () => {
            expect(eventBus).toBeDefined();
        });
    });
});
