# Applications database — design & build notes (Appwrite)

**Decisions:** Appwrite backend · account + applicant portal · general program schema
(launch Masters of Research).

---

## 0. Where this stands

| Phase | State |
| --- | --- |
| 1. Schema | ✅ written — `scripts/appwrite-schema.mjs` + `scripts/provision-appwrite.mjs` (run once credentials exist) |
| 2. Auth + portal shell | ✅ built — sign-up, sign-in, guarded `/portal`, dashboard, draft creation |
| 3. MRes wizard | ⏳ next |
| 4. Submit + staff notification | ⏳ |
| 5. Admin review | ⏳ |

Not yet exercised against a live Appwrite project — see §8 to turn it on.

---

## 1. Appwrite 2.5 vocabulary

Appwrite renamed the old model. Everything below uses the **current** names, which
is also what the SDKs expose:

| Old (deprecated) | Current |
| --- | --- |
| collection | **table** |
| document | **row** |
| attribute | **column** |
| `Databases` service | **`TablesDB`** service |

Consequences that shaped this schema:

- `xdefault` (note the `x` — `default` is reserved) **cannot be set when a column is
  required**. Anything with a default is declared optional; the default fills the gap.
- `encrypt: true` is only settable at creation, and encrypted columns can never be
  indexed or queried. Fine for passport numbers and scratch-card PINs.
- Appwrite stamps every row with `$createdAt` / `$updatedAt`, so there are **no
  hand-written timestamp columns**.
- Columns are built asynchronously (`processing` → `available`). The provisioning
  script waits for `available` before creating indexes.

---

## 2. Shape

```
Auth user ─1:1─ profiles
      └─1:N─ applications ──1:N── documents    (every upload, typed)
                   ├─1:N── references           (the two referees)
                   ├─1:N── refusals             (visa-refusal history)
                   └─1:N── events               (status / audit trail)

document_types  → checklist config the form renders from
bucket: application-documents (private, file security on, encrypted)
```

Child rows reach their parent through an Appwrite **relationship column**
(`application_id`, many-to-one, two-way, `onDelete: cascade`), so deleting an
application takes its documents, references, refusals and events with it.

---

## 3. Tables and columns

Authoritative source: `scripts/appwrite-schema.mjs`. Summarised here.

### `profiles` — 1:1 with the auth user

`user_id` (unique), `full_name`, `email`, `phone`, `whatsapp`, `dob`, `nationality`,
`country_of_residence`, `address`.

### `applications` — the root row

| Group | Columns |
| --- | --- |
| Identity | `user_id`, `reference_code` (unique), `program_type`, `status`, `completion_pct` |
| Target programme | `target_university`, `target_course`, `target_intake`, **`course_start_date`** |
| Req 1 — passport | `passport_number` *(encrypted)*, `passport_issue_country`, `passport_expiry` |
| Req 3 — WAEC/NECO | `exam_body`, `exam_year`, `exam_number`, `english_grade` |
| Req 4 — scratch card | `card_body`, `card_serial`, `card_pin` *(encrypted)*, `scratch_verified_at` |
| Reqs 5,7,8,9 | `cv_no_gaps_confirmed`, `sop_text`, `research_proposal_text`, `visa_refusal_history` |
| Consent | `consent_data`, `consent_declaration` |
| Workflow | `assigned_counselor_id`, `submitted_at` |

`program_type` = `masters_of_research \| masters \| bachelors \| phd \| other`.
`status` = `draft → submitted → in_review → awaiting_documents → interview → offer →
accepted → visa → enrolled`, plus `rejected` / `withdrawn`.

### `documents` — every upload (reqs 1, 2, 3, 5, 6, 7, 8, 9)

`application_id` (relationship), `user_id`, `type`, `label`, `file_id`, `bucket_id`,
`file_name`, `mime_type`, `size_bytes`, `verified`, `verified_by`, `verified_at`,
`reviewer_note`, `uploaded_at`.

`type` ∈ `passport, degree_certificate, transcript, waec_certificate,
neco_certificate, cv, sop, research_proposal, reference_letter, visa_refusal_letter,
other`. Multiple rows per type are allowed, so two transcripts is not a problem.

### `references` — req 6

`application_id`, `user_id`, `slot` (1–2), `kind` (`academic`/`professional`),
`full_name`, `title`, `organisation`, `email`, `phone`, `relationship`,
`letter_file_id`, `status`, `received_at`.

### `refusals` — req 8

`application_id`, `user_id`, `country`, `visa_type`, `refused_on`, `reason`,
`document_file_id`.

### `events` — audit trail

`application_id`, `user_id`, `actor_type`, `actor_id`, `type`, `from_status`,
`to_status`, `note`.

### `document_types` — checklist config

