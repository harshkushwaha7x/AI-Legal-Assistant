# Development Guide

This guide covers the development setup, conventions, and architecture for the AI Legal Assistant project.

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm 9+

## Quick Setup

```bash
# Clone and install
git clone https://github.com/harshkushwaha7x/AI-Legal-Assistant.git
cd AI-Legal-Assistant
npm install

# Environment
cp .env.example .env.local
# Edit .env.local with your database and API credentials

# Database
npx prisma generate
npx prisma db push

# Optional: Seed development data
npx ts-node prisma/seed-dev.ts

# Run
npm run dev
```

## Architecture Overview

### App Router (src/app/)

Next.js 14 App Router with file-based routing. API routes under `src/app/api/`.

### Components (src/components/)

Organized by domain:

- **ui/** -- Reusable primitives (Alert, Badge, Modal, Rating, Timeline, etc.)
- **dashboard/** -- Dashboard-specific widgets (AnalyticsOverview, UsageTracker, LegalGlossary, etc.)
- **chat/** -- AI chat interface components
- **layout/** -- Navbar, Footer, structural components
- **providers/** -- Context providers (Auth, Theme, Toast)

### Hooks (src/hooks/)

Custom React hooks for reusable stateful logic:

- **useForm** -- Form state management with validation
- **useFetch** -- Data fetching with loading/error states and polling
- **useBrowser** -- Online status, scroll position, window size
- **useKeyboard** -- Keyboard shortcuts and media queries
- **useLocalStorage** -- Persistent state in localStorage

### Libraries (src/lib/)

Utility modules:

- **errors.ts** -- Custom error hierarchy (AppError, RateLimitError, etc.)
- **api-response.ts** -- Standardized API response builders
- **validation.ts** -- Form validation rules and validators
- **sanitize.ts** -- Input sanitization and XSS prevention
- **cache.ts** -- In-memory TTL cache with eviction
- **performance.ts** -- Async retry, debounce, memoize utilities
- **legal-glossary.ts** -- 24 legal terms with search and categorization

### Types (src/types/)

Shared TypeScript type definitions for API contracts.

## Testing

```bash
# Run all tests
npm test

# Run specific test file
npx jest src/lib/__tests__/errors.test.ts

# Run with coverage
npm run test:coverage
```

Test files live in `__tests__/` directories adjacent to source code.

## API Endpoints

See [docs/API.md](../docs/API.md) for full documentation.

## Docker

```bash
# Build and run
docker compose up --build

# Run in background
docker compose up -d
```
