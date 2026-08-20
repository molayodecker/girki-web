import { sql } from './db.server'
import type {
  Booking,
  BookingStatus,
  ChefDashboardData,
  ChefProposal,
  ChefRequestRecord,
  Currency,
  DirectInquiry,
  InquiryStatus,
  NewChefProposal,
  NewChefRequest,
  NewDirectInquiry,
  PaymentStatus,
  ProposalStatus,
  RequestStatus,
} from './marketplace/types'

type InquiryRow = {
  id: string | number
  chef_slug: string
  customer_name: string
  email: string
  phone: string
  event_date: string | Date | null
  guest_count: number
  occasion: string
  location_label: string
  budget: string | null
  message: string | null
  status: InquiryStatus
  quoted_price: string | number | null
  currency: Currency
  created_at: string | Date
}

type RequestRow = {
  id: string | number
  customer_name: string
  email: string
  phone: string | null
  city: string
  cuisine: string | null
  occasion: string
  service_type: string
  guest_summary: string
  meal_time: string | null
  event_date: string | Date | null
  budget: string | null
  restrictions: string | null
  notes: string | null
  status: RequestStatus
  created_at: string | Date
}

type ProposalRow = {
  id: string | number
  request_id: string | number
  chef_slug: string
  message: string
  proposed_price: string | number
  currency: Currency
  menu_description: string | null
  included_services: string[] | null
  status: ProposalStatus
  created_at: string | Date
}

type BookingRow = {
  id: string | number
  booking_number: string
  customer_name: string
  email: string
  chef_slug: string
  booking_source: Booking['source']
  inquiry_id: string | number | null
  request_id: string | number | null
  proposal_id: string | number | null
  event_date: string | Date | null
  guest_summary: string
  occasion: string
  location_label: string
  subtotal: string | number
  service_fee: string | number
  total: string | number
  chef_payout: string | number
  currency: Currency
  payment_status: PaymentStatus
  booking_status: BookingStatus
  created_at: string | Date
}

function asId(value: string | number) {
  return String(value)
}

function asDate(value: string | Date | null) {
  if (!value) return ''
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  return String(value).slice(0, 10)
}

function asTime(value: string | Date) {
  if (value instanceof Date) return value.toISOString()
  return String(value)
}

function asMoney(value: string | number | null) {
  if (value == null) return undefined
  return Number(value)
}

function mapInquiry(row: InquiryRow): DirectInquiry {
  return {
    id: asId(row.id),
    chefId: row.chef_slug,
    customerName: row.customer_name,
    email: row.email,
    phone: row.phone,
    eventDate: asDate(row.event_date),
    guestCount: Number(row.guest_count),
    occasion: row.occasion,
    location: row.location_label,
    budget: row.budget ?? '',
    message: row.message ?? '',
    status: row.status,
    quotedPrice: asMoney(row.quoted_price),
    currency: row.currency,
    createdAt: asTime(row.created_at),
  }
}

function mapRequest(row: RequestRow): ChefRequestRecord {
  return {
    id: asId(row.id),
    customerName: row.customer_name,
    email: row.email,
    phone: row.phone ?? '',
    city: row.city,
    cuisine: row.cuisine ?? '',
    occasion: row.occasion,
    serviceType: row.service_type,
    guestSummary: row.guest_summary,
    mealTime: row.meal_time ?? '',
    eventDate: asDate(row.event_date),
    budget: row.budget ?? '',
    restrictions: row.restrictions ?? '',
    notes: row.notes ?? '',
    status: row.status,
    createdAt: asTime(row.created_at),
  }
}

function mapProposal(row: ProposalRow): ChefProposal {
  return {
    id: asId(row.id),
    requestId: asId(row.request_id),
    chefId: row.chef_slug,
    message: row.message,
    proposedPrice: Number(row.proposed_price),
    currency: row.currency,
    menuDescription: row.menu_description ?? '',
    includedServices: row.included_services ?? [],
    status: row.status,
    createdAt: asTime(row.created_at),
  }
}

function mapBooking(row: BookingRow): Booking {
  return {
    id: asId(row.id),
    bookingNumber: row.booking_number,
    customerName: row.customer_name,
    email: row.email,
    chefId: row.chef_slug,
    source: row.booking_source,
    inquiryId: row.inquiry_id == null ? undefined : asId(row.inquiry_id),
    requestId: row.request_id == null ? undefined : asId(row.request_id),
    proposalId: row.proposal_id == null ? undefined : asId(row.proposal_id),
    eventDate: asDate(row.event_date),
    guestSummary: row.guest_summary,
    occasion: row.occasion,
    location: row.location_label,
    subtotal: Number(row.subtotal),
    serviceFee: Number(row.service_fee),
    total: Number(row.total),
    chefPayout: Number(row.chef_payout),
    currency: row.currency,
    paymentStatus: row.payment_status,
    bookingStatus: row.booking_status,
    createdAt: asTime(row.created_at),
  }
}

