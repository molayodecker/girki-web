import type {
  Booking,
  BookingStatus,
  ChefDashboardData,
  ChefProposal,
  ChefRequestRecord,
  DirectInquiry,
  NewChefProposal,
  NewChefRequest,
  NewDirectInquiry,
} from './types'

export interface MarketplaceRepository {
  createInquiry(input: NewDirectInquiry): Promise<DirectInquiry>
  createRequest(input: NewChefRequest): Promise<ChefRequestRecord>
  createProposal(input: NewChefProposal): Promise<ChefProposal>
  listProposalsForRequest(requestId: string): Promise<ChefProposal[]>
  acceptProposal(proposalId: string): Promise<Booking>
  quoteInquiry(inquiryId: string, quotedPrice: number): Promise<DirectInquiry>
  listChefDashboard(chefId: string): Promise<ChefDashboardData>
  updateBookingStatus(bookingId: string, status: BookingStatus): Promise<Booking>
}
