# Olubor Ventures & Educational Consult — Website

The official website for **Olubor Ventures and Educational Consult** (formerly Future Builders Educational Institute), a Lagos-based study-abroad and careers consultancy operating since 2016.

**Live:** [oluborconsults.com](https://oluborconsults.com)

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL, Auth, Storage) |
| Email | Resend (transactional from `noreply@oluborconsults.com`) |
| Hosting | Vercel |
| Domain / DNS | Cloudflare |

## Local development

**Requirements:** Node.js 20+ and npm.

```bash
npm ci
cp .env.example .env.local   # then fill in the values below
npm run dev                   # opens http://localhost:3000
```

### Environment variables

| Variable | Where | Purpose |
|----------|-------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | `.env.local` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `.env.local` | Public API key (RLS enforced) |
| `SUPABASE_SERVICE_ROLE_KEY` | `.env.local` | Server-only key — never prefix with `NEXT_PUBLIC_` |
| `RESEND_API_KEY` | `.env.local` | Email delivery for contact form notifications |
| `CONTACT_NOTIFY_EMAIL` | `.env.local` | Inbox for contact notifications (default: `info@oluborconsults.com`) |

Keep `.env.local` out of version control — it is gitignored via `.env*`.

### Available commands

```bash
npm run dev       # Start dev server (Turbopack)
npm run build     # Production build
npm run lint      # ESLint
npx tsc --noEmit  # Type check
```

---

## Project structure

```
olubor-web/
├── app/
│   ├── page.tsx                    # Homepage
│   ├── about/page.tsx              # About us
│   ├── services/page.tsx           # All services grid
│   ├── services/[slug]/page.tsx    # Individual service detail
│   ├── destinations/page.tsx       # Study destinations
│   ├── contact/page.tsx            # Contact form (saves to DB + sends email)
│   ├── faq/page.tsx                # FAQ accordion
│   ├── success-stories/page.tsx    # Testimonials
│   ├── apply/page.tsx              # Programme chooser
│   ├── apply/[program]/page.tsx    # Application form
│   ├── portal/                     # Applicant portal (auth required)
│   │   ├── page.tsx                # Dashboard — my applications
│   │   ├── sign-in/page.tsx        # Login
│   │   ├── sign-up/page.tsx        # Registration + email verification
│   │   └── applications/[id]/      # Application detail
│   ├── admin/                      # Staff dashboard (admin auth required)
│   │   ├── page.tsx                # Applications list
│   │   ├── [id]/page.tsx           # Application detail + status updater
│   │   ├── messages/page.tsx       # Contact message inbox
│   │   └── login/page.tsx          # Admin login
│   ├── api/
│   │   ├── contact/route.ts        # POST — save message + send email (rate limited)
│   │   ├── applications/
│   │   │   ├── submit/route.ts     # POST — submit application (auth required)
│   │   │   ├── [id]/documents/     # POST — upload documents
│   │   │   └── drafts/             # Draft save/resume endpoints
│   │   └── admin/
│   │       ├── auth/route.ts       # POST/DELETE — admin login/logout
│   │       └── applications/[id]/  # PATCH — update application status
│   ├── privacy/page.tsx
│   └── terms/page.tsx
├── components/
│   ├── Navbar.tsx                  # Responsive nav (lg: breakpoint)
│   ├── Footer.tsx                  # Site footer
│   ├── HeroRotator.tsx             # Homepage image carousel
│   ├── WhatsAppButton.tsx          # Floating WhatsApp CTA
│   ├── apply/ApplicationForm.tsx   # Multi-step application form
│   ├── admin/                      # Admin-only components
│   └── portal/                     # Portal components (auth, status)
├── data/
│   ├── destinations.ts             # 6 study destinations
│   ├── services.ts                 # 7 service definitions
│   └── testimonials.ts             # Student testimonials
├── lib/supabase/
│   ├── client.ts                   # Browser client (anon key)
│   ├── server.ts                   # Server client (service role key)
│   ├── admin.ts                    # Admin check helper
│   ├── auth.ts                     # Auth utilities
│   └── types.ts                    # DB types, status labels, programme maps
├── proxy.ts                        # Next.js 16 middleware (admin auth guard)
├── supabase/
│   └── migrations/                 # Versioned SQL migrations
│       ├── 001_initial.sql
│       ├── 002_security_and_contact_messages.sql
│       └── 003_application_drafts.sql
└── docs/
    └── supabase.md                 # Supabase setup and operations guide
```

---

## Pages overview

