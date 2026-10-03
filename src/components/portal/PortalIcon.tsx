export const portalIconSrc = {
  bookings: '/icons/portal/bookings.png',
  calendar: '/icons/portal/calendar.png',
  chefs: '/icons/portal/chefs.png',
  earnings: '/icons/portal/earnings.png',
  guests: '/icons/portal/guests.png',
  home: '/icons/portal/home.png',
  inquiries: '/icons/portal/inquiries.png',
  menus: '/icons/portal/menus.png',
  messages: '/icons/portal/messages.png',
  payments: '/icons/portal/payments.png',
  profile: '/icons/portal/profile.png',
  proposals: '/icons/portal/proposals.png',
  requests: '/icons/portal/requests.png',
  reviews: '/icons/portal/reviews.png',
  settings: '/icons/portal/settings.png',
  support: '/icons/portal/support.png',
  verification: '/icons/portal/verification.png',
} as const

export type PortalIconName = keyof typeof portalIconSrc

export default function PortalIcon({
  name,
  size = 22,
  className = '',
}: {
  name: PortalIconName
  size?: number
  className?: string
}) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 bg-current ${className}`}
      style={{
        width: size,
        height: size,
        WebkitMaskImage: `url(${portalIconSrc[name]})`,
        maskImage: `url(${portalIconSrc[name]})`,
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
      }}
    />
  )
}
