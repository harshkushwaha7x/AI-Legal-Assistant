import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
        prefetch: jest.fn(),
    }),
    useSearchParams: () => new URLSearchParams(),
    usePathname: () => '/',
}));

// Mock next-auth
jest.mock('next-auth', () => ({
    getServerSession: jest.fn(() =>
        Promise.resolve({
            user: { id: 'test-user', email: 'test@example.com', name: 'Test User' },
        })
    ),
}));

// Suppress console errors in tests
const originalError = console.error;
beforeAll(() => {
    console.error = (...args: unknown[]) => {
        if (
            typeof args[0] === 'string' &&
            args[0].includes('Warning: ReactDOM.render is no longer supported')
        ) {
            return;
        }
        originalError.call(console, ...args);
    };
});
afterAll(() => {
    console.error = originalError;
});
