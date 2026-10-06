-- Phone-first auth: profile phone from auth.users, chef onboarding status.

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, phone, display_name, account_role, account_status)
  values (
    new.id,
    new.email,
    nullif(new.phone, ''),
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'display_name',
      ''
    ),
    'customer',
    'active'
  )
  on conflict (id) do update set
    email = coalesce(excluded.email, public.profiles.email),
    phone = coalesce(excluded.phone, public.profiles.phone),
    updated_at = now();
  return new;
end;
$$;

create unique index if not exists profiles_phone_unique_idx
  on public.profiles (phone)
  where phone is not null;

alter table public.chef_profiles
  add column if not exists onboarding_status text not null default 'completed'
    check (
      onboarding_status in (
        'started',
        'profile',
        'services',
        'pricing',
        'verification',
        'submitted',
        'completed'
      )
    );

-- Existing seeded chefs stay completed; new applicants use draft defaults via RPC.
comment on column public.chef_profiles.onboarding_status is
  'Application wizard progress. Independent from verification_state.';

create or replace function public.start_chef_application(
  p_display_name text,
  p_base_city text,
  p_country text default 'Ghana'
)
returns public.chef_profiles
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  result public.chef_profiles;
  base_slug text;
  next_slug text;
  suffix integer := 0;
begin
  if uid is null then
    raise exception 'Unauthorized';
  end if;

  if coalesce(trim(p_display_name), '') = '' then
    raise exception 'Display name is required';
  end if;
  if coalesce(trim(p_base_city), '') = '' then
    raise exception 'City is required';
  end if;

  select * into result
  from public.chef_profiles
  where user_id = uid
  limit 1;

  if result.id is not null then
    return result;
  end if;

  base_slug := lower(regexp_replace(trim(p_display_name), '[^a-zA-Z0-9]+', '-', 'g'));
  base_slug := trim(both '-' from base_slug);
  if base_slug = '' then
    base_slug := 'chef';
  end if;
  next_slug := base_slug;

  while exists (select 1 from public.chef_profiles where slug = next_slug) loop
    suffix := suffix + 1;
    next_slug := base_slug || '-' || suffix::text;
  end loop;

  insert into public.chef_profiles (
    user_id,
    slug,
    display_name,
    base_city,
    country,
    verification_state,
    profile_status,
    is_available,
    onboarding_status,
    rating,
    completed_bookings
  ) values (
    uid,
    next_slug,
    trim(p_display_name),
    trim(p_base_city),
    coalesce(nullif(trim(p_country), ''), 'Ghana'),
    'pending',
    'draft',
    false,
    'started',
    0,
    0
  )
  returning * into result;

  -- Never promote account_role from the client path; stay customer until ops approve.
  update public.profiles
  set updated_at = now()
  where id = uid;

  return result;
end;
$$;

revoke all on function public.start_chef_application(text, text, text) from public, anon;
grant execute on function public.start_chef_application(text, text, text) to authenticated, service_role;

create or replace function public.submit_chef_application()
returns public.chef_profiles
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  result public.chef_profiles;
begin
  if uid is null then
    raise exception 'Unauthorized';
  end if;

  update public.chef_profiles
  set
    onboarding_status = 'submitted',
    verification_state = 'pending',
    profile_status = 'draft',
    is_available = false,
    updated_at = now()
  where user_id = uid
  returning * into result;

  if result.id is null then
    raise exception 'Chef application not found';
  end if;

  return result;
end;
$$;

revoke all on function public.submit_chef_application() from public, anon;
grant execute on function public.submit_chef_application() to authenticated, service_role;
