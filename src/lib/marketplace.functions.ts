import { createServerFn } from '@tanstack/react-start'
import type { MarketplaceRepository } from './marketplace/repository'
import type {
  BookingStatus,
  ChefRequestRecord,
  NewChefRequest,
  NewDirectInquiry,
} from './marketplace/types'

const bookingStatuses: BookingStatus[] = [
  'awaiting_payment',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled',
  'refunded',
]

export type ChefRequestWithAccess = ChefRequestRecord & { accessToken: string }

function asRecord(data: unknown) {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Expected an object.')
  }
  return data as Record<string, unknown>
}

function requiredString(value: unknown, label: string) {
  const text = typeof value === 'string' ? value.trim() : ''
  if (!text) throw new Error(`${label} is required.`)
  return text
}

function optionalString(value: unknown) {
  return typeof value === 'string' ? value : ''
}

function requiredNumber(value: unknown, label: string) {
  const amount = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error(`${label} must be greater than zero.`)
  }
  return amount
}

export const createInquiryFn = createServerFn({ method: 'POST' })
  .validator((data: unknown): NewDirectInquiry => {
    const input = asRecord(data)
    return {
      chefId: requiredString(input.chefId, 'Chef'),
      customerName: requiredString(input.customerName, 'Name'),
      email: requiredString(input.email, 'Email'),
      phone: requiredString(input.phone, 'Phone'),
      eventDate: requiredString(input.eventDate, 'Event date'),
      guestCount: Math.max(1, Number(input.guestCount) || 1),
      occasion: requiredString(input.occasion, 'Occasion'),
      location: requiredString(input.location, 'Location'),
      budget: optionalString(input.budget),
      message: optionalString(input.message),
      currency:
        input.currency === 'USD' ||
        input.currency === 'NGN' ||
        input.currency === 'KES' ||
        input.currency === 'ZAR'
          ? input.currency
          : 'GHS',
    }
  })
  .handler(async ({ data }) => {
    const live = await import('./marketplace.server')
    const inquiry = await live.createInquiry(data)
    try {
      const notify = await import('./chef-notify.server')
      await notify.notifyInquiry(inquiry)
    } catch (error) {
      console.error('Inquiry notify failed', error)
    }
    return inquiry
  })

export const createRequestFn = createServerFn({ method: 'POST' })
  .validator((data: unknown): NewChefRequest => {
    const input = asRecord(data)
    return {
      customerName: requiredString(input.customerName, 'Name'),
      email: optionalString(input.email).trim() || 'guest@girki.app',
      phone: optionalString(input.phone),
      city: requiredString(input.city, 'City'),
      cuisine: optionalString(input.cuisine),
      occasion: requiredString(input.occasion, 'Occasion'),
      serviceType: requiredString(input.serviceType, 'Service type'),
      guestSummary: requiredString(input.guestSummary, 'Guests'),
      mealTime: optionalString(input.mealTime),
      eventDate: optionalString(input.eventDate),
      budget: optionalString(input.budget),
      restrictions: optionalString(input.restrictions),
      notes: optionalString(input.notes),
    }
  })
  .handler(async ({ data }): Promise<ChefRequestWithAccess> => {
    const live = await import('./marketplace.server')
    const request = await live.createRequest(data)
    try {
      const notify = await import('./chef-notify.server')
      await notify.notifyRequest(request)
    } catch (error) {
      console.error('Request notify failed', error)
    }
    return request
  })

export const createProposalFn = createServerFn({ method: 'POST' })
  .validator((data: unknown) => {
    const input = asRecord(data)
    return {
      requestId: requiredString(input.requestId, 'Request'),
      message: requiredString(input.message, 'Message'),
      proposedPrice: requiredNumber(input.proposedPrice, 'Quote'),
      menuDescription: optionalString(input.menuDescription),
      includedServices: Array.isArray(input.includedServices)
        ? input.includedServices.map(String)
        : [],
    }
  })
  .handler(async ({ data }) => {
    const { requireActiveChefSession } = await import('./auth-session.server')
    const session = await requireActiveChefSession()
    const live = await import('./marketplace.server')
    return live.createProposal(
      {
        requestId: data.requestId,
        chefId: session.slug,
        message: data.message,
        proposedPrice: data.proposedPrice,
        currency: 'GHS',
        menuDescription: data.menuDescription,
        includedServices: data.includedServices,
      },
      session.slug,
    )
  })

