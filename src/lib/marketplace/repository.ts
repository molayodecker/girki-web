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

export type ChefRequestWithAccess = ChefRequestRecord & { accessToken: string }

export interface MarketplaceRepository {
  createInquiry(input: NewDirectInquiry): Promise<DirectInquiry>
  createRequest(input: NewChefRequest): Promise<ChefRequestWithAccess>
  createProposal(
    input: Omit<NewChefProposal, 'chefId' | 'currency'> & {
      message: string
      proposedPrice: number
      requestId: string
      menuDescription?: string
      includedServices?: string[]
    },
  ): Promise<ChefProposal>
  listProposalsForRequest(requestId: string, accessToken: string): Promise<ChefProposal[]>
  acceptProposal(proposalId: string, accessToken: string): Promise<Booking>
  quoteInquiry(inquiryId: string, quotedPrice: number): Promise<DirectInquiry>
  listChefDashboard(): Promise<ChefDashboardData>
  updateBookingStatus(bookingId: string, status: BookingStatus): Promise<Booking>
}