| Page | Route | Description |
|------|-------|-------------|
| Homepage | `/` | Hero with image rotator, service process cards, destinations, testimonials, CTA |
| About | `/about` | Company story, mission/vision, values, differentiators |
| Services | `/services` | 7-service card grid with descriptions |
| Service detail | `/services/[slug]` | Individual service with checklist and next-service nav |
| Destinations | `/destinations` | 6-country card grid with highlight pills |
| Contact | `/contact` | Form (saves to Supabase + sends Resend email), contact info, hours |
| FAQ | `/faq` | Accordion with 6 common questions |
| Success Stories | `/success-stories` | Student testimonials |
| Apply | `/apply` | Programme chooser → multi-step form |
| Portal | `/portal` | Applicant dashboard, application tracking |
| Admin | `/admin` | Staff dashboard: applications list, detail, messages inbox |

---

## Authentication

### Applicant portal
- Supabase Auth (email + password, email verification required)
- Session managed via `@supabase/ssr` cookies
- RLS policies restrict applicants to their own data

### Admin dashboard
- `proxy.ts` enforces auth at the request boundary — checks valid session + `profiles.is_admin = true`
- Admin routes also check `getAuthenticatedAdmin()` at the handler level (defense in depth)
- Session cookies: `httpOnly: true`, `secure: true`, `sameSite: "lax"`

---

## Services

The company offers 7 services, each with a detail page at `/services/[slug]`:

1. **Study Abroad** — university selection, application strategy, offer negotiation
2. **Scholarships** — scholarship matching, personal statements, application coaching
3. **Visa Assistance** — document review, interview preparation, refusal prevention
4. **International Jobs** — job matching, CV optimisation, work visa guidance
5. **Canada Processing** — study permits, IRCC filing, biometrics prep
6. **French Tutoring** — DELF/TEF prep, private/group classes
7. **Flight Booking** — fare search, booking, reschedule support

---

## Contact form flow

1. User submits form at `/contact`
2. `POST /api/contact` validates input, checks IP-based rate limit (5 per 15 min)
3. Saves to `contact_messages` table in Supabase
4. Fires email notification via Resend to `info@oluborconsults.com`
5. Message appears in admin dashboard at `/admin/messages`

---

## Database

See [docs/supabase.md](docs/supabase.md) for full setup, migrations, and operations.

**Tables:**
- `applications` — submitted applications with programme-specific fields
- `application_references` — referee entries (MRes/PhD)
- `application_documents` — uploaded document metadata
- `application_drafts` — resumable draft applications
- `application_draft_documents` — draft file metadata
- `profiles` — user profiles with `is_admin` flag
- `contact_messages` — contact form submissions
- `contact_rate_limits` — rate limiting buckets

**Storage:** `application-documents` bucket (private, 10MB per file limit, MIME whitelist enforced)

---

## Deployment

The site deploys automatically to **Vercel** on push to `main`.

- **Domain:** `oluborconsults.com` (DNS via Cloudflare, DNS-only records)
- **Email:** Resend domain verified via Cloudflare (Resend Forge auto-configured)
- **Microsoft 365:** Custom email `info@oluborconsults.com` via MX/SPF/autodiscover records

### Vercel environment variables

Set in Vercel dashboard → Project Settings → Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `CONTACT_NOTIFY_EMAIL`

---

## Design system

| Token | Value | Usage |
|-------|-------|-------|
| `bg-purple` | `#011874` | Primary brand — heroes, CTAs, admin sidebar |
| `bg-purple-mid` | `#0122a3` | Secondary blue — buttons, links, badges |
| `text-amber` | `#fcc101` | Accent gold — kickers, icons, highlights |
| `bg-sand` | `#faf8f5` | Warm off-white backgrounds |
| `bg-plum-50` | `#f0f4ff` | Light blue tint for cards and sections |
| `border-plum-100` | `#dce6fe` | Subtle borders on light cards |
| `text-ink` | near-black | Primary text |
| `text-ink-2` | mid-grey | Secondary text |
| `text-ink-3` | light grey | Tertiary text / captions |

Typography: system font stack, `font-statement` for display headings.

---

## Next.js 16 notes

This project uses Next.js 16 which has breaking changes from 15:

- **`proxy.ts`** replaces `middleware.ts` — export function is named `proxy`, not `middleware`
- **`export const instant = false`** replaces `dynamic = "force-dynamic"` on server components that fetch data
- **Async params** — `params` in dynamic routes are `Promise<{ id: string }>`, must be awaited
- **`useSearchParams()`** requires wrapping in `<Suspense>` for prerendering
