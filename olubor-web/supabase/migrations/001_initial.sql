-- ================================================================
-- Olubor Ventures — initial database schema
-- Run this once in the Supabase SQL Editor for your project.
-- ================================================================

-- ── Applications ────────────────────────────────────────────────
create table if not exists applications (
  id               uuid primary key default gen_random_uuid(),
  reference_code   text unique not null,
  program_type     text not null,  -- masters_of_research | bachelors | phd | flight_booking
  status           text not null default 'submitted',

  -- Contact
  full_name        text not null,
  email            text not null,
  phone            text,
  whatsapp         text,

  -- Academic programmes only
  waec_serial      text,
  waec_pin         text,
  visa_refusal     boolean default false,

  -- Flight booking only
  dob              date,
  passport_number  text,
  passport_expiry  date,
  departure_city   text,
  destination_city text,
  travel_date      date,
  return_date      date,
  trip_type        text,      -- 'one-way' | 'return'
  num_passengers   integer default 1,
  preferred_airline text,

  submitted_at     timestamptz default now(),
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- ── Referees (MRes + PhD, up to 2 per application) ──────────────
create table if not exists application_references (
  id               uuid primary key default gen_random_uuid(),
  application_id   uuid references applications(id) on delete cascade not null,
  slot             integer not null,   -- 1 or 2
  full_name        text not null,
  email            text,
  institution      text
);

-- ── Uploaded document metadata ──────────────────────────────────
create table if not exists application_documents (
  id               uuid primary key default gen_random_uuid(),
  application_id   uuid references applications(id) on delete cascade not null,
  document_type    text not null,
  file_path        text not null,   -- path inside the storage bucket
  file_name        text,
  mime_type        text,
  size_bytes       integer,
  uploaded_at      timestamptz default now()
);

-- ── Admin profiles (linked to Supabase Auth) ────────────────────
create table if not exists profiles (
  id               uuid references auth.users primary key,
  email            text not null,
  is_admin         boolean default false
);

-- ── Trigger: auto-create profile row on new auth user ───────────
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles(id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ── Row Level Security ──────────────────────────────────────────
-- All writes from the public form and all admin reads go through
-- the service_role key server-side, which bypasses RLS entirely.
-- RLS here protects against any direct client-side access.

alter table applications         enable row level security;
alter table application_references enable row level security;
alter table application_documents  enable row level security;
alter table profiles               enable row level security;

-- Profiles: only the owner can read their own row
create policy "Own profile"
  on profiles for select
  using (auth.uid() = id);

-- ── Indexes for the admin list view ─────────────────────────────
create index if not exists applications_created_at_idx on applications(created_at desc);
create index if not exists applications_status_idx     on applications(status);
create index if not exists applications_program_idx    on applications(program_type);
