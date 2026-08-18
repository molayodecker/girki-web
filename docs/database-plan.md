# Girki marketplace data model

Girki supports two paths into the same booking lifecycle:

1. A customer chooses a specific chef and sends a direct inquiry.
2. A customer posts a chef request, receives proposals, and selects a chef.

Both paths converge on `bookings`, which then connects to payments, payouts, menus, conversations, and reviews.

## Current implementation

The web app uses `MarketplaceRepository` as the persistence boundary. `MockMarketplaceRepository` stores demo state in `localStorage` so the marketplace can be built and tested before Supabase is connected.

When Supabase is introduced, replace the mock implementation with a Supabase-backed repository while keeping the components and route flows intact.

## Core tables for Supabase

### Identity

- `profiles`
  - `id` -> `auth.users.id`
  - name, email, phone, avatar, role, account status
- `chef_profiles`
  - `user_id`
  - slug, headline, bio, city, country, coordinates
  - experience, verification state, availability state
  - cached rating and completed-booking counts

### Chef catalog

- `service_types`
  - Private Dinner, Weekly Meal Prep, Date Night, Parties & Celebrations, Wedding, Corporate Event, Vacation Chef, Brunch, Cooking Class
- `chef_services`
  - chef, service type, title, description, pricing model, base price, price per guest, guest limits, currency, active flag
- `cuisines`
- `chef_cuisines`
- `chef_availability`
- `chef_availability_rules`

### Customer intent

- `locations`
  - reusable customer/event addresses and coordinates
- `inquiries`
  - direct customer-to-chef request
  - chef, customer, service, event date/time, guest count, occasion, location, budget, message, status
- `chef_requests`
  - open request not initially tied to one chef
  - service type, event details, city/location, guest count, budget, cuisines, dietary needs, description, status
- `proposals`
  - request, chef, proposed price, message, menu direction, included/excluded services, status, expiry

### Conversation

- `conversations`
  - customer, chef, optional inquiry/request/proposal/booking references
- `messages`
  - conversation, sender, type, body, attachment, read timestamp

### Fulfillment

- `bookings`
  - customer, chef
  - optional source inquiry/request/proposal
  - `booking_source`: direct | inquiry | chef_request | admin
  - event snapshot, subtotal, service fee, tax, discount, total, chef payout, currency
  - payment state and booking state
- `booking_menus`
- `booking_menu_items`

### Money

- `payments`
  - booking, provider, provider reference, amount, currency, payment status, timestamps
- `chef_payouts`
  - chef, booking, gross amount, platform fee, net amount, availability and payout status

### Trust

- `reviews`
  - booking, customer, chef
  - overall, food, professionalism, communication, value, review text, chef response
- `favorites`
  - customer, chef

## Recommended booking states

Keep the operational state machine intentionally small:

- `awaiting_payment`
- `confirmed`
- `in_progress`
- `completed`
- `cancelled`
- `refunded`

Payment state stays separate:

- `pending`
- `paid`
- `failed`
- `partially_refunded`
- `refunded`

## Conversion rules

### Direct chef inquiry

`chef profile -> inquiry -> quote -> accepted -> booking -> payment -> service -> payout -> review`

An inquiry should never itself become the source of truth for fulfillment. Once accepted, create a booking and retain `inquiry_id` for provenance.

### Open chef request

`chef request -> proposals -> selected proposal -> booking -> payment -> service -> payout -> review`

When one proposal is accepted:

1. Mark the selected proposal `accepted`.
2. Mark competing proposals `declined` or `expired`.
3. Mark the request `booked`.
4. Create one booking referencing both `request_id` and `proposal_id`.

## RLS direction for Supabase

When Supabase is connected:

- Customers can read/write only their own inquiries, requests, bookings, conversations, payments, favorites, and reviews.
- Chefs can read inquiries addressed to them, matched/open requests Girki exposes to them, their own proposals, bookings, conversations, reviews, and payouts.
- Public visitors can read only active public chef profiles, services, cuisines, public availability summaries, and public reviews.
- Payment and payout mutations should run through trusted server functions or Edge Functions, not directly from the browser.
- Booking monetary snapshots should be immutable to ordinary customer/chef updates after payment begins.

## Indexes to add first

- `chef_profiles (base_city, profile_status, is_available)`
- PostGIS GIST index on chef coordinates when geo search is enabled
- `inquiries (chef_id, status, created_at desc)`
- `chef_requests (status, event_date, created_at desc)`
- `proposals (request_id, chef_id)` unique
- `bookings (chef_id, event_date)`
- `bookings (customer_id, created_at desc)`
- `payments (booking_id)`
- `chef_payouts (chef_id, status, available_at)`
- `messages (conversation_id, created_at)`

## Repository replacement plan

The UI imports the `MarketplaceRepository` contract rather than Supabase directly. The future implementation should provide the same methods:

- `createInquiry`
- `createRequest`
- `createProposal`
- `acceptProposal`
- `quoteInquiry`
- `listChefDashboard`
- `updateBookingStatus`

That keeps database/vendor code out of the presentation layer and lets Supabase connection happen as a focused follow-up change.