async function chefRowId(slug: string) {
  const rows = await sql<{ id: string | number }[]>`
    select id from public.chef_profiles where slug = ${slug} limit 1
  `
  if (!rows[0]) throw new Error('Chef not found.')
  return rows[0].id
}

async function inquiryById(id: string) {
  const rows = await sql<InquiryRow[]>`
    select
      i.id,
      c.slug as chef_slug,
      i.customer_name,
      i.email,
      i.phone,
      i.event_date,
      i.guest_count,
      i.occasion,
      i.location_label,
      i.budget,
      i.message,
      i.status,
      i.quoted_price,
      i.currency,
      i.created_at
    from public.inquiries i
    join public.chef_profiles c on c.id = i.chef_id
    where i.id = ${id}
    limit 1
  `
  if (!rows[0]) throw new Error('Inquiry not found.')
  return mapInquiry(rows[0])
}

async function proposalById(id: string) {
  const rows = await sql<ProposalRow[]>`
    select
      p.id,
      p.request_id,
      c.slug as chef_slug,
      p.message,
      p.proposed_price,
      p.currency,
      p.menu_description,
      p.included_services,
      p.status,
      p.created_at
    from public.proposals p
    join public.chef_profiles c on c.id = p.chef_id
    where p.id = ${id}
    limit 1
  `
  if (!rows[0]) throw new Error('Proposal not found.')
  return mapProposal(rows[0])
}

async function bookingById(id: string) {
  const rows = await sql<BookingRow[]>`
    select
      b.id,
      b.booking_number,
      b.customer_name,
      b.email,
      c.slug as chef_slug,
      b.booking_source,
      b.inquiry_id,
      b.request_id,
      b.proposal_id,
      b.event_date,
      b.guest_summary,
      b.occasion,
      b.location_label,
      b.subtotal,
      b.service_fee,
      b.total,
      b.chef_payout,
      b.currency,
      b.payment_status,
      b.booking_status,
      b.created_at
    from public.bookings b
    join public.chef_profiles c on c.id = b.chef_id
    where b.id = ${id}
    limit 1
  `
  if (!rows[0]) throw new Error('Booking not found.')
  return mapBooking(rows[0])
}

export async function createInquiry(input: NewDirectInquiry) {
  const chefId = await chefRowId(input.chefId)
  const rows = await sql<{ id: string | number }[]>`
    insert into public.inquiries (
      chef_id, customer_name, email, phone, event_date, guest_count, occasion,
      location_label, budget, message, currency, status
    ) values (
      ${chefId},
      ${input.customerName},
      ${input.email},
      ${input.phone},
      ${input.eventDate || null},
      ${input.guestCount},
      ${input.occasion},
      ${input.location},
      ${input.budget},
      ${input.message},
      ${input.currency},
      'new'
    )
    returning id
  `
  return inquiryById(asId(rows[0].id))
}

export async function createRequest(input: NewChefRequest) {
  const { createAccessToken, hashAccessToken } = await import('./auth-session.server')
  const accessToken = createAccessToken()
  const accessTokenHash = hashAccessToken(accessToken)

  const rows = await sql<{ id: string | number }[]>`
    insert into public.chef_requests (
      customer_name, email, phone, city, cuisine, occasion, service_type,
      guest_summary, meal_time, event_date, budget, restrictions, notes, status,
      access_token_hash
    ) values (
      ${input.customerName},
      ${input.email},
      ${input.phone},
      ${input.city},
      ${input.cuisine},
      ${input.occasion},
      ${input.serviceType},
      ${input.guestSummary},
      ${input.mealTime},
      ${input.eventDate || null},
      ${input.budget},
      ${input.restrictions},
      ${input.notes},
      'receiving_proposals',
      ${accessTokenHash}
    )
    returning id
  `
  const created = await sql<RequestRow[]>`
    select * from public.chef_requests where id = ${rows[0].id} limit 1
  `
  return { ...mapRequest(created[0]), accessToken }
}

