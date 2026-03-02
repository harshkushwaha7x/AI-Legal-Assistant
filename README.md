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
│       └── dashboard/stats/        # Dashboard statistics
├── components/
│   ├── layout/                     # Navbar, Footer, Sidebar
│   ├── dashboard/                  # Dashboard UI components
│   ├── chat/                       # Chat UI (bubbles, input, sidebar)
│   ├── escalation/                 # Status tracker, priority badge
│   └── research/                   # Search bar, result cards, filters
├── lib/
│   ├── ai/                         # AI engines (docs, contracts, chat, research)
│   ├── validations/                # Zod schemas
│   ├── auth.ts                     # NextAuth configuration
│   └── prisma.ts                   # Database client
└── types/                          # TypeScript definitions
```

## Development Roadmap

- ✅ **Phase 1** — Foundation (Auth, DB, Landing Page)
- ✅ **Phase 2** — Core Features (Doc Gen, AI Chat, Contract Review)
- ✅ **Phase 3** — Advanced (Legal Research, Escalations, Templates)
- 🔄 **Phase 4** — SaaS (Dashboard, Billing, Roles)
- ⬜ **Phase 5** — Production (Deploy, Optimize, Secure)

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