`key`, `label`, `is_required`, `is_multiple`, `max_size_mb`, `accepted_formats`,
`help_text`, `applies_to`, `order_index`. Seeded with the ten checklist entries,
including the "printouts are not accepted" guidance for WAEC/NECO.

---

## 4. Indexes

| Table | Index | Type |
| --- | --- | --- |
| `profiles` | `user_id` | unique |
| `applications` | `reference_code` | unique |
| `applications` | `user_id`, `status` | key |
| `documents` | `user_id`, `type` | key |
| `references` | `user_id`, `slot` | key |
| `refusals` | `user_id` | key |
| `events` | `type` | key |
| `document_types` | `key` | unique |

---

## 5. Permissions

Tables are created with **row security on** and **no table-level permissions**, so
access is decided per row:

| Table | Row permissions on create |
| --- | --- |
| `profiles` | owner read + update |
| `applications` | **owner read only** |
| `documents` / `references` / `refusals` / `events` | owner read |
| `document_types` | read by `any` (no row security) |

Applicants are deliberately **read-only** on their own applications. Every write goes
through a route handler holding the API key, which is where validation lives — a
client cannot PATCH its way past a rule. Staff tooling uses the API key, so the
`counselors` team is optional rather than required.

---

## 6. Storage

Bucket **`application-documents`**: file security on, encryption on, antivirus on, 10 MB
per file, extensions `pdf, jpg, jpeg, png, doc, docx`. No bucket permissions — uploads
go through the server, which attaches per-file reads for the owner. Never public.

---

## 7. Auth, and how the portal talks to the server

Two sharp edges discovered while building this:

**a) There is no client-side sign-up any more.** The web `Account` service has no
`create` method in Appwrite 2.5. Accounts must be created server-side:

1. Browser → `POST /api/auth/register`
2. Server → `Users.create(...)` with the API key, then inserts the `profiles` row
   (rolling the auth user back if that second step fails)
3. Browser → `account.createEmailPasswordSession(...)` to sign in

**b) The session is not a cookie.** The web SDK keeps it in browser storage, so the
server cannot read it and `proxy.ts` cannot authorise anything. Instead:

- Portal routes are guarded **client-side** (`RequireAuth`) — Appwrite's own guidance
  for web-SDK apps.
- Server routes are authenticated with a **JWT**: the browser calls
  `account.createJWT({ duration: 900 })` and sends `Authorization: Bearer <jwt>`; the
  route swaps it for a user id via a JWT-scoped client (`getUserIdFromRequest`).

### Routes

| Route | What it does |
| --- | --- |
| `/portal/sign-up` | creates the account, then signs in |
| `/portal/sign-in` | `createEmailPasswordSession` |
| `/portal` | dashboard: applications, status, completion %, resume |
| `/portal/applications/[id]` | placeholder — the wizard lands here in phase 3 |
| `POST /api/auth/register` | `Users.create` + `profiles` row |
| `POST /api/applications` | creates a draft, allocates the reference code |

Reference codes look like `MRE-2026-7K2Q` (`MRE`/`MSC`/`BSC`/`PHD`/`APP` by
programme, then year, then four characters from an ambiguity-free alphabet).
`reference_code` is unique-indexed and creation retries on collision.

If the env vars are missing the portal renders a setup notice instead of failing,
so the site is safe to deploy before the backend exists.

---

## 8. Turning it on

```bash
cp .env.example .env.local     # fill in endpoint, project id, API key
npm run provision              # creates database, tables, columns, indexes, bucket
npm run dev
```

Then in the Appwrite console: Settings → Platforms → add a **Web** platform for
`localhost` and your production domain, or browser requests will be rejected by CORS.

The provisioning script is **idempotent** — re-run it freely after changing the schema.

---

## 9. Validation rules

| Rule | Where |
| --- | --- |
| Passport expiry ≥ `course_start_date` + 7 months | `passportValidFrom()` in `lib/appwrite/types.ts`, surfaced in the form |
| English grade ≥ C6 (A1–C6 pass, D7/E8/F9 fail) | `englishGradePasses()` |
| Degree certificate & transcript required | required-field + declaration |
| WAEC/NECO *certificate*, not printout/statement | declaration + reviewer `verified` flag |
| CV: no engagement gap > 6 months | declaration (`cv_no_gaps_confirmed`) — cannot be auto-checked |
| Two references before submit | required-field |
| Refusal history answered (yes → ≥1 `refusals` row) | conditional required |

Only the first two can genuinely be verified automatically; the rest are deliberate
declarations plus reviewer sign-off, not fake validation.

---

## 10. Sensitive data

`passport_number` and `card_pin` are encrypted columns, never indexed, never returned
in list views unless explicitly selected. `consent_data` / `consent_declaration`
capture NDPR/GDPR processing consent and a truthfulness declaration.
