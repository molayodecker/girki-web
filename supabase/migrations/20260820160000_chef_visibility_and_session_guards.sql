-- Tighten chef public visibility and prevent self-publishing when unverified.

-- Public chefs must be both active and verified.
drop policy if exists chef_profiles_public_read on public.chef_profiles;
create policy chef_profiles_public_read on public.chef_profiles
  for select to anon, authenticated
  using (
    profile_status = 'active'
    and verification_state = 'verified'
  );

drop policy if exists chef_services_public_read on public.chef_services;
create policy chef_services_public_read on public.chef_services
  for select to anon, authenticated
  using (
    exists (
      select 1
      from public.chef_profiles
      where chef_profiles.id = chef_services.chef_id
        and chef_profiles.profile_status = 'active'
        and chef_profiles.verification_state = 'verified'
        and chef_services.is_active = true
    )
  );

-- Chefs may not flip themselves to public unless verified.
-- profile_status transitions to 'active' are blocked when unverified;
-- service_role can still administer.
create or replace function private.protect_chef_trust_columns()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'UPDATE'
     and coalesce(auth.role(), '') <> 'service_role'
  then
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
  end if;

  return new;
end;
$$;
