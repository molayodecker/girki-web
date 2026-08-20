export type Currency = 'GHS' | 'NGN' | 'KES' | 'ZAR' | 'USD'

export type ChefSession = {
  chefId: string
  slug: string
  displayName: string
  email: string
}

export type InquiryStatus =
  | 'new'
  | 'viewed'
  | 'quoted'
  | 'accepted'
  | 'declined'
  | 'converted'

export type RequestStatus =
  | 'open'
  | 'receiving_proposals'
  | 'chef_selected'
  | 'booked'
  | 'cancelled'

export type ProposalStatus =
  | 'submitted'
  | 'viewed'
  | 'shortlisted'
  | 'accepted'
  | 'declined'
  | 'withdrawn'

export type BookingStatus =
  | 'awaiting_payment'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'refunded'

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export type BookingSource = 'direct' | 'inquiry' | 'chef_request' | 'admin'

export type DirectInquiry = {
  id: string
  chefId: string
  customerName: string
  email: string
  phone: string
  eventDate: string
  guestCount: number
  occasion: string
  location: string
  budget: string
  message: string
  status: InquiryStatus
  quotedPrice?: number
  currency: Currency
  createdAt: string
}

export type ChefRequestRecord = {
  id: string
  customerName: string
  email: string
  phone: string
  city: string
  cuisine: string
  occasion: string
  serviceType: string
  guestSummary: string
  mealTime: string
  eventDate: string
  budget: string
  restrictions: string
  notes: string
  status: RequestStatus
  createdAt: string
}

export type ChefProposal = {
  id: string
  requestId: string
  chefId: string
  message: string
  proposedPrice: number
  currency: Currency
  menuDescription: string
  includedServices: string[]
  status: ProposalStatus
  createdAt: string
}

export type Booking = {
  id: string
  bookingNumber: string
  customerName: string
  email: string
  chefId: string
  source: BookingSource
  inquiryId?: string
  requestId?: string
  proposalId?: string
  eventDate: string
  guestSummary: string
  occasion: string
  location: string
  subtotal: number
  serviceFee: number
  total: number
  chefPayout: number
  currency: Currency
  paymentStatus: PaymentStatus
  bookingStatus: BookingStatus
  createdAt: string
}

export type NewDirectInquiry = Omit<
  DirectInquiry,
  'id' | 'status' | 'quotedPrice' | 'createdAt'
>

export type NewChefRequest = Omit<ChefRequestRecord, 'id' | 'status' | 'createdAt'>

export type NewChefProposal = Omit<ChefProposal, 'id' | 'status' | 'createdAt'>

export type ChefDashboardData = {
  inquiries: DirectInquiry[]
  openRequests: ChefRequestRecord[]
  proposals: ChefProposal[]
  bookings: Booking[]
  revenue: {
    available: number
    pending: number
    lifetime: number
    currency: Currency
  }
}
