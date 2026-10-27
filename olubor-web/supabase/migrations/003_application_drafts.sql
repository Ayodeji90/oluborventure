-- Applicant-owned, resumable application drafts. Existing application rows are untouched.

create table if not exists public.application_drafts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  program_type text not null check (
    program_type in ('masters_of_research', 'bachelors', 'phd', 'flight_booking')
  ),
  form_data jsonb not null default '{}'::jsonb,
  same_as_phone boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, program_type)
);

create index if not exists application_drafts_user_updated_idx
  on public.application_drafts(user_id, updated_at desc);

create table if not exists public.application_draft_documents (
  id uuid primary key default gen_random_uuid(),
  draft_id uuid not null references public.application_drafts(id) on delete cascade,
  document_type text not null,
  file_path text not null unique,
  file_name text not null,
  mime_type text,
  size_bytes integer not null check (size_bytes > 0 and size_bytes <= 10485760),
  uploaded_at timestamptz not null default now()
);

create index if not exists application_draft_documents_draft_idx
  on public.application_draft_documents(draft_id, uploaded_at);

alter table public.application_drafts enable row level security;
alter table public.application_draft_documents enable row level security;

drop policy if exists "Applicants can read their own application drafts" on public.application_drafts;
create policy "Applicants can read their own application drafts"
  on public.application_drafts for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Applicants can read documents in their own application drafts" on public.application_draft_documents;
create policy "Applicants can read documents in their own application drafts"
  on public.application_draft_documents for select to authenticated
  using (exists (
    select 1 from public.application_drafts d
    where d.id = draft_id and d.user_id = auth.uid()
  ));