export const quoteInquiryFn = createServerFn({ method: 'POST' })
  .validator((data: unknown) => {
    const input = asRecord(data)
    return {
      inquiryId: requiredString(input.inquiryId, 'Inquiry'),
      quotedPrice: requiredNumber(input.quotedPrice, 'Quote'),
    }
  })
  .handler(async ({ data }) => {
    const { requireActiveChefSession } = await import('./auth-session.server')
    const session = await requireActiveChefSession()
    const live = await import('./marketplace.server')
    return live.quoteInquiry(data.inquiryId, data.quotedPrice, session.slug)
  })

export const listProposalsForRequestFn = createServerFn({ method: 'POST' })
  .validator((data: unknown) => {
    const input = asRecord(data)
    return {
      requestId: requiredString(input.requestId, 'Request'),
      accessToken: requiredString(input.accessToken, 'Access token'),
    }
  })
  .handler(async ({ data }) => {
    const live = await import('./marketplace.server')
    return live.listProposalsForRequest(data.requestId, data.accessToken)
  })

export const acceptProposalFn = createServerFn({ method: 'POST' })
  .validator((data: unknown) => {
    const input = asRecord(data)
    return {
      proposalId: requiredString(input.proposalId, 'Proposal'),
      accessToken: requiredString(input.accessToken, 'Access token'),
    }
  })
  .handler(async ({ data }) => {
    const live = await import('./marketplace.server')
    return live.acceptProposal(data.proposalId, data.accessToken)
  })

export const listChefDashboardFn = createServerFn({ method: 'POST' }).handler(async () => {
  const { requireActiveChefSession } = await import('./auth-session.server')
  const session = await requireActiveChefSession()
  const live = await import('./marketplace.server')
  return live.listChefDashboard(session.slug)
})

export const getChefSessionFn = createServerFn({ method: 'POST' }).handler(async () => {
  const { getActiveChefSession } = await import('./auth-session.server')
  return getActiveChefSession()
})

export const chefLoginFn = createServerFn({ method: 'POST' })
  .validator((data: unknown) => {
    const input = asRecord(data)
    return {
      email: requiredString(input.email, 'Email'),
      password: requiredString(input.password, 'Password'),
    }
  })
  .handler(async ({ data }) => {
    const auth = await import('./auth-session.server')
    const session = await auth.authenticateChef(data.email, data.password)
    auth.issueChefSession(session)
    return session
  })

export const chefLogoutFn = createServerFn({ method: 'POST' }).handler(async () => {
  const { clearChefSession } = await import('./auth-session.server')
  clearChefSession()
  return { ok: true as const }
})

export const updateBookingStatusFn = createServerFn({ method: 'POST' })
  .validator((data: unknown) => {
    const input = asRecord(data)
    const status = requiredString(input.status, 'Status')
    if (!bookingStatuses.includes(status as BookingStatus)) {
      throw new Error('Unknown booking status.')
    }
    return {
      bookingId: requiredString(input.bookingId, 'Booking'),
      status: status as BookingStatus,
    }
  })
  .handler(async ({ data }) => {
    const { requireActiveChefSession } = await import('./auth-session.server')
    const session = await requireActiveChefSession()
    const live = await import('./marketplace.server')
    return live.updateBookingStatus(data.bookingId, data.status, session.slug)
  })

export const marketplaceRepository: MarketplaceRepository = {
  createInquiry: (input) => createInquiryFn({ data: input }),
  createRequest: (input) => createRequestFn({ data: input }),
  createProposal: (input) => createProposalFn({ data: input }),
  listProposalsForRequest: (requestId, accessToken) =>
    listProposalsForRequestFn({ data: { requestId, accessToken } }),
  acceptProposal: (proposalId, accessToken) =>
    acceptProposalFn({ data: { proposalId, accessToken } }),
  quoteInquiry: (inquiryId, quotedPrice) =>
    quoteInquiryFn({ data: { inquiryId, quotedPrice } }),
  listChefDashboard: () => listChefDashboardFn(),
  updateBookingStatus: (bookingId, status) =>
    updateBookingStatusFn({ data: { bookingId, status } }),
}
