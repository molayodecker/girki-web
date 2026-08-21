-- Chef Sumsub KYC fields + allow server-side verification updates.

alter table public.chef_profiles
  add column if not exists sumsub_applicant_id text,
  add column if not exists sumsub_review_answer text,
  add column if not exists sumsub_reject_labels text[] not null default '{}',
  add column if not exists sumsub_reviewed_at timestamptz;

create unique index if not exists chef_profiles_sumsub_applicant_id_uidx
  on public.chef_profiles (sumsub_applicant_id)
  where sumsub_applicant_id is not null;

-- Allow rejected outcomes from Sumsub.
alter table public.chef_profiles
  drop constraint if exists chef_profiles_verification_state_check;

alter table public.chef_profiles
  add constraint chef_profiles_verification_state_check
  check (verification_state in ('unverified', 'pending', 'verified', 'rejected'));

-- Only block privileged column changes when the caller has a client JWT.
-- Direct server connections (no JWT) and service_role may update trust fields.
create or replace function private.protect_chef_trust_columns()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  jwt_role text := coalesce(auth.jwt() ->> 'role', '');
begin
  if tg_op = 'UPDATE' and jwt_role in ('authenticated', 'anon') then
    if new.verification_state is distinct from old.verification_state
       or new.rating is distinct from old.rating
       or new.completed_bookings is distinct from old.completed_bookings
    then
      raise exception 'verification_state, rating, and completed_bookings are server-managed';
    end if;

    if new.profile_status is distinct from old.profile_status
       and new.profile_status = 'active'
       and new.verification_state is distinct from 'verified'
    then
      raise exception 'Only verified chefs can set profile_status to active';
    end if;

    if new.sumsub_applicant_id is distinct from old.sumsub_applicant_id
       or new.sumsub_review_answer is distinct from old.sumsub_review_answer
       or new.sumsub_reject_labels is distinct from old.sumsub_reject_labels
       or new.sumsub_reviewed_at is distinct from old.sumsub_reviewed_at
    then
      raise exception 'Sumsub verification fields are server-managed';
    end if;
  end if;

  return new;
end;
$$;

create or replace function private.apply_chef_sumsub_review(
  p_external_user_id uuid,
  p_applicant_id text,
  p_review_answer text,
  p_reject_type text default null,
  p_reject_labels text[] default '{}'
)
returns public.chef_profiles
language plpgsql
security definer
set search_path = ''
as $$
declare
  result public.chef_profiles;
  next_state text;
begin
  if p_review_answer = 'GREEN' then
    next_state := 'verified';
  elsif p_review_answer = 'RED' then
    next_state := 'rejected';
  else
    next_state := 'pending';
  end if;

  update public.chef_profiles
  set
    sumsub_applicant_id = coalesce(p_applicant_id, sumsub_applicant_id),
    sumsub_review_answer = p_review_answer,
    sumsub_reject_labels = coalesce(p_reject_labels, '{}'),
    sumsub_reviewed_at = now(),
    verification_state = next_state,
    -- Identity verified does not auto-publish; Girki ops still activate.
    profile_status = case
      when next_state = 'verified' then profile_status
      when next_state = 'rejected' and coalesce(p_reject_type, '') = 'FINAL' then 'draft'
      else profile_status
    end,
    is_available = case when next_state = 'verified' then is_available else false end,
    onboarding_status = case
      when next_state = 'verified' then 'submitted'
      else onboarding_status
    end,
    updated_at = now()
  where user_id = p_external_user_id
  returning * into result;

  if result.id is null then
    raise exception 'Chef application not found for Sumsub user %', p_external_user_id;
  end if;

  return result;
end;
$$;

revoke all on function private.apply_chef_sumsub_review(uuid, text, text, text, text[]) from public, anon, authenticated;
grant execute on function private.apply_chef_sumsub_review(uuid, text, text, text, text[]) to service_role;
-- App server uses DATABASE_URL as postgres owner; grant to postgres as well when present.
do $$
begin
  grant execute on function private.apply_chef_sumsub_review(uuid, text, text, text, text[]) to postgres;
exception when undefined_object then
  null;
end $$;
