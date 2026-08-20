-- Security hardening: protect privileged columns, concurrency-safe bookings,
-- request access tokens, and narrow chef mutation paths.

alter table public.chef_requests
  add column if not exists access_token_hash text;

create index if not exists chef_requests_access_token_hash_idx
  on public.chef_requests (access_token_hash)
  where access_token_hash is not null;

create sequence if not exists public.booking_number_seq
  as bigint
  start with 1001
  increment by 1
  owned by none;

create or replace function public.next_booking_number()
returns text
language sql
as $$
  select 'GRK-' || nextval('public.booking_number_seq')::text;
$$;

revoke all on function public.next_booking_number() from public, anon, authenticated;
grant execute on function public.next_booking_number() to service_role;

-- One booking per proposal; one active booking per request.
create unique index if not exists bookings_proposal_id_unique_idx
  on public.bookings (proposal_id)
  where proposal_id is not null;

create unique index if not exists bookings_active_request_unique_idx
  on public.bookings (request_id)
  where request_id is not null
    and booking_status not in ('cancelled', 'refunded');

-- Profiles: authenticated users may not change role/status themselves.
create or replace function private.protect_profile_privileged_columns()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'UPDATE'
     and (
       new.account_role is distinct from old.account_role
       or new.account_status is distinct from old.account_status
     )
     and coalesce(auth.role(), '') <> 'service_role'
  then
    raise exception 'account_role and account_status are server-managed';
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_privileged_columns on public.profiles;
create trigger protect_profile_privileged_columns
  before update on public.profiles
  for each row execute function private.protect_profile_privileged_columns();

-- Chef profiles: trust metrics are server-managed.
create or replace function private.protect_chef_trust_columns()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'UPDATE'
     and (
       new.verification_state is distinct from old.verification_state
       or new.rating is distinct from old.rating
       or new.completed_bookings is distinct from old.completed_bookings
     )
     and coalesce(auth.role(), '') <> 'service_role'
  then
    raise exception 'verification_state, rating, and completed_bookings are server-managed';
  end if;
  return new;
end;
$$;

drop trigger if exists protect_chef_trust_columns on public.chef_profiles;
create trigger protect_chef_trust_columns
  before update on public.chef_profiles
  for each row execute function private.protect_chef_trust_columns();

-- Reviews: chefs may only write chef_response via the dedicated RPC below.
drop policy if exists reviews_chef_response on public.reviews;

create or replace function public.respond_to_review(p_review_id bigint, p_response text)
returns public.reviews
language plpgsql
security definer
set search_path = ''
as $$
declare
  result public.reviews;
begin
  if auth.uid() is null then
    raise exception 'Unauthorized';
  end if;

  update public.reviews r
  set chef_response = p_response
  where r.id = p_review_id
    and r.chef_id in (
      select c.id from public.chef_profiles c where c.user_id = auth.uid()
    )
  returning * into result;

  if result.id is null then
    raise exception 'Review not found or not owned by this chef';
  end if;

  return result;
end;
$$;

revoke all on function public.respond_to_review(bigint, text) from public, anon;
grant execute on function public.respond_to_review(bigint, text) to authenticated, service_role;

-- Bookings: remove broad chef UPDATE; status changes go through RPC.
drop policy if exists bookings_chef_update_status on public.bookings;

create or replace function public.update_own_booking_status(p_booking_id bigint, p_status text)
returns public.bookings
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_row public.bookings;
  result public.bookings;
  allowed boolean := false;
begin
  if auth.uid() is null then
    raise exception 'Unauthorized';
  end if;

  select * into current_row
  from public.bookings b
  where b.id = p_booking_id
    and b.chef_id in (
      select c.id from public.chef_profiles c where c.user_id = auth.uid()
    )
  for update;

  if current_row.id is null then
    raise exception 'Booking not found or not owned by this chef';
  end if;

  if current_row.booking_status = 'confirmed' and p_status = 'in_progress' then
    allowed := true;
  elsif current_row.booking_status = 'in_progress' and p_status = 'completed' then
    allowed := true;
  elsif current_row.booking_status in ('awaiting_payment', 'confirmed', 'in_progress')
        and p_status = 'cancelled' then
    allowed := true;
  end if;

  if not allowed then
    raise exception 'Invalid booking status transition';
  end if;

  update public.bookings
  set booking_status = p_status, updated_at = now()
  where id = p_booking_id
  returning * into result;

  return result;
end;
$$;

revoke all on function public.update_own_booking_status(bigint, text) from public, anon;
grant execute on function public.update_own_booking_status(bigint, text) to authenticated, service_role;

-- Chef contact passwords for portal login (server-only table already private).
alter table private.chef_contacts
  add column if not exists password_hash text;
