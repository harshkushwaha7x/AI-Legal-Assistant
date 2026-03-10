# Contributing to LegalAI

Thank you for your interest in contributing to LegalAI! This guide will help you get started.

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/harshkushwaha7x/AI-Legal-Assistant.git
   cd AI-Legal-Assistant
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Fill in DATABASE_URL, NEXTAUTH_SECRET, and NEXTAUTH_URL
   ```

4. **Set up the database**
   ```bash
   npx prisma db push
   npm run db:seed
   ```

5. **Start the dev server**
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── app/              # Next.js App Router pages and API routes
│   ├── api/          # REST API endpoints
│   ├── dashboard/    # Dashboard pages
│   └── (marketing)/  # Public marketing pages
├── components/
│   ├── ui/           # Reusable UI components
│   ├── dashboard/    # Dashboard-specific components
│   ├── layout/       # Layout components
│   └── providers/    # Context providers
├── hooks/            # Custom React hooks
├── lib/              # Utility libraries
└── types/            # TypeScript type definitions
```

## Development Guidelines

### Code Style
- Use TypeScript for all new files
- Follow existing conventions for naming and structure
- Use `'use client'` directive for client components
- Keep components focused and composable

### Commit Messages
Follow conventional commits:
- `feat(scope): description` — New features
- `fix(scope): description` — Bug fixes
- `docs: description` — Documentation
- `chore: description` — Maintenance
- `refactor(scope): description` — Refactoring

### Adding Components
1. Create in `src/components/ui/` for reusable components
2. Export from `src/components/ui/index.ts`
3. Use the dark theme design system (surface-*, primary-*, glass-card)

### Adding API Routes
1. Create in `src/app/api/[route]/route.ts`
2. Use `withAuth` from `src/lib/api-middleware.ts` for protected routes
3. Use Zod for request validation

### Adding Hooks
1. Create in `src/hooks/`
2. Export from `src/hooks/index.ts`
3. Prefix with `use` (React convention)

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Run migrations |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:seed` | Seed legal knowledge data |

## Reporting Issues

Please include:
- Steps to reproduce
- Expected vs actual behavior
- Browser/OS version
- Screenshots if applicable

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