export async function createProposal(input: NewChefProposal, chefSlug: string) {
  if (!Number.isFinite(input.proposedPrice) || input.proposedPrice <= 0) {
    throw new Error('Enter a quote amount greater than zero.')
  }
  const chefId = await chefRowId(chefSlug)
  const rows = await sql<{ id: string | number }[]>`
    insert into public.proposals (
      request_id, chef_id, message, proposed_price, currency, menu_description, included_services, status
    ) values (
      ${input.requestId},
      ${chefId},
      ${input.message},
      ${input.proposedPrice},
      ${input.currency},
      ${input.menuDescription},
      ${input.includedServices},
      'submitted'
    )
    on conflict (request_id, chef_id) do update set
      message = excluded.message,
      proposed_price = excluded.proposed_price,
      currency = excluded.currency,
      menu_description = excluded.menu_description,
      included_services = excluded.included_services,
      status = 'submitted'
    where public.proposals.status not in ('accepted', 'declined')
    returning id
  `
  const proposalId = rows[0]?.id
    ? asId(rows[0].id)
    : asId(
        (
          await sql<{ id: string | number }[]>`
            select id from public.proposals
            where request_id = ${input.requestId} and chef_id = ${chefId}
            limit 1
          `
        )[0]?.id ?? '',
      )
  if (!proposalId) throw new Error('Unable to save this quote.')

  await sql`
    update public.chef_requests
    set status = 'receiving_proposals'
    where id = ${input.requestId} and status = 'open'
  `
  return proposalById(proposalId)
}

export async function quoteInquiry(inquiryId: string, quotedPrice: number, chefSlug: string) {
  if (!Number.isFinite(quotedPrice) || quotedPrice <= 0) {
    throw new Error('Enter a quote amount greater than zero.')
  }

  const updated = await sql`
    update public.inquiries i
    set quoted_price = ${quotedPrice}, status = 'quoted', updated_at = now()
    from public.chef_profiles c
    where i.id = ${inquiryId}
      and i.chef_id = c.id
      and c.slug = ${chefSlug}
    returning i.id
  `
  if (!updated[0]) throw new Error('Inquiry not found.')
  return inquiryById(inquiryId)
}

export async function listProposalsForRequest(requestId: string, accessToken: string) {
  const { hashAccessToken } = await import('./auth-session.server')
  const tokenHash = hashAccessToken(accessToken)
  const allowed = await sql<{ id: string | number }[]>`
    select id from public.chef_requests
    where id = ${requestId} and access_token_hash = ${tokenHash}
    limit 1
  `
  if (!allowed[0]) throw new Error('Unauthorized. This request token is invalid.')

  const rows = await sql<ProposalRow[]>`
    select
      p.id,
      p.request_id,
      c.slug as chef_slug,
      p.message,
      p.proposed_price,
      p.currency,
      p.menu_description,
      p.included_services,
      p.status,
      p.created_at
    from public.proposals p
    join public.chef_profiles c on c.id = p.chef_id
    where p.request_id = ${requestId}
    order by p.created_at desc
  `
  return rows.map(mapProposal)
}

export async function acceptProposal(proposalId: string, accessToken: string) {
  const { hashAccessToken } = await import('./auth-session.server')
  const tokenHash = hashAccessToken(accessToken)

  return sql.begin(async (tx) => {
    const proposal = await tx<
      Array<{
        id: string | number
        request_id: string | number
        chef_id: string | number
        proposed_price: string | number
        currency: Currency
        status: ProposalStatus
      }>
    >`
      select id, request_id, chef_id, proposed_price, currency, status
      from public.proposals
      where id = ${proposalId}
      for update
    `
    if (!proposal[0]) throw new Error('Proposal not found.')
    if (!['submitted', 'viewed', 'shortlisted'].includes(proposal[0].status)) {
      throw new Error('This proposal can no longer be accepted.')
    }

    const request = await tx<
      Array<RequestRow & { access_token_hash: string | null }>
    >`
      select * from public.chef_requests
      where id = ${proposal[0].request_id}
      for update
    `
    if (!request[0]) throw new Error('Chef request not found.')
    if (request[0].access_token_hash !== tokenHash) {
      throw new Error('Unauthorized. This request token is invalid.')
    }
    if (request[0].status === 'booked') {
      const existing = await tx<{ id: string | number }[]>`
        select id from public.bookings
        where request_id = ${request[0].id}
          and booking_status not in ('cancelled', 'refunded')
        limit 1
      `
      if (existing[0]) return asId(existing[0].id)
    }

    const existingForProposal = await tx<{ id: string | number }[]>`
      select id from public.bookings where proposal_id = ${proposalId} limit 1
    `
    if (existingForProposal[0]) return asId(existingForProposal[0].id)

    await tx`
      update public.proposals
      set status = 'accepted'
      where id = ${proposalId}
    `
    await tx`
      update public.proposals
      set status = 'declined'
      where request_id = ${proposal[0].request_id} and id <> ${proposalId}
    `
    await tx`
      update public.chef_requests
      set status = 'booked', updated_at = now()
      where id = ${proposal[0].request_id}
    `

    const price = Number(proposal[0].proposed_price)
    const serviceFee = Math.round(price * 0.1)
    const bookingNumberRows = await tx<Array<{ n: string }>>`
      select public.next_booking_number() as n
    `
    const bookingNumber = bookingNumberRows[0]?.n
    if (!bookingNumber) throw new Error('Unable to allocate a booking number.')
    const eventDate = request[0].event_date ?? new Date()

    const inserted = await tx<{ id: string | number }[]>`
      insert into public.bookings (
        booking_number, customer_name, email, chef_id, booking_source, request_id, proposal_id,
        event_date, guest_summary, occasion, location_label, subtotal, service_fee, total,
        chef_payout, currency, payment_status, booking_status
      ) values (
        ${bookingNumber},
        ${request[0].customer_name},
        ${request[0].email},
        ${proposal[0].chef_id},
        'chef_request',
        ${request[0].id},
        ${proposal[0].id},
        ${eventDate},
        ${request[0].guest_summary},
        ${request[0].occasion},
        ${request[0].city},
        ${price},
        ${serviceFee},
        ${price + serviceFee},
        ${Math.round(price * 0.85)},
        ${proposal[0].currency},
        'pending',
        'awaiting_payment'
      )
      returning id
    `
    return asId(inserted[0].id)
  }).then((bookingId) => bookingById(bookingId))
}

