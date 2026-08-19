create schema if not exists private;

revoke all on schema private from public;
grant usage on schema public to anon, authenticated, service_role;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

revoke all on function private.handle_new_user() from public, anon, authenticated;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '',
  email text,
  phone text,
  avatar_url text,
  account_role text not null default 'customer'
    check (account_role in ('customer', 'chef', 'admin')),
  account_status text not null default 'active'
    check (account_status in ('active', 'disabled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

create table public.chef_profiles (
  id bigint generated always as identity primary key,
  user_id uuid unique references public.profiles (id) on delete set null,
  slug text not null unique,
  display_name text not null,
  headline text,
  bio text,
  base_city text not null,
  country text not null,
  latitude double precision,
  longitude double precision,
  specialties text,
  image_url text,
  years_experience integer,
  verification_state text not null default 'unverified'
    check (verification_state in ('unverified', 'pending', 'verified')),
  profile_status text not null default 'active'
    check (profile_status in ('draft', 'active', 'paused')),
  is_available boolean not null default true,
  rating numeric(3, 2) not null default 0,
  completed_bookings integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index chef_profiles_city_status_available_idx
  on public.chef_profiles (base_city, profile_status, is_available);
create index chef_profiles_user_id_idx on public.chef_profiles (user_id);

create table public.service_types (
  id bigint generated always as identity primary key,
  slug text not null unique,
  name text not null,
  created_at timestamptz not null default now()
);

create table public.chef_services (
  id bigint generated always as identity primary key,
  chef_id bigint not null references public.chef_profiles (id) on delete cascade,
  service_type_id bigint not null references public.service_types (id),
  title text not null,
  description text,
  pricing_model text not null default 'fixed'
    check (pricing_model in ('fixed', 'per_guest', 'quote')),
  base_price numeric(12, 2),
  price_per_guest numeric(12, 2),
  min_guests integer,
  max_guests integer,
  currency text not null default 'GHS'
    check (currency in ('GHS', 'NGN', 'KES', 'ZAR', 'USD')),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index chef_services_chef_id_idx on public.chef_services (chef_id);
create index chef_services_service_type_id_idx on public.chef_services (service_type_id);

create table public.cuisines (
  id bigint generated always as identity primary key,
  slug text not null unique,
  name text not null
);

create table public.chef_cuisines (
  chef_id bigint not null references public.chef_profiles (id) on delete cascade,
  cuisine_id bigint not null references public.cuisines (id) on delete cascade,
  primary key (chef_id, cuisine_id)
);

create index chef_cuisines_cuisine_id_idx on public.chef_cuisines (cuisine_id);

create table public.chef_availability (
  id bigint generated always as identity primary key,
  chef_id bigint not null references public.chef_profiles (id) on delete cascade,
  available_on date not null,
  is_available boolean not null default true,
  unique (chef_id, available_on)
);

create index chef_availability_chef_id_idx on public.chef_availability (chef_id);

create table public.chef_availability_rules (
  id bigint generated always as identity primary key,
  chef_id bigint not null references public.chef_profiles (id) on delete cascade,
  weekday integer not null check (weekday between 0 and 6),
  start_time time not null,
  end_time time not null,
  is_active boolean not null default true
);

create index chef_availability_rules_chef_id_idx on public.chef_availability_rules (chef_id);

create table public.locations (
  id bigint generated always as identity primary key,
  customer_id uuid references public.profiles (id) on delete set null,
  label text,
  address_line text not null,
  city text,
  country text,
  latitude double precision,
  longitude double precision,
  created_at timestamptz not null default now()
);

create index locations_customer_id_idx on public.locations (customer_id);

create table public.inquiries (
  id bigint generated always as identity primary key,
  chef_id bigint not null references public.chef_profiles (id),
  customer_id uuid references public.profiles (id) on delete set null,
  service_id bigint references public.chef_services (id),
  location_id bigint references public.locations (id),
  customer_name text not null,
  email text not null,
  phone text not null,
  event_date date not null,
  guest_count integer not null check (guest_count > 0),
  occasion text not null,
  location_label text not null,
  budget text,
  message text,
  status text not null default 'new'
    check (status in ('new', 'viewed', 'quoted', 'accepted', 'declined', 'converted')),
  quoted_price numeric(12, 2),
  currency text not null default 'GHS'
    check (currency in ('GHS', 'NGN', 'KES', 'ZAR', 'USD')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index inquiries_chef_status_created_idx
  on public.inquiries (chef_id, status, created_at desc);
create index inquiries_customer_id_idx on public.inquiries (customer_id);
create index inquiries_service_id_idx on public.inquiries (service_id);
create index inquiries_location_id_idx on public.inquiries (location_id);

create table public.chef_requests (
  id bigint generated always as identity primary key,
  customer_id uuid references public.profiles (id) on delete set null,
  location_id bigint references public.locations (id),
  customer_name text not null,
  email text not null,
  phone text,
  city text not null,
  cuisine text,
  occasion text not null,
  service_type text not null,
  guest_summary text not null,
  meal_time text,
  event_date date,
  budget text,
  restrictions text,
  notes text,
  status text not null default 'open'
    check (status in ('open', 'receiving_proposals', 'chef_selected', 'booked', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index chef_requests_status_event_created_idx
  on public.chef_requests (status, event_date, created_at desc);
create index chef_requests_customer_id_idx on public.chef_requests (customer_id);
create index chef_requests_location_id_idx on public.chef_requests (location_id);

create table public.proposals (
  id bigint generated always as identity primary key,
  request_id bigint not null references public.chef_requests (id) on delete cascade,
  chef_id bigint not null references public.chef_profiles (id),
  message text not null,
  proposed_price numeric(12, 2) not null,
  currency text not null default 'GHS'
    check (currency in ('GHS', 'NGN', 'KES', 'ZAR', 'USD')),
  menu_description text,
  included_services text[] not null default '{}',
  status text not null default 'submitted'
    check (status in ('submitted', 'viewed', 'shortlisted', 'accepted', 'declined', 'withdrawn')),
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  unique (request_id, chef_id)
);

create index proposals_chef_id_idx on public.proposals (chef_id);

create table public.bookings (
  id bigint generated always as identity primary key,
  booking_number text not null unique,
  customer_id uuid references public.profiles (id) on delete set null,
  chef_id bigint not null references public.chef_profiles (id),
  inquiry_id bigint references public.inquiries (id),
  request_id bigint references public.chef_requests (id),
  proposal_id bigint references public.proposals (id),
  customer_name text not null,
  email text not null,
  booking_source text not null
    check (booking_source in ('direct', 'inquiry', 'chef_request', 'admin')),
  event_date date not null,
  guest_summary text not null,
  occasion text not null,
  location_label text not null,
  subtotal numeric(12, 2) not null,
  service_fee numeric(12, 2) not null default 0,
  tax numeric(12, 2) not null default 0,
  discount numeric(12, 2) not null default 0,
  total numeric(12, 2) not null,
  chef_payout numeric(12, 2) not null,
  currency text not null default 'GHS'
    check (currency in ('GHS', 'NGN', 'KES', 'ZAR', 'USD')),
  payment_status text not null default 'pending'
    check (payment_status in ('pending', 'paid', 'failed', 'partially_refunded', 'refunded')),
  booking_status text not null default 'awaiting_payment'
    check (booking_status in ('awaiting_payment', 'confirmed', 'in_progress', 'completed', 'cancelled', 'refunded')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index bookings_chef_event_idx on public.bookings (chef_id, event_date);
create index bookings_customer_created_idx on public.bookings (customer_id, created_at desc);
create index bookings_inquiry_id_idx on public.bookings (inquiry_id);
create index bookings_request_id_idx on public.bookings (request_id);
create index bookings_proposal_id_idx on public.bookings (proposal_id);

create table public.booking_menus (
  id bigint generated always as identity primary key,
  booking_id bigint not null references public.bookings (id) on delete cascade,
  title text not null,
  created_at timestamptz not null default now()
);

create index booking_menus_booking_id_idx on public.booking_menus (booking_id);

create table public.booking_menu_items (
  id bigint generated always as identity primary key,
  booking_menu_id bigint not null references public.booking_menus (id) on delete cascade,
  course_title text not null,
  dish_name text not null,
  sort_order integer not null default 0
);

create index booking_menu_items_menu_id_idx on public.booking_menu_items (booking_menu_id);

create table public.conversations (
  id bigint generated always as identity primary key,
  customer_id uuid references public.profiles (id) on delete set null,
  chef_id bigint not null references public.chef_profiles (id),
  inquiry_id bigint references public.inquiries (id),
  request_id bigint references public.chef_requests (id),
  proposal_id bigint references public.proposals (id),
  booking_id bigint references public.bookings (id),
  created_at timestamptz not null default now()
);

create index conversations_chef_id_idx on public.conversations (chef_id);
create index conversations_customer_id_idx on public.conversations (customer_id);
create index conversations_inquiry_id_idx on public.conversations (inquiry_id);
create index conversations_request_id_idx on public.conversations (request_id);
create index conversations_proposal_id_idx on public.conversations (proposal_id);
create index conversations_booking_id_idx on public.conversations (booking_id);

create table public.messages (
  id bigint generated always as identity primary key,
  conversation_id bigint not null references public.conversations (id) on delete cascade,
  sender_id uuid references public.profiles (id) on delete set null,
  message_type text not null default 'text'
    check (message_type in ('text', 'system', 'attachment')),
  body text not null,
  attachment_url text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index messages_conversation_created_idx
  on public.messages (conversation_id, created_at);
create index messages_sender_id_idx on public.messages (sender_id);

create table public.payments (
  id bigint generated always as identity primary key,
  booking_id bigint not null references public.bookings (id),
  provider text not null default 'pending',
  provider_reference text,
  amount numeric(12, 2) not null,
  currency text not null default 'GHS'
    check (currency in ('GHS', 'NGN', 'KES', 'ZAR', 'USD')),
  payment_status text not null default 'pending'
    check (payment_status in ('pending', 'paid', 'failed', 'partially_refunded', 'refunded')),
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create index payments_booking_id_idx on public.payments (booking_id);

create table public.chef_payouts (
  id bigint generated always as identity primary key,
  chef_id bigint not null references public.chef_profiles (id),
  booking_id bigint not null references public.bookings (id),
  gross_amount numeric(12, 2) not null,
  platform_fee numeric(12, 2) not null,
  net_amount numeric(12, 2) not null,
  currency text not null default 'GHS'
    check (currency in ('GHS', 'NGN', 'KES', 'ZAR', 'USD')),
  payout_status text not null default 'pending'
    check (payout_status in ('pending', 'available', 'paid', 'held')),
  available_at timestamptz,
  created_at timestamptz not null default now()
);

create index chef_payouts_chef_status_available_idx
  on public.chef_payouts (chef_id, payout_status, available_at);
create index chef_payouts_booking_id_idx on public.chef_payouts (booking_id);

create table public.reviews (
  id bigint generated always as identity primary key,
  booking_id bigint not null unique references public.bookings (id),
  customer_id uuid references public.profiles (id) on delete set null,
  chef_id bigint not null references public.chef_profiles (id),
  overall integer not null check (overall between 1 and 5),
  food integer check (food between 1 and 5),
  professionalism integer check (professionalism between 1 and 5),
  communication integer check (communication between 1 and 5),
  value integer check (value between 1 and 5),
  review_text text,
  chef_response text,
  created_at timestamptz not null default now()
);

create index reviews_chef_id_idx on public.reviews (chef_id);
create index reviews_customer_id_idx on public.reviews (customer_id);

create table public.favorites (
  customer_id uuid not null references public.profiles (id) on delete cascade,
  chef_id bigint not null references public.chef_profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (customer_id, chef_id)
);

create index favorites_chef_id_idx on public.favorites (chef_id);

alter table public.profiles enable row level security;
alter table public.chef_profiles enable row level security;
alter table public.service_types enable row level security;
alter table public.chef_services enable row level security;
alter table public.cuisines enable row level security;
alter table public.chef_cuisines enable row level security;
alter table public.chef_availability enable row level security;
alter table public.chef_availability_rules enable row level security;
alter table public.locations enable row level security;
alter table public.inquiries enable row level security;
alter table public.chef_requests enable row level security;
alter table public.proposals enable row level security;
alter table public.bookings enable row level security;
alter table public.booking_menus enable row level security;
alter table public.booking_menu_items enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.payments enable row level security;
alter table public.chef_payouts enable row level security;
alter table public.reviews enable row level security;
alter table public.favorites enable row level security;

create policy profiles_select_own on public.profiles
  for select to authenticated
  using ((select auth.uid()) = id);

create policy profiles_update_own on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy chef_profiles_public_read on public.chef_profiles
  for select to anon, authenticated
  using (profile_status = 'active');

create policy chef_profiles_owner_update on public.chef_profiles
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy service_types_public_read on public.service_types
  for select to anon, authenticated
  using (true);

create policy chef_services_public_read on public.chef_services
  for select to anon, authenticated
  using (
    exists (
      select 1
      from public.chef_profiles
      where chef_profiles.id = chef_services.chef_id
        and chef_profiles.profile_status = 'active'
        and chef_services.is_active = true
    )
  );

create policy cuisines_public_read on public.cuisines
  for select to anon, authenticated
  using (true);

create policy chef_cuisines_public_read on public.chef_cuisines
  for select to anon, authenticated
  using (true);

create policy chef_availability_public_read on public.chef_availability
  for select to anon, authenticated
  using (true);

create policy chef_availability_rules_public_read on public.chef_availability_rules
  for select to anon, authenticated
  using (is_active = true);

create policy locations_owner_all on public.locations
  for all to authenticated
  using (customer_id = (select auth.uid()))
  with check (customer_id = (select auth.uid()));

create policy inquiries_customer_select on public.inquiries
  for select to authenticated
  using (
    customer_id = (select auth.uid())
    or chef_id in (
      select id from public.chef_profiles where user_id = (select auth.uid())
    )
  );

create policy inquiries_customer_insert on public.inquiries
  for insert to authenticated
  with check (customer_id = (select auth.uid()));

create policy inquiries_customer_update on public.inquiries
  for update to authenticated
  using (customer_id = (select auth.uid()))
  with check (customer_id = (select auth.uid()));

create policy inquiries_chef_update on public.inquiries
  for update to authenticated
  using (
    chef_id in (
      select id from public.chef_profiles where user_id = (select auth.uid())
    )
  )
  with check (
    chef_id in (
      select id from public.chef_profiles where user_id = (select auth.uid())
    )
  );

create policy chef_requests_customer_select on public.chef_requests
  for select to authenticated
  using (
    customer_id = (select auth.uid())
    or status in ('open', 'receiving_proposals')
  );

create policy chef_requests_customer_insert on public.chef_requests
  for insert to authenticated
  with check (customer_id = (select auth.uid()));

create policy chef_requests_customer_update on public.chef_requests
  for update to authenticated
  using (customer_id = (select auth.uid()))
  with check (customer_id = (select auth.uid()));

create policy proposals_visible on public.proposals
  for select to authenticated
  using (
    chef_id in (select id from public.chef_profiles where user_id = (select auth.uid()))
    or request_id in (
      select id from public.chef_requests where customer_id = (select auth.uid())
    )
  );

create policy proposals_chef_insert on public.proposals
  for insert to authenticated
  with check (
    chef_id in (select id from public.chef_profiles where user_id = (select auth.uid()))
  );

create policy proposals_chef_update on public.proposals
  for update to authenticated
  using (
    chef_id in (select id from public.chef_profiles where user_id = (select auth.uid()))
  )
  with check (
    chef_id in (select id from public.chef_profiles where user_id = (select auth.uid()))
  );

create policy bookings_visible on public.bookings
  for select to authenticated
  using (
    customer_id = (select auth.uid())
    or chef_id in (select id from public.chef_profiles where user_id = (select auth.uid()))
  );

create policy bookings_chef_update_status on public.bookings
  for update to authenticated
  using (
    chef_id in (select id from public.chef_profiles where user_id = (select auth.uid()))
  )
  with check (
    chef_id in (select id from public.chef_profiles where user_id = (select auth.uid()))
  );

create policy booking_menus_visible on public.booking_menus
  for select to authenticated
  using (
    booking_id in (
      select id from public.bookings
      where customer_id = (select auth.uid())
         or chef_id in (select chef_profiles.id from public.chef_profiles where user_id = (select auth.uid()))
    )
  );

create policy booking_menu_items_visible on public.booking_menu_items
  for select to authenticated
  using (
    booking_menu_id in (
      select booking_menus.id
      from public.booking_menus
      join public.bookings on bookings.id = booking_menus.booking_id
      where bookings.customer_id = (select auth.uid())
         or bookings.chef_id in (
           select chef_profiles.id from public.chef_profiles where user_id = (select auth.uid())
         )
    )
  );

create policy conversations_visible on public.conversations
  for select to authenticated
  using (
    customer_id = (select auth.uid())
    or chef_id in (select id from public.chef_profiles where user_id = (select auth.uid()))
  );

create policy conversations_insert on public.conversations
  for insert to authenticated
  with check (
    customer_id = (select auth.uid())
    or chef_id in (select id from public.chef_profiles where user_id = (select auth.uid()))
  );

create policy messages_visible on public.messages
  for select to authenticated
  using (
    conversation_id in (
      select id from public.conversations
      where customer_id = (select auth.uid())
         or chef_id in (select chef_profiles.id from public.chef_profiles where user_id = (select auth.uid()))
    )
  );

create policy messages_insert on public.messages
  for insert to authenticated
  with check (
    sender_id = (select auth.uid())
    and conversation_id in (
      select id from public.conversations
      where customer_id = (select auth.uid())
         or chef_id in (select chef_profiles.id from public.chef_profiles where user_id = (select auth.uid()))
    )
  );

create policy payments_visible on public.payments
  for select to authenticated
  using (
    booking_id in (
      select id from public.bookings
      where customer_id = (select auth.uid())
         or chef_id in (select chef_profiles.id from public.chef_profiles where user_id = (select auth.uid()))
    )
  );

create policy chef_payouts_chef_select on public.chef_payouts
  for select to authenticated
  using (
    chef_id in (select id from public.chef_profiles where user_id = (select auth.uid()))
  );

create policy reviews_public_read on public.reviews
  for select to anon, authenticated
  using (true);

create policy reviews_customer_insert on public.reviews
  for insert to authenticated
  with check (customer_id = (select auth.uid()));

create policy reviews_customer_update on public.reviews
  for update to authenticated
  using (customer_id = (select auth.uid()))
  with check (customer_id = (select auth.uid()));

create policy reviews_chef_response on public.reviews
  for update to authenticated
  using (
    chef_id in (select id from public.chef_profiles where user_id = (select auth.uid()))
  )
  with check (
    chef_id in (select id from public.chef_profiles where user_id = (select auth.uid()))
  );

create policy favorites_owner_all on public.favorites
  for all to authenticated
  using (customer_id = (select auth.uid()))
  with check (customer_id = (select auth.uid()));

grant usage on schema public to anon, authenticated, service_role;

grant select on public.chef_profiles, public.service_types, public.chef_services,
  public.cuisines, public.chef_cuisines, public.chef_availability,
  public.chef_availability_rules, public.reviews
  to anon, authenticated, service_role;

grant select, insert, update on public.profiles, public.locations, public.inquiries,
  public.chef_requests, public.proposals, public.conversations, public.messages,
  public.favorites
  to authenticated, service_role;

grant select, update on public.chef_profiles, public.bookings to authenticated, service_role;
grant select, insert on public.reviews, public.booking_menus, public.booking_menu_items
  to authenticated, service_role;
grant select on public.payments, public.chef_payouts, public.booking_menus,
  public.booking_menu_items
  to authenticated, service_role;

grant select, insert, update, delete on all tables in schema public to service_role;
grant usage, select on all sequences in schema public to authenticated, service_role;

insert into public.service_types (slug, name) values
  ('private-dinner', 'Private Dinner'),
  ('weekly-meal-prep', 'Weekly Meal Prep'),
  ('date-night', 'Date Night'),
  ('parties-celebrations', 'Parties & Celebrations'),
  ('wedding', 'Wedding'),
  ('corporate-event', 'Corporate Event'),
  ('vacation-chef', 'Vacation Chef'),
  ('brunch', 'Brunch'),
  ('cooking-class', 'Cooking Class');

insert into public.cuisines (slug, name) values
  ('ghanaian', 'Ghanaian'),
  ('nigerian', 'Nigerian'),
  ('moroccan', 'Moroccan'),
  ('east-african', 'East African'),
  ('west-african', 'West African'),
  ('continental', 'Continental'),
  ('seafood', 'Seafood'),
  ('vegetarian', 'Vegetarian'),
  ('chefs-special', 'Chef''s special');

insert into public.chef_profiles (
  slug, display_name, headline, bio, base_city, country, latitude, longitude,
  specialties, image_url, rating, completed_bookings, profile_status, is_available, verification_state
) values
  (
    'nana',
    'Chef Nana K.',
    'Ghanaian tasting menus in Accra',
    'Nana builds tasting menus around Ghanaian produce, coastal seafood, and hospitality that makes a home feel like the best table in Accra.',
    'Accra',
    'Ghana',
    5.6037,
    -0.187,
    'Ghanaian · Continental · Fine dining',
    null,
    4.9,
    24,
    'active',
    true,
    'verified'
  ),
  (
    'youssef',
    'Chef Youssef B.',
    'Fire and spice from Casablanca',
    'Youssef cooks with fire and spice from the Maghreb: tagines, charcoal grill, and plating that feels like a Casablanca restaurant brought home.',
    'Casablanca',
    'Morocco',
    33.5731,
    -7.5898,
    'Moroccan · North African · Grill',
    'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1200&q=80',
    4.8,
    18,
    'active',
    true,
    'verified'
  ),
  (
    'amani',
    'Chef Stephanie K.',
    'Coastal and highland Kenyan cooking',
    'Stephanie cooks coastal and highland Kenyan food with a light, seasonal hand, ideal for families, friends, and unhurried Sunday lunches.',
    'Nairobi',
    'Kenya',
    -1.2921,
    36.8219,
    'East African · Coastal · Family meals',
    null,
    4.8,
    21,
    'active',
    true,
    'verified'
  ),
  (
    'zuri',
    'Chef Zuri M.',
    'Cape Malay spice and Atlantic seafood',
    'Zuri brings Cape Malay spice, Atlantic seafood, and wine-country pacing into private homes and villa kitchens.',
    'Cape Town',
    'South Africa',
    -33.9249,
    18.4241,
    'Cape Malay · Seafood · Wine-country dining',
    'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80',
    4.7,
    16,
    'active',
    true,
    'verified'
  ),
  (
    'kofi',
    'Chef Kofi B.',
    'Plant-forward Ghanaian menus',
    'Kofi designs plant-forward Ghanaian menus that still feel abundant, for date nights, birthdays, and thoughtful corporate lunches.',
    'Accra',
    'Ghana',
    5.56,
    -0.2057,
    'Plant-forward · Vegetarian · Celebration menus',
    'https://images.unsplash.com/photo-1600565193348-f74bd3ec5f5c?auto=format&fit=crop&w=1200&q=80',
    4.6,
    12,
    'active',
    true,
    'verified'
  ),
  (
    'ibrahim',
    'Chef Ibrahim S.',
    'Senegalese coastal feasts',
    'Ibrahim cooks the Atlantic with patience: thieboudienne, grilled fish, and celebration tables that linger long after dessert.',
    'Dakar',
    'Senegal',
    14.7167,
    -17.4677,
    'Senegalese · Thieboudienne · Coastal feasts',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80',
    4.9,
    31,
    'active',
    true,
    'verified'
  );

insert into public.chef_cuisines (chef_id, cuisine_id)
select chef_profiles.id, cuisines.id
from public.chef_profiles
join public.cuisines
  on (chef_profiles.slug = 'nana' and cuisines.slug in ('ghanaian', 'continental', 'chefs-special'))
  or (chef_profiles.slug = 'youssef' and cuisines.slug in ('moroccan', 'seafood', 'chefs-special'))
  or (chef_profiles.slug = 'amani' and cuisines.slug in ('east-african', 'seafood', 'vegetarian'))
  or (chef_profiles.slug = 'zuri' and cuisines.slug in ('seafood', 'continental', 'chefs-special'))
  or (chef_profiles.slug = 'kofi' and cuisines.slug in ('vegetarian', 'ghanaian', 'west-african'))
  or (chef_profiles.slug = 'ibrahim' and cuisines.slug in ('west-african', 'seafood', 'chefs-special'));
