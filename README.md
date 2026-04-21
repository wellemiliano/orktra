# ORKTRA

ORKTRA is a premium multi-tenant B2B enterprise SaaS built as a modular monolith in one Next.js app.

## Stack

- Next.js 16 (App Router)
- TypeScript strict mode
- Tailwind CSS v4 + shadcn-style UI components
- Prisma ORM + PostgreSQL
- Auth.js / NextAuth (credentials)
- TanStack Query
- React Hook Form + Zod-ready DTO validation
- Recharts
- lucide-react
- Vitest + Playwright

## Product Scope Implemented in This Base

- Multi-company / multi-unit tenant model
- Credentials authentication with protected routes
- Session context + company/unit switcher
- RBAC enforcement on server side
- Cross-cutting audit service
- Canonical tenant-aware API groups under `/api/*`
- Governance + operational modules (CRUD baseline)
- Dashboards (Executive, Financial, Contracts, Stock, Approvals)
- Integrations foundation with Protheus mock connector
- Super Admin area baseline
- No-code light foundations (custom fields, branding, module/status/layout configs)
- AI-ready interfaces (mock providers only)

## Folder Architecture

- `src/app/*` routes and pages
- `src/modules/*` domain/application/ui modular structure
- `src/server/*` auth, tenant, audit, integrations, AI contracts
- `src/components/*` UI + layout + providers
- `src/lib/*` constants, utils, shared types
- `prisma/*` schema + seed

## Prerequisites

- Node.js 20+
- npm (PowerShell note below)
- PostgreSQL (local or cloud)
- Git in PATH

### PowerShell note

If `npm.ps1` is blocked by execution policy, use `npm.cmd` and `npx.cmd`.

## Environment Variables

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Required values:

- `DATABASE_URL`
- `AUTH_SECRET`
- `AUTH_TRUST_HOST`
- `NEXTAUTH_URL`
- `ORKTRA_DEMO_PASSWORD`

## Local Setup

1. Install dependencies

```bash
npm.cmd install
```

2. Generate Prisma client

```bash
npm.cmd run prisma:generate
```

3. Apply schema

```bash
npm.cmd run db:push
```

Or migration flow:

```bash
npm.cmd run prisma:migrate
```

4. Seed demo data

```bash
npm.cmd run prisma:seed
```

5. Run app

```bash
npm.cmd run dev
```

Open `http://localhost:3000`.

## Demo Users

After seed:

- `superadmin@orktra.local`
- `admin.a@orktra.local`
- `financeiro.a@orktra.local`

Password: value of `ORKTRA_DEMO_PASSWORD` (default `123456`).

## Scripts

- `npm.cmd run dev` - local dev server
- `npm.cmd run build` - production build
- `npm.cmd run start` - production server
- `npm.cmd run lint` - eslint
- `npm.cmd run typecheck` - TypeScript checks
- `npm.cmd run test` - unit/integration tests (Vitest)
- `npm.cmd run test:e2e` - Playwright e2e tests
- `npm.cmd run prisma:generate` - Prisma client generation
- `npm.cmd run prisma:migrate` - dev migrations
- `npm.cmd run prisma:seed` - seed script
- `npm.cmd run db:push` - push schema to DB

## Canonical API Groups

- `/api/auth/session-context`
- `/api/companies`
- `/api/units`
- `/api/suppliers`
- `/api/products`
- `/api/warehouses`
- `/api/operational-contracts`
- `/api/patrimonial-contracts`
- `/api/fiscal-documents`
- `/api/stock`
- `/api/measurements`
- `/api/payables`
- `/api/approvals`
- `/api/audit-logs`
- `/api/integrations`
- `/api/custom-fields`
- `/api/branding`
- `/api/module-configurations`
- `/api/status-configurations`
- `/api/form-layouts`
- `/api/dashboard?type=executive|financial|contracts|stock|approvals`

## Protheus Integration Scope (Current Phase)

Implemented now:

- Protheus mock connector
- sync queue structure
- retry/reprocess flow
- integration logs
- monitoring through integrations module

Not implemented by design in this phase:

- real Protheus API
- real Protheus DB access
- ExecAuto
- external ERP dependency

## Deployment (Vercel + Supabase Postgres)

1. Create Supabase Postgres instance
2. Set `DATABASE_URL` in Vercel env vars
3. Set `AUTH_SECRET`, `NEXTAUTH_URL`, `AUTH_TRUST_HOST`
4. Deploy app to Vercel
5. Run `prisma db push` (or migrations) against production DB
6. Seed only when needed

## Testing Coverage in This Baseline

- RBAC permission checks
- Config precedence (tenant over global)
- Approval transition rules
- Payable origin rules
- Stock balance invariants
- Resource validation (Zod)
- E2E smoke for login page branding

## Notes

- This implementation is incremental and architecture-ready for full roadmap evolution.
- Tenant-aware server scoping and audit-first behavior are enforced from the foundation.