export async function listChefDashboard(chefSlug: string): Promise<ChefDashboardData> {
  const chefId = await chefRowId(chefSlug)

  const inquiries = await sql<InquiryRow[]>`
    select
      i.id,
      c.slug as chef_slug,
      i.customer_name,
      i.email,
      i.phone,
      i.event_date,
      i.guest_count,
      i.occasion,
      i.location_label,
      i.budget,
      i.message,
      i.status,
      i.quoted_price,
      i.currency,
      i.created_at
    from public.inquiries i
    join public.chef_profiles c on c.id = i.chef_id
    where i.chef_id = ${chefId}
    order by i.created_at desc
  `

  const openRequests = await sql<RequestRow[]>`
    select *
    from public.chef_requests
    where status in ('open', 'receiving_proposals')
    order by created_at desc
  `

  const proposals = await sql<ProposalRow[]>`
    select
      p.id,
      p.request_id,
      c.slug as chef_slug,
      p.message,
      p.proposed_price,
      p.currency,
      p.menu_description,
      p.included_services,
      p.status,
      p.created_at
    from public.proposals p
    join public.chef_profiles c on c.id = p.chef_id
    where p.chef_id = ${chefId}
    order by p.created_at desc
  `

  const bookings = await sql<BookingRow[]>`
    select
      b.id,
      b.booking_number,
      b.customer_name,
      b.email,
      c.slug as chef_slug,
      b.booking_source,
      b.inquiry_id,
      b.request_id,
      b.proposal_id,
      b.event_date,
      b.guest_summary,
      b.occasion,
      b.location_label,
      b.subtotal,
      b.service_fee,
      b.total,
      b.chef_payout,
      b.currency,
      b.payment_status,
      b.booking_status,
      b.created_at
    from public.bookings b
    join public.chef_profiles c on c.id = b.chef_id
    where b.chef_id = ${chefId}
    order by b.created_at desc
  `

  const mappedBookings = bookings.map(mapBooking)
  const available = mappedBookings
    .filter((booking) => booking.bookingStatus === 'completed')
    .reduce((sum, booking) => sum + booking.chefPayout, 0)
  const pending = mappedBookings
    .filter((booking) =>
      ['awaiting_payment', 'confirmed', 'in_progress'].includes(booking.bookingStatus),
    )
    .reduce((sum, booking) => sum + booking.chefPayout, 0)

  return {
    inquiries: inquiries.map(mapInquiry),
    openRequests: openRequests.map(mapRequest),
    proposals: proposals.map(mapProposal),
    bookings: mappedBookings,
    revenue: {
      available,
      pending,
      lifetime: available + pending,
      currency: 'GHS',
    },
  }
}

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus,
  chefSlug: string,
) {
  const allowed: Record<BookingStatus, BookingStatus[]> = {
    awaiting_payment: ['cancelled'],
    confirmed: ['in_progress', 'cancelled'],
    in_progress: ['completed'],
    completed: [],
    cancelled: [],
    refunded: [],
  }

  const current = await sql<
    Array<{ id: string | number; booking_status: BookingStatus; chef_slug: string }>
  >`
    select b.id, b.booking_status, c.slug as chef_slug
    from public.bookings b
    join public.chef_profiles c on c.id = b.chef_id
    where b.id = ${bookingId}
    limit 1
  `
  if (!current[0] || current[0].chef_slug !== chefSlug) {
    throw new Error('Booking not found.')
  }
  if (!allowed[current[0].booking_status]?.includes(status)) {
    throw new Error('Invalid booking status transition.')
  }

  const updated = await sql`
    update public.bookings
    set booking_status = ${status}, updated_at = now()
    where id = ${bookingId}
    returning id
  `
  if (!updated[0]) throw new Error('Booking not found.')
  return bookingById(bookingId)
}
