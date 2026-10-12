# Olubor Ventures & Educational Consult — Build Plan

Reference/inspiration: https://travelatal.com (Next.js travel booking platform)

**Goal:** Turn the current single-page static brochure into a full TravelAtal-style platform for educational consulting — multi-page, interactive inquiry/booking UX, user accounts, and lead capture — for study abroad, scholarships, visas, and international jobs.

**Stack decision:** Next.js (App Router) + TypeScript + Tailwind CSS (keep the brand system: purple `#4A1A6B`, gold `#FFD700`/orange gradients, Poppins).

---

## 1. What TravelAtal does (the blueprint)

| TravelAtal feature | Olubor equivalent |
|---|---|
| Flight search widget on hero + live-priced deals | **Eligibility / Quote Check widget**: destination, education level, budget, service type → instant indicative "profile match" + collect lead |
| Deal cards (flights with prices, Book Now) | **Destination cards**: UK, Canada, US, Germany, etc. with cost-of-study estimates, intake dates, CTA |
| Tour packages with prices (Dubai, Maldives…) | **Program packages**: e.g. "UK Master's Bundle", "Full Scholarship Package", "Job Search Package" — priced tiers, some marked "Limited slots" |
| Travel financing page | **Payment plans / installment info** for consultation fees |
| Hotel subdomain | n/a — replace with **Visa Services** page |
| Blog subdomain | **Blog/resources** (visa guides, scholarship deadlines) — big SEO play |
| Login/Signup, account | Simple **applicant accounts**: saved inquiries, application status |
| About: IATA cert, mission/vision, Why Choose Us | About: success stats, testimonials, licensed-counselor credibility |
| FAQ page | FAQ page |
| Contact page + CTA banner before footer | Contact page with form + WhatsApp/booking link |

## 2. Site map / routes

```
/                      Home (hero + eligibility widget, deals, services, testimonials, blog teaser)
/about                 About, mission/vision, why-choose-us, core values, stats
/services              Overview hub  → /services/study-abroad
                                     → /services/scholarships
                                     → /services/visa-assistance
                                     → /services/international-jobs
/destinations          Destination grid (UK, CA, US, DE, AU, ...) → detail pages
/programs              Priced package tiers (like TravelAtal tours) → detail + "Start application"
/eligibility           Standalone full eligibility wizard (widget links here)
/success-stories       Testimonials with photos/countries
/payment-plans         How payments/installments work
/faq                   Accordion FAQ
/blog [+ /blog/[slug]] Guides & articles (MDX or headless CMS)
/contact               Form, WhatsApp, phone, address, consultation booking
Login/Signup           /[login|sign-up]
/dashboard             Saved inquiries, application status (post-login)
Legal: /terms /privacy
```

## 3. Tech architecture

- **Next.js 15 (App Router, TS) + Tailwind** — components mirror TravelAtal's design language (dark hero with photo/wing → use airplane/campus imagery; sticky nav; deep-blue→ purple/gold).
- **Data:** Start with typed local data (`content/destinations.ts`, `programs.ts`, `services.ts`). Swap to DB later without UI changes.
- **Auth:** NextAuth (Credentials + Google).
- **DB (phase 2):** Postgres (Neon/Supabase) via Prisma for Users, Inquiries, Applications.
- **Forms/email:** route handlers + Resend (transactional email for both user confirmation & company lead notification). WhatsApp deep-links for fast leads.
- **Blog:** MDX in repo first; move to CMS if non-devs need to post.
- **Deploy:** Vercel (free tier fine).

## 4. The signature widget: "Study Abroad Eligibility Check"

Adaptation of TravelAtal's flight search. Hero card with steps:

1. **Service**: Study Abroad / Scholarship / Visa / Job Placement
2. **Destination** + **Education level** (WAEC, ND, HND, BSc, MSc...)
3. **Study field** + **Budget tier**
4. **Email/WhatsApp** capture

On submit → show an *indicative* match result ("Good fit for UK Master's route — 3 programs match") and create an inquiry in the DB + email the lead to the team + store to user's dashboard if logged in. Any enquiry data captured is only ever *indicative* — the real judgment stays with a counselor (call booked next).

## 5. Design system (from existing brand)

- Colors: purple `#4A1A6B` primary, `#6B2D8F` light, gold `#FFD700` → orange `#FF8C00` gradient CTA backgrounds.
- Font: **Poppins** (already in use).
- Carry over from current site: logo SVG, `card-hover` lift style, gradient buttons, floating orbs; modernize with TravelAtal-style: sticky glassy nav, dark hero with photo background, rounded-2xl cards, generous spacing, breadcrumb page headers ("Home • About Us" style), CTA banner before footer on every page.

## 6. Phases & milestones

**Phase 0 — Scaffold (this session):**
- Next.js app, Tailwind, design tokens, fonts, shared layout (nav + footer), logo integration.

**Phase 1 — Core marketing pages:** Home (hero + widget UI v1 + services + testimonials + stats), About, Services ×4, Contact (working form + email), FAQ. Acceptance: fully responsive, lighthouse ≥90, contact form delivers email.

**Phase 2 — Platform structure:** Destinations (grid + detail), Programs with pricing tiers, Payment plans page, success stories.

**Phase 3 — Accounts + inquiries:** Auth (sign up/login), eligibility widget persists inquiries to DB, user dashboard showing inquiry status, admin (simple) view for staff to update statuses.

**Phase 4 — Content engine:** Blog with MDX/CMS, FAQ expansion, SEO (metadata, OG images, sitemap), analytics.

**Phase 5 — Polish/Hardening:** QA on mobile, empty/error states, form validation, spam protection (honeypot/rate-limit), accessibility pass.

## 7. Open questions (not blockers for Phase 0/1)

1. Real business data: phone number to replace `+234 XXX XXX XXXX`, address, social links.
2. Do packages/prices have real values, or placeholders for now?
3. Email sending domain (need one for Resend, e.g. `info@oluborventures.com`).
4. Any existing logo asset to reuse? (There's `olubor-logo.svg` + `logo.png` in this dir — likely yes.)
