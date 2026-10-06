export function money(amount: number, currency = 'GHS') {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function statusLabel(status: string) {
  return status.replaceAll('_', ' ')
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'G'
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

export function matchesQuery(haystack: string, query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return haystack.toLowerCase().includes(q)
}

export function eventDateParts(eventDate: string) {
  if (!eventDate) return { day: '-', month: '' }
  const parsed = new Date(`${eventDate}T12:00:00`)
  if (Number.isNaN(parsed.getTime())) return { day: eventDate, month: '' }
  return {
    day: String(parsed.getDate()),
    month: parsed.toLocaleDateString('en-US', { month: 'short' }),
  }
}

export function compactMoney(amount: number, currency = 'GHS') {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency,
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount)
}

export function hoursAgo(iso: string) {
  const hours = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 3_600_000))
  if (hours < 1) return 'just now'
  if (hours === 1) return '1 hour ago'
  if (hours < 48) return `${hours} hours ago`
  return `${Math.round(hours / 24)} days ago`
}

export function statusTone(status: string) {
  if (status === 'confirmed' || status === 'in_progress' || status === 'quoted' || status === 'accepted') {
    return 'bg-emerald-400/12 text-emerald-300'
  }
  if (status === 'awaiting_payment' || status === 'new' || status === 'open' || status === 'submitted') {
    return 'bg-amber-300/12 text-amber-200'
  }
  return 'bg-white/8 text-portal-muted'
}
