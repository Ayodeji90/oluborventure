-- Persistent, per-IP contact-form rate limiting shared across app instances.
-- The key stored here is an HMAC, not the source IP address.

create table if not exists public.contact_rate_limits (
  bucket_key text not null,
  window_start timestamptz not null,
  request_count integer not null default 0 check (request_count >= 0),
  primary key (bucket_key, window_start)
);

create index if not exists contact_rate_limits_window_idx
  on public.contact_rate_limits(window_start);

alter table public.contact_rate_limits enable row level security;

create or replace function public.consume_contact_rate_limit(
  p_bucket_key text,
  p_window_start timestamptz
)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_request_count integer;
begin
  insert into public.contact_rate_limits (bucket_key, window_start, request_count)
  values (p_bucket_key, p_window_start, 1)
  on conflict (bucket_key, window_start)
  do update set request_count = public.contact_rate_limits.request_count + 1
  returning request_count into v_request_count;

  delete from public.contact_rate_limits
  where window_start < p_window_start - interval '24 hours';

  return v_request_count;
end;
$$;

revoke all on function public.consume_contact_rate_limit(text, timestamptz)
  from public, anon, authenticated;
grant execute on function public.consume_contact_rate_limit(text, timestamptz)
  to service_role;
