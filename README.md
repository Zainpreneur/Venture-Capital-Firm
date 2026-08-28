# Meridian Peak Ventures — Firm Operating Platform

A full-stack business application for running a venture capital firm: deal
flow (CRM), portfolio company tracking, fund/LP capital administration,
contacts, and firm-wide task management — all in one authenticated app.

## Tech stack

| Layer          | Choice                                                              |
| -------------- | -------------------------------------------------------------------- |
| Framework      | [Next.js 14](https://nextjs.org) (App Router, Server Components, Server Actions) |
| Language       | TypeScript                                                          |
| Database / ORM | [Prisma](https://www.prisma.io) + SQLite (swap to Postgres for production) |
| Auth           | [NextAuth.js](https://next-auth.js.org) (credentials provider, JWT sessions) |
| Styling        | Tailwind CSS                                                        |
| Charts         | Recharts                                                            |

Mutations go through Next.js **Server Actions** defined in `src/actions/*`
— there's no separate REST/GraphQL layer to keep in sync; forms post
directly to server-side functions that talk to Prisma and revalidate the
affected pages.

## Features

- **Authentication & roles** — Partner / Associate / Analyst / Admin, backed
  by hashed credentials (bcrypt) and NextAuth JWT sessions. All app routes
  are protected by middleware.
- **Deal pipeline (CRM)** — drag-and-drop Kanban board and a sortable table
  view across Sourcing → Screening → Due Diligence → Term Sheet → Closed.
  Each deal tracks size sought, valuation, source, lead partner, notes,
  tasks, contacts, and documents, and can be **converted directly into a
  portfolio company** on close.
- **Portfolio companies** — investment rounds (amount, pre/post-money,
  ownership, security type), quarterly metric snapshots (ARR, revenue,
  burn, runway) charted over time, MOIC and portfolio value roll-ups.
- **Funds** — LP commitments, capital calls, distributions, DPI, dry powder,
  and every portfolio company a fund has backed.
- **Limited partners** — commitment history and total capital committed per LP.
- **Contacts** — a firm-wide address book of founders, advisors, LPs, and
  co-investors, linkable to deals or portfolio companies.
- **Tasks** — a firm-wide board plus inline task lists on every deal and
  portfolio company.
- **Dashboard** — capital committed/deployed/distributed, pipeline-by-stage
  and capital-by-sector charts, recent activity feed, upcoming tasks.

## Getting started

```bash
npm install
cp .env.example .env      # defaults already work for local SQLite
npm run db:push           # create the SQLite schema
npm run db:seed           # load demo data for Meridian Peak Ventures
npm run dev                # http://localhost:3000
```

### Demo accounts

Seeded by `prisma/seed.ts`, password **`meridian2024`** for all:

| Email                                 | Role              |
| -------------------------------------- | ----------------- |
| avery.kwan@meridianpeak.vc            | Managing Partner  |
| jordan.reyes@meridianpeak.vc          | General Partner   |
| noah.feldman@meridianpeak.vc          | Associate         |
| priya.subramaniam@meridianpeak.vc     | Analyst           |

## Project structure

```
prisma/schema.prisma       Data model (Users, Funds, LPs, Deals, Portfolio
                            Companies, Investments, Notes, Tasks, Documents…)
prisma/seed.ts              Demo data for a fictional firm, "Meridian Peak Ventures"
src/actions/                Server actions (create/update/delete) per domain
src/app/(app)/              Authenticated app shell + all feature pages
src/app/login/              Sign-in page
src/components/             Shared UI, panels (notes/tasks/contacts/docs), charts
src/lib/                    Prisma client, auth config, formatting, enum labels
```

## Notes on the data layer

SQLite has no native enum type, so Prisma's `String` columns are used for
enum-like fields (deal stage, fund status, etc.) with the allowed values
enforced in the TypeScript layer — see `src/lib/enums.ts` for the
authoritative unions and `src/lib/labels.ts` for their display labels and
badge colors. To move to Postgres in production, change the `datasource`
block in `prisma/schema.prisma`, set `DATABASE_URL` accordingly, and you may
reintroduce native Prisma `enum` blocks if you'd like the extra DB-level
constraint.

## Production checklist

- Set a strong `NEXTAUTH_SECRET` and correct `NEXTAUTH_URL`.
- Point `DATABASE_URL` at a managed Postgres instance and run
  `npx prisma migrate deploy`.
- Review role-based access — the current build authenticates users but does
  not yet gate individual actions by `Role`; add checks in `src/actions/*`
  if you need e.g. Analysts to be read-only on fund capital data.
