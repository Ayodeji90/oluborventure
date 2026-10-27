# Supabase setup and operations

Supabase is the backend for this website. It provides applicant authentication, Postgres, row-level security (RLS), and private document storage. Server routes use the service-role key for operations that require elevated access; browser code must never receive that key.

## Environment

Copy `.env.example` to `.env.local` and set:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL used by browser and server clients. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public client key; database access is still controlled by RLS. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only key used by trusted API routes. Never use a `NEXT_PUBLIC_` prefix or commit its value. |
| `RESEND_API_KEY` | Optional email delivery for contact notifications. |
| `CONTACT_NOTIFY_EMAIL` | Destination for contact notifications. |

The Supabase project ref in `NEXT_PUBLIC_SUPABASE_URL` must match the project linked by the CLI. Keep `.env.local` private; it is ignored by Git.

## Runtime responsibilities

- Supabase Auth handles portal sign-up, sign-in, and sessions.
- New Auth users receive a `profiles` row through the `handle_new_user` database trigger. `profiles.is_admin` controls staff access.
- Applicants are associated with `applications.user_id`. RLS allows an authenticated applicant to read only their own application, references, and document metadata.
- Application creation, document upload, contact-message writes, and admin changes go through server routes. Those routes validate requests and use the server-only service-role client where elevated access is required.
- The `application-documents` Storage bucket is private and has a 10 MiB per-file limit. The application serves documents through authenticated server routes.
- Contact messages have no public table insert policy. The website sends them through its server route.

### Email confirmation code

The applicant sign-up flow keeps email confirmation enabled and asks the user to enter the emailed code before continuing. The hosted project sends Auth mail through Resend SMTP using the existing `RESEND_API_KEY` secret, with `noreply@oluborconsults.com` as the sender. The confirmation template in `supabase/templates/confirmation.html` uses `{{ .Token }}` to send an OTP, and the hosted project's Auth email limit is set to 30 messages per hour. The corresponding settings are declared in `supabase/config.toml`; use `supabase config diff` to review them and `supabase config push` to apply changes. Never put the SMTP password directly in the config file or commit an `.env` file.

The hosted project was configured with custom Resend SMTP, and its Auth email cap is 30 messages per hour. Without custom SMTP, Supabase's built-in Auth sender is limited to 2 emails per hour across the project. The `[auth.rate_limit]` values in `supabase/config.toml` apply to local development; use `supabase config diff` and `supabase config push` for hosted configuration changes. Do not disable confirmation just to bypass the email cap; doing so marks unverified addresses as confirmed.

Applications that existed before ownership was added have `user_id = NULL`. The migration preserves them; they remain visible to staff and are not shown in an applicant's portal until explicitly associated with an account.

## Applicant drafts

Authenticated applicants can save one draft per programme from the application form and resume it from the portal dashboard. Draft fields are stored in `application_drafts`; uploaded files remain in the private `application-documents` bucket and are linked through `application_draft_documents`. The submission route transfers draft file metadata to the submitted application and removes the draft row. Drafts and their documents are owner-scoped by RLS, and all mutations pass through authenticated server routes.

## Database migrations

Migration files are in `supabase/migrations/`:

| File | Purpose |
| --- | --- |
| `001_initial.sql` | Base applications, references, document metadata, profiles, auth trigger, and initial RLS. |
| `002_security_and_contact_messages.sql` | Applicant ownership, owner-read policies, contact-message schema/security, and private document-bucket settings. |
| `003_application_drafts.sql` | Adds applicant-owned resumable drafts and metadata for private draft uploads. |

Install or run the Supabase CLI from the project root. For the current deployment, authenticate and link to the intended project:

```bash
npx --yes supabase@latest login
npx --yes supabase@latest link --project-ref <project-ref>
```

Review migration state before applying changes:

```bash
npx --yes supabase@latest migration list --linked
npx --yes supabase@latest db push --linked --dry-run
```

If the dry run lists only the intended migrations, apply them with:

```bash
npx --yes supabase@latest db push --linked
```

The deployed project already has migration `001` recorded as its baseline and `002` applied. For another existing project, compare its schema and migration history before pushing; an existing schema with an empty migration history may need a verified baseline recorded before pending migrations are pushed.

Do not run `supabase db reset --linked` against a project with data. It drops and rebuilds the remote database. Use `db push --dry-run` to preview normal deployment changes.

If the CLI reports a Postgres password error, its platform login may still be valid. `SUPABASE_DB_PASSWORD` must contain the database password for the linked project. Enter it interactively rather than putting it in shell history or sharing it in chat.
