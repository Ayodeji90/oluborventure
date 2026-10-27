-- Bring the deployed Supabase schema in line with the authenticated portal.
-- Existing application rows remain unowned (user_id NULL) and are staff-only.

alter table public.applications
  add column if not exists user_id uuid references auth.users(id) on delete set null;

create index if not exists applications_user_id_created_at_idx
  on public.applications(user_id, created_at desc);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  service text,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists contact_messages_created_at_idx
  on public.contact_messages(created_at desc);

alter table public.applications enable row level security;
alter table public.application_references enable row level security;
alter table public.application_documents enable row level security;
alter table public.profiles enable row level security;
alter table public.contact_messages enable row level security;

drop policy if exists "Applicants can read their own applications" on public.applications;
create policy "Applicants can read their own applications"
  on public.applications for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Applicants can read their own references" on public.application_references;
create policy "Applicants can read their own references"
  on public.application_references for select to authenticated
  using (exists (
    select 1 from public.applications a
    where a.id = application_id and a.user_id = auth.uid()
  ));

drop policy if exists "Applicants can read their own documents" on public.application_documents;
create policy "Applicants can read their own documents"
  on public.application_documents for select to authenticated
  using (exists (
    select 1 from public.applications a
    where a.id = application_id and a.user_id = auth.uid()
  ));

-- No anon/authenticated table policies are created for contact_messages.
-- Public inserts and staff reads go through authenticated server routes only.
-- Remove the legacy public insert policy if this table predates this migration.
drop policy if exists "Public insert" on public.contact_messages;

insert into storage.buckets (id, name, public, file_size_limit)
values ('application-documents', 'application-documents', false, 10485760)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit;
