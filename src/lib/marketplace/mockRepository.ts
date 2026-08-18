import type { MarketplaceRepository } from './repository'
import type {
  Booking,
  BookingStatus,
  ChefProposal,
  ChefRequestRecord,
  DirectInquiry,
  NewChefProposal,
  NewChefRequest,
  NewDirectInquiry,
} from './types'

const storageKey = 'girki-marketplace-v1'

type MarketplaceState = {
  inquiries: DirectInquiry[]
  requests: ChefRequestRecord[]
  proposals: ChefProposal[]
  bookings: Booking[]
}

const seedState: MarketplaceState = {
  inquiries: [
    {
      id: 'inq-ama-birthday',
      chefId: 'nana',
      customerName: 'Ama Boateng',
      email: 'ama@example.com',
      phone: '+233 20 000 0001',
      eventDate: '2026-08-29',
      guestCount: 10,
      occasion: 'Birthday dinner',
      location: 'East Legon, Accra',
      budget: 'GH₵3,000–4,000',
      message: 'A relaxed birthday dinner with Ghanaian food and one vegetarian guest.',
      status: 'new',
      currency: 'GHS',
      createdAt: '2026-08-18T13:15:00.000Z',
    },
    {
      id: 'inq-michael-date-night',
      chefId: 'nana',
      customerName: 'Michael Mensah',
      email: 'michael@example.com',
      phone: '+233 20 000 0002',
      eventDate: '2026-09-05',
      guestCount: 2,
      occasion: 'Date night',
      location: 'Cantonments, Accra',
      budget: 'GH₵1,500–2,500',
      message: 'Three courses, seafood preferred, with a quiet restaurant-at-home feel.',
      status: 'quoted',
      quotedPrice: 2200,
      currency: 'GHS',
      createdAt: '2026-08-17T18:40:00.000Z',
    },
  ],
  requests: [
    {
      id: 'req-accra-birthday',
      customerName: 'Akosua Owusu',
      email: 'akosua@example.com',
      phone: '+233 20 000 0003',
      city: 'Accra',
      cuisine: 'Ghanaian',
      occasion: 'Birthday',
      serviceType: 'Single service',
      guestSummary: '12 guests',
      mealTime: 'Dinner',
      eventDate: '2026-09-12',
      budget: 'Gourmet',
      restrictions: 'One guest is gluten-free',
      notes: 'Outdoor birthday dinner in East Legon. Jollof should be part of the menu.',
      status: 'receiving_proposals',
      createdAt: '2026-08-18T11:20:00.000Z',
    },
    {
      id: 'req-weekly-meal-prep',
      customerName: 'Esi Bediako',
      email: 'esi@example.com',
      phone: '+233 20 000 0004',
      city: 'Accra',
      cuisine: 'West African',
      occasion: 'Family',
      serviceType: 'Weekly meal prep',
      guestSummary: 'Family of 4',
      mealTime: 'Weekly',
      eventDate: '2026-08-24',
      budget: 'Casual',
      restrictions: 'Low sodium',
      notes: 'Five family dinners each week. We are flexible on the cooking day.',
      status: 'open',
      createdAt: '2026-08-18T09:05:00.000Z',
    },
  ],
  proposals: [
    {
      id: 'prop-nana-birthday',
      requestId: 'req-accra-birthday',
      chefId: 'nana',
      message: 'I can build a Ghanaian celebration menu around grilled fish, jollof, and a plated dessert.',
      proposedPrice: 3600,
      currency: 'GHS',
      menuDescription: 'Accra celebration table',
      includedServices: ['Menu design', 'Grocery sourcing', 'Cooking', 'Kitchen cleanup'],
      status: 'submitted',
      createdAt: '2026-08-18T12:00:00.000Z',
    },
  ],
  bookings: [
    {
      id: 'booking-1048',
      bookingNumber: 'GRK-1048',
      customerName: 'Naa Dedei',
      email: 'naa@example.com',
      chefId: 'nana',
      source: 'inquiry',
      inquiryId: 'inq-seed-converted',
      eventDate: '2026-08-23',
      guestSummary: '6 guests',
      occasion: 'Private dinner',
      location: 'Airport Residential, Accra',
      subtotal: 2400,
      serviceFee: 240,
      total: 2640,
      chefPayout: 2040,
      currency: 'GHS',
      paymentStatus: 'paid',
      bookingStatus: 'confirmed',
      createdAt: '2026-08-15T16:30:00.000Z',
    },
    {
      id: 'booking-1039',
      bookingNumber: 'GRK-1039',
      customerName: 'Kojo Asante',
      email: 'kojo@example.com',
      chefId: 'nana',
      source: 'direct',
      eventDate: '2026-08-10',
      guestSummary: '4 guests',
      occasion: 'Anniversary dinner',
      location: 'Labone, Accra',
      subtotal: 1800,
      serviceFee: 180,
      total: 1980,
      chefPayout: 1530,
      currency: 'GHS',
      paymentStatus: 'paid',
      bookingStatus: 'completed',
      createdAt: '2026-08-02T10:10:00.000Z',
    },
  ],
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function createId(prefix: string) {
  const suffix =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  return `${prefix}-${suffix}`
}

function readState(): MarketplaceState {
  if (typeof window === 'undefined') return clone(seedState)
  const raw = window.localStorage.getItem(storageKey)
  if (!raw) return clone(seedState)
  try {
    return JSON.parse(raw) as MarketplaceState
  } catch {
    return clone(seedState)
  }
}

function writeState(state: MarketplaceState) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(storageKey, JSON.stringify(state))
}

