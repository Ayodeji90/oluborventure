# Olubor Ventures website

This project is a Next.js website for Olubor Ventures. Supabase provides applicant authentication, the Postgres database, and private document storage. See [the Supabase guide](docs/supabase.md) for environment setup, access rules, and database migrations.

## Local development

Requirements: Node.js 20 or later and npm.

```bash
npm ci
cp .env.example .env.local
# Fill in the Supabase and, if used, Resend values in .env.local.
npm run dev
```

Open <http://localhost:3000>.

Available checks:

```bash
npm run lint
npm run build
```

## Main directories

- `app/` — public pages, applicant portal, admin pages, and API routes.
- `components/` — shared site, application, portal, and admin UI.
- `lib/supabase/` — browser, server, admin, and authorization clients.
- `supabase/migrations/` — versioned database schema and security changes.
- `docs/supabase.md` — Supabase setup and operating guide.
