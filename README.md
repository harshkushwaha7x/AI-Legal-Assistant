# LegalAI — AI-Powered Legal Assistant

A production-ready AI Legal Assistant SaaS platform with B2C and B2B features, built with Next.js 15, TailwindCSS, PostgreSQL, and OpenAI.

## Features

### B2C
- **Document Generation** — Create NDAs, leases, contracts, and more with AI-powered templates
- **Contract Review** — Upload contracts for AI analysis with risk scoring
- **Legal AI Chat** — Ask legal questions in plain English
- **Lawyer Escalation** — Seamlessly connect with human lawyers

### B2B
- **Document Automation** — Enterprise-grade templates for law firms
- **Client Intake** — Automated intake workflows
- **Contract Acceleration** — Bulk review and analysis
- **Legal Research** — AI-powered vector search across legal knowledge

## Tech Stack

| Layer       | Technology                      |
|-------------|--------------------------------|
| Frontend    | Next.js 15, React 19, TailwindCSS v4 |
| Backend     | Next.js API Routes + FastAPI (Python) |
| Database    | PostgreSQL + Prisma ORM        |
| AI          | OpenAI GPT-4                   |
| Vector DB   | Pinecone                       |
| Auth        | NextAuth.js                    |
| Deployment  | Vercel + Docker                |

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- OpenAI API key

### Installation

```bash
# Clone the repository
git clone https://github.com/harshkushwaha7x/AI-Legal-Assistant.git
cd AI-Legal-Assistant

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
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
├── app/                  # Next.js App Router pages
│   ├── layout.tsx        # Root layout with Navbar/Footer
│   ├── page.tsx          # Landing page
│   └── globals.css       # Global styles & theme
├── components/
│   ├── layout/           # Navbar, Footer, Sidebar
│   ├── ui/               # Reusable UI components
│   └── features/         # Feature-specific components
├── lib/                  # Utilities, API clients, constants
├── types/                # TypeScript type definitions
└── styles/               # Additional styles
prisma/
└── schema.prisma         # Database schema
```

## Development Roadmap

- **Phase 1** — Foundation (Auth, DB, Landing Page)
- **Phase 2** — Core Features (Doc Gen, AI Chat, Contract Review)
- **Phase 3** — Advanced (Risk Scoring, Vector Search, Knowledge Base)
- **Phase 4** — SaaS (Dashboard, Billing, Roles)
- **Phase 5** — Production (Deploy, Optimize, Secure)

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
