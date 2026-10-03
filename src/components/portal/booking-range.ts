export const bookingWhenValues = ['today', 'tomorrow', 'week', 'all', 'past'] as const

export type BookingWhen = (typeof bookingWhenValues)[number]

export function parseBookingWhen(value: unknown): BookingWhen {
  if (typeof value === 'string' && bookingWhenValues.includes(value as BookingWhen)) {
    return value as BookingWhen
  }
  return 'all'
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
}

function parseEventDay(eventDate: string) {
  if (!eventDate) return null
  const parsed = new Date(`${eventDate}T12:00:00`)
  if (Number.isNaN(parsed.getTime())) return null
  return startOfDay(parsed)
}

export function formatShortDate(date = new Date()) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function formatLongDate(date = new Date()) {
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

export function formatWeekCard(eventDate: string) {
  const parsed = new Date(`${eventDate}T12:00:00`)
  if (Number.isNaN(parsed.getTime())) return eventDate || 'Date TBC'
  return parsed
    .toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
    .toUpperCase()
}

export function isToday(eventDate: string) {
  return bookingWhenMatches(eventDate, 'today')
}

export function isThisWeekAfterToday(eventDate: string) {
  if (bookingWhenMatches(eventDate, 'today')) return false
  return bookingWhenMatches(eventDate, 'week')
}

export function bookingWhenMatches(eventDate: string, when: BookingWhen) {
  const eventDay = parseEventDay(eventDate)
  const today = startOfDay(new Date())

  if (when === 'past') {
    return eventDay != null && eventDay < today
  }

  if (eventDay == null) return when === 'all'

  if (when === 'today') return eventDay === today

  if (when === 'tomorrow') {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return eventDay === startOfDay(tomorrow)
  }

  if (when === 'week') {
    const end = new Date()
    end.setDate(end.getDate() + 7)
    return eventDay >= today && eventDay < startOfDay(end)
  }

  return eventDay >= today
}
