revoke all on schema private from public, anon, authenticated;

create table private.chef_contacts (
  chef_id bigint primary key references public.chef_profiles (id) on delete cascade,
  email text,
  whatsapp_e164 text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index chef_contacts_whatsapp_e164_idx
  on private.chef_contacts (whatsapp_e164);

create table private.chef_notices (
  id bigint generated always as identity primary key,
  chef_id bigint not null references public.chef_profiles (id) on delete cascade,
  inquiry_id bigint references public.inquiries (id) on delete set null,
  request_id bigint references public.chef_requests (id) on delete set null,
  channel text not null
    check (channel in ('email', 'whatsapp')),
  direction text not null
    check (direction in ('outbound', 'inbound')),
  destination text,
  body text not null,
  parsed_amount numeric(12, 2),
  provider text,
  provider_message_id text,
  created_at timestamptz not null default now()
);

create index chef_notices_chef_created_idx
  on private.chef_notices (chef_id, created_at desc);
create index chef_notices_inquiry_id_idx
  on private.chef_notices (inquiry_id);
create index chef_notices_request_id_idx
  on private.chef_notices (request_id);
create index chef_notices_destination_idx
  on private.chef_notices (destination, created_at desc);

alter table private.chef_contacts enable row level security;
alter table private.chef_notices enable row level security;