function currencyAmount(bookings: Booking[], status: BookingStatus) {
  return bookings
    .filter((booking) => booking.bookingStatus === status)
    .reduce((sum, booking) => sum + booking.chefPayout, 0)
}

class MockMarketplaceRepository implements MarketplaceRepository {
  async createInquiry(input: NewDirectInquiry) {
    const state = readState()
    const inquiry: DirectInquiry = {
      ...input,
      id: createId('inq'),
      status: 'new',
      createdAt: new Date().toISOString(),
    }
    state.inquiries.unshift(inquiry)
    writeState(state)
    return clone(inquiry)
  }

  async createRequest(input: NewChefRequest) {
    const state = readState()
    const request: ChefRequestRecord = {
      ...input,
      id: createId('req'),
      status: 'receiving_proposals',
      createdAt: new Date().toISOString(),
    }
    state.requests.unshift(request)
    writeState(state)
    return clone(request)
  }

  async createProposal(input: NewChefProposal) {
    const state = readState()
    const existing = state.proposals.find(
      (proposal) => proposal.requestId === input.requestId && proposal.chefId === input.chefId,
    )
    if (existing) return clone(existing)

    const proposal: ChefProposal = {
      ...input,
      id: createId('prop'),
      status: 'submitted',
      createdAt: new Date().toISOString(),
    }
    state.proposals.unshift(proposal)
    const request = state.requests.find((item) => item.id === input.requestId)
    if (request && request.status === 'open') request.status = 'receiving_proposals'
    writeState(state)
    return clone(proposal)
  }

  async acceptProposal(proposalId: string) {
    const state = readState()
    const existingBooking = state.bookings.find((booking) => booking.proposalId === proposalId)
    if (existingBooking) return clone(existingBooking)

    const proposal = state.proposals.find((item) => item.id === proposalId)
    if (!proposal) throw new Error('Proposal not found.')
    const request = state.requests.find((item) => item.id === proposal.requestId)
    if (!request) throw new Error('Chef request not found.')

    proposal.status = 'accepted'
    request.status = 'booked'
    state.proposals
      .filter((item) => item.requestId === request.id && item.id !== proposal.id)
      .forEach((item) => {
        item.status = 'declined'
      })

    const serviceFee = Math.round(proposal.proposedPrice * 0.1)
    const booking: Booking = {
      id: createId('booking'),
      bookingNumber: `GRK-${String(1000 + state.bookings.length + 1)}`,
      customerName: request.customerName,
      email: request.email,
      chefId: proposal.chefId,
      source: 'chef_request',
      requestId: request.id,
      proposalId: proposal.id,
      eventDate: request.eventDate,
      guestSummary: request.guestSummary,
      occasion: request.occasion,
      location: request.city,
      subtotal: proposal.proposedPrice,
      serviceFee,
      total: proposal.proposedPrice + serviceFee,
      chefPayout: Math.round(proposal.proposedPrice * 0.85),
      currency: proposal.currency,
      paymentStatus: 'pending',
      bookingStatus: 'awaiting_payment',
      createdAt: new Date().toISOString(),
    }
    state.bookings.unshift(booking)
    writeState(state)
    return clone(booking)
  }

  async quoteInquiry(inquiryId: string, quotedPrice: number) {
    const state = readState()
    const inquiry = state.inquiries.find((item) => item.id === inquiryId)
    if (!inquiry) throw new Error('Inquiry not found.')
    inquiry.status = 'quoted'
    inquiry.quotedPrice = quotedPrice
    writeState(state)
    return clone(inquiry)
  }

  async listChefDashboard(chefId: string) {
    const state = readState()
    const bookings = state.bookings.filter((booking) => booking.chefId === chefId)
    const completed = currencyAmount(bookings, 'completed')
    const pending = bookings
      .filter((booking) => ['awaiting_payment', 'confirmed', 'in_progress'].includes(booking.bookingStatus))
      .reduce((sum, booking) => sum + booking.chefPayout, 0)

    return {
      inquiries: clone(state.inquiries.filter((inquiry) => inquiry.chefId === chefId)),
      openRequests: clone(
        state.requests.filter((request) =>
          ['open', 'receiving_proposals'].includes(request.status),
        ),
      ),
      proposals: clone(state.proposals.filter((proposal) => proposal.chefId === chefId)),
      bookings: clone(bookings),
      revenue: {
        available: completed,
        pending,
        lifetime: completed + pending,
        currency: 'GHS' as const,
      },
    }
  }

  async updateBookingStatus(bookingId: string, status: BookingStatus) {
    const state = readState()
    const booking = state.bookings.find((item) => item.id === bookingId)
    if (!booking) throw new Error('Booking not found.')
    booking.bookingStatus = status
    writeState(state)
    return clone(booking)
  }
}

export const marketplaceRepository: MarketplaceRepository = new MockMarketplaceRepository()
