# LegalAI — AI-Powered Legal Assistant

A production-ready AI Legal Assistant SaaS platform with B2C and B2B features, built with Next.js 15, TailwindCSS, PostgreSQL, and OpenAI.

## Features

### B2C
- **Document Generation** — Create NDAs, leases, contracts, and more with AI-powered templates
- **Contract Review** — Upload contracts for AI analysis with risk scoring and clause breakdown
- **Legal AI Chat** — Ask legal questions in plain English with context-aware responses
- **Legal Research** — AI-powered search across statutes, case law, and regulations
- **Lawyer Escalation** — Submit complex cases with priority tracking and status workflow
- **Document Templates** — 8 pre-built templates (NDAs, employment, leases, partnerships)

### B2B
- **Document Automation** — Enterprise-grade templates for law firms
- **Client Intake** — Automated intake workflows
- **Contract Acceleration** — Bulk review and analysis
- **Knowledge Base** — Built-in legal knowledge across 6 practice areas

## Tech Stack

| Layer       | Technology                      |
|-------------|--------------------------------|
| Frontend    | Next.js 15, React 19, TailwindCSS v4 |
| Backend     | Next.js API Routes             |
| Database    | PostgreSQL + Prisma ORM        |
| AI          | OpenAI GPT-4o-mini + Fallback engines |
| Auth        | NextAuth.js (Google, GitHub)   |
| Deployment  | Vercel                         |

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- OpenAI API key (optional — fallback engines work without it)

### Installation

```bash
# Clone the repository
git clone https://github.com/harshkushwaha7x/AI-Legal-Assistant.git
cd AI-Legal-Assistant

# Install dependencies
npm install

# Set up environment variables
copy .env.example .env.local
# Edit .env.local with your credentials

# Set up database
npx prisma generate
npx prisma db push

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── dashboard/
│   │   ├── page.tsx                # Dashboard overview with live stats
│   │   ├── documents/              # Document management (list, create, view)
│   │   ├── reviews/                # Contract review (list, upload, detail)
│   │   ├── chat/                   # AI legal chat with session management
│   │   ├── research/               # AI-powered legal research
│   │   ├── escalations/            # Lawyer escalation (list, create, detail)
│   │   ├── templates/              # Document template gallery
│   │   ├── settings/               # User settings (profile, notifications)
│   │   └── support/                # Help center with FAQ
│   └── api/
│       ├── documents/              # Document CRUD endpoints
│       ├── reviews/                # Contract review endpoints
│       ├── chat/                   # Chat sessions & messages
│       ├── research/               # Legal research search
│       ├── escalations/            # Escalation CRUD endpoints
│       ├── webhooks/               # Inbound webhook handler
│       └── dashboard/stats/        # Dashboard statistics
├── components/
│   ├── layout/                     # Navbar, Footer, Sidebar
│   ├── dashboard/                  # Dashboard panels & views
│   │   ├── DocumentComparison      # Side-by-side diff viewer
│   │   ├── WorkflowTracker         # Step timeline with progress
│   │   ├── ComplianceChecklistPanel # Weighted score & categories
│   │   ├── RolePermissionsView     # RBAC permission badges
│   │   └── ExportDialog            # CSV/JSON export with preview
│   ├── ui/                         # Reusable UI components
│   │   ├── ChatWidget              # Floating AI chat widget
│   │   ├── FileUploadZone          # Drag-and-drop upload
│   │   ├── SearchQueryResults      # Search results display
│   │   ├── CodeBlock               # Syntax-highlighted code
│   │   ├── TagInput                # Tag chips with autocomplete
│   │   ├── StarRating              # Interactive star rating
│   │   ├── ColumnCustomizer        # Column show/hide/reorder
│   │   ├── NotificationToast       # Toast notification stack
│   │   ├── ViewToolbar             # Grid/list toggle & sort
│   │   └── ...                     # 30+ additional components
│   ├── chat/                       # Chat UI (bubbles, input, sidebar)
│   ├── escalation/                 # Status tracker, priority badge
│   └── research/                   # Search bar, result cards, filters
├── hooks/                          # Custom React hooks
│   ├── useAutoSave                 # Debounced auto-save
│   ├── useSearch                   # Reactive search with debounce
│   └── ...                         # 13 total hooks
├── lib/                            # Core utilities (48 modules)
│   ├── ai/                         # AI engines (docs, contracts, chat, research)
│   ├── validations/                # Zod schemas
│   ├── __tests__/                  # Unit & integration tests (38 files)
│   ├── auth.ts                     # NextAuth configuration
│   ├── permissions.ts              # RBAC (5 roles, 18 permissions)
│   ├── redaction.ts                # PII detection & redaction
│   ├── compliance-checklist.ts     # Type-specific compliance checks
│   ├── audit-trail.ts              # Action tracking & queries
│   ├── template-engine.ts          # Variable rendering & NDA template
│   ├── workflow-engine.ts          # Multi-step workflow state machine
│   ├── search-index.ts             # Client-side full-text search
│   ├── webhook.ts                  # HMAC-SHA256 signing & verification
│   ├── data-export.ts              # CSV/JSON generation & blob URLs
│   ├── retry.ts                    # Exponential backoff with jitter
│   ├── document-diff.ts            # LCS-based document comparison
│   ├── document-version.ts         # Version tracking & formatting
│   ├── rate-limit.ts               # Token bucket rate limiter
│   ├── clause-library.ts           # Contract clause database
│   ├── notification-builder.ts     # Typed notification payloads
│   ├── jurisdictions.ts            # US state legal database
│   ├── document-analytics.ts       # Word count, readability, stats
│   └── ...                         # 28 additional utility modules
└── types/                          # TypeScript definitions
```

## Development Roadmap

- [x] **Phase 1** — Foundation (Auth, DB, Landing Page)
- [x] **Phase 2** — Core Features (Doc Gen, AI Chat, Contract Review)
- [x] **Phase 3** — Advanced (Legal Research, Escalations, Templates)
- [x] **Phase 4** — SaaS (Dashboard, RBAC, Export, Compliance, Audit)
- [ ] **Phase 5** — Production (Deploy, Optimize, Secure)

## License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE).

---

## Contact

**Harsh Kushwaha** — Developer & Maintainer 
- Portfolio: [https://portfolio-harsh7x.vercel.app/](https://portfolio-harsh7x.vercel.app/) 
- GitHub: [https://github.com/harshkushwaha7x](https://github.com/harshkushwaha7x)  
- LinkedIn: [https://linkedin.com/in/harshkushwaha7x](https://www.linkedin.com/in/harsh-kushwaha-7x/)  
- Email: harshkushwaha4151@gmail.com  

---

<div align="center">
Made by Harsh Kushwaha
</div>

