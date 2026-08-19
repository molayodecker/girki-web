import { sql } from './db.server'
import type { ChefRequestRecord, DirectInquiry } from './marketplace/types'

type ChefContact = {
  chefId: string
  slug: string
  displayName: string
  email: string
  whatsappE164: string
}

export type ParsedChefReply = {
  amount?: number
  notes: string
  ref?: { kind: 'I' | 'R'; id: string }
}

function appUrl() {
  return (process.env.APP_URL ?? 'http://localhost:3001').replace(/\/$/, '')
}

function mailFrom() {
  return process.env.MAIL_FROM ?? 'Girki <hello@trygirki.com>'
}

export function normalizeE164(value: string) {
  const trimmed = value.trim().replace(/^whatsapp:/i, '')
  const digits = trimmed.replace(/[^\d+]/g, '')
  if (digits.startsWith('+')) return `+${digits.slice(1).replace(/\D/g, '')}`
  if (digits.startsWith('00')) return `+${digits.slice(2)}`
  const local = digits.replace(/\D/g, '')
  if (local.startsWith('0') && local.length === 10) return `+233${local.slice(1)}`
  return local ? `+${local}` : ''
}

export function parseChefReply(body: string): ParsedChefReply {
  const refMatch = body.match(/\b(?:ref\s*)?([ir])(\d+)\b/i)
  const ref = refMatch
    ? { kind: refMatch[1].toUpperCase() as 'I' | 'R', id: refMatch[2] }
    : undefined
  const withoutRef = body.replace(/\b(?:ref\s*)?[ir]\d+\b/gi, ' ')
  const matches = [
    ...withoutRef.matchAll(/(?:gh(?:s)?\s*₵?\s*|₵\s*)?(\d{1,3}(?:,\d{3})+|\d+)(?:\.\d{1,2})?/gi),
  ]
  let amount: number | undefined
  for (const match of matches) {
    const value = Number(match[1].replace(/,/g, ''))
    if (!Number.isFinite(value)) continue
    if (value >= 2020 && value <= 2035) continue
    if (value >= 50) {
      amount = value
      break
    }
  }
  const notes = withoutRef
    .replace(/(?:gh(?:s)?\s*₵?\s*|₵\s*)?\d{1,3}(?:,\d{3})+(?:\.\d{1,2})?/gi, ' ')
    .replace(/(?:gh(?:s)?\s*₵?\s*|₵\s*)?\d+(?:\.\d{1,2})?/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return { amount, notes, ref }
}

async function upsertNanaFromEnv() {
  const email = process.env.CHEF_NANA_EMAIL?.trim() ?? ''
  const whatsapp = process.env.CHEF_NANA_WHATSAPP
    ? normalizeE164(process.env.CHEF_NANA_WHATSAPP)
    : ''
  if (!email && !whatsapp) return
  await sql`
    insert into private.chef_contacts (chef_id, email, whatsapp_e164)
    select id, ${email || null}, ${whatsapp || null}
    from public.chef_profiles
    where slug = 'nana'
    on conflict (chef_id) do update set
      email = coalesce(excluded.email, private.chef_contacts.email),
      whatsapp_e164 = coalesce(excluded.whatsapp_e164, private.chef_contacts.whatsapp_e164),
      updated_at = now()
  `
}

async function contactForSlug(slug: string): Promise<ChefContact | null> {
  if (slug === 'nana') await upsertNanaFromEnv()
  const rows = await sql<
    Array<{
      chef_id: string | number
      slug: string
      display_name: string
      email: string | null
      whatsapp_e164: string | null
    }>
  >`
    select
      c.id as chef_id,
      c.slug,
      c.display_name,
      t.email,
      t.whatsapp_e164
    from public.chef_profiles c
    left join private.chef_contacts t on t.chef_id = c.id
    where c.slug = ${slug}
    limit 1
  `
  const row = rows[0]
  if (!row) return null
  return {
    chefId: String(row.chef_id),
    slug: row.slug,
    displayName: row.display_name,
    email: row.email ?? '',
    whatsappE164: row.whatsapp_e164 ?? '',
  }
}

async function contactsToNotify(preferredSlug?: string) {
  if (preferredSlug) {
    const contact = await contactForSlug(preferredSlug)
    return contact ? [contact] : []
  }
  await upsertNanaFromEnv()
  const rows = await sql<
    Array<{
      chef_id: string | number
      slug: string
      display_name: string
      email: string | null
      whatsapp_e164: string | null
    }>
  >`
    select
      c.id as chef_id,
      c.slug,
      c.display_name,
      t.email,
      t.whatsapp_e164
    from public.chef_profiles c
    join private.chef_contacts t on t.chef_id = c.id
    where coalesce(t.email, '') <> '' or coalesce(t.whatsapp_e164, '') <> ''
  `
  return rows.map((row) => ({
    chefId: String(row.chef_id),
    slug: row.slug,
    displayName: row.display_name,
    email: row.email ?? '',
    whatsappE164: row.whatsapp_e164 ?? '',
  }))
}

async function recordNotice(input: {
  chefId: string
  inquiryId?: string
  requestId?: string
  channel: 'email' | 'whatsapp'
  direction: 'outbound' | 'inbound'
  destination?: string
  body: string
  parsedAmount?: number
  provider?: string
  providerMessageId?: string
}) {
  await sql`
    insert into private.chef_notices (
      chef_id, inquiry_id, request_id, channel, direction, destination, body,
      parsed_amount, provider, provider_message_id
    ) values (
      ${input.chefId},
      ${input.inquiryId ?? null},
      ${input.requestId ?? null},
      ${input.channel},
      ${input.direction},
      ${input.destination ?? null},
      ${input.body},
      ${input.parsedAmount ?? null},
      ${input.provider ?? null},
      ${input.providerMessageId ?? null}
    )
  `
}

function inquiryMessage(inquiry: DirectInquiry, chefName: string) {
  const ref = `I${inquiry.id}`
  return [
    `New Girki inquiry for ${chefName}`,
    '',
    `Guest: ${inquiry.customerName}`,
    `Occasion: ${inquiry.occasion}`,
    `When: ${inquiry.eventDate || 'Date TBC'}`,
    `Guests: ${inquiry.guestCount}`,
    `Where: ${inquiry.location}`,
    `Budget: ${inquiry.budget || 'Not specified'}`,
    inquiry.message ? `\n${inquiry.message}` : '',
    '',
    'Reply with your quote amount and any notes, for example:',
    '2500 Includes shopping, cooking, and cleanup',
    '',
    `You can also quote from ${appUrl()}/chef-dashboard`,
    `Ref ${ref}`,
  ]
    .filter((line) => line !== undefined)
    .join('\n')
}

function requestMessage(request: ChefRequestRecord, chefName: string) {
  const ref = `R${request.id}`
  return [
    `New Girki chef request for ${chefName}`,
    '',
    `Guest: ${request.customerName}`,
    `Occasion: ${request.occasion}`,
    `When: ${request.eventDate || 'Date TBC'} ${request.mealTime}`.trim(),
    `Guests: ${request.guestSummary}`,
    `Where: ${request.city}`,
    `Cuisine: ${request.cuisine || 'Any'}`,
    `Service: ${request.serviceType}`,
    `Budget: ${request.budget || 'Not specified'}`,
    request.notes ? `\n${request.notes}` : '',
    request.restrictions ? `Notes: ${request.restrictions}` : '',
    '',
    'Reply with your quote amount and any notes, for example:',
    '2500 Includes shopping, cooking, and cleanup',
    '',
    `You can also quote from ${appUrl()}/chef-dashboard`,
    `Ref ${ref}`,
  ]
    .filter((line) => line !== undefined)
    .join('\n')
}

async function sendEmail(to: string, subject: string, text: string) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey || !to) {
    console.info('[chef-notify] Skipping email; set RESEND_API_KEY and CHEF_NANA_EMAIL.')
    return { skipped: true as const }
  }
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: mailFrom(),
      to: [to],
      subject,
      text,
    }),
  })
  if (!response.ok) {
    const detail = await response.text()
    throw new Error(`Email send failed: ${detail.slice(0, 300)}`)
  }
  const payload = (await response.json()) as { id?: string }
  return { skipped: false as const, id: payload.id ?? '' }
}

async function sendWhatsApp(toE164: string, body: string) {
  const sid = process.env.TWILIO_ACCOUNT_SID
  const token = process.env.TWILIO_AUTH_TOKEN
  const from = process.env.TWILIO_WHATSAPP_FROM
  if (!sid || !token || !from || !toE164) {
    console.info('[chef-notify] Skipping WhatsApp; set TWILIO_* and CHEF_NANA_WHATSAPP.')
    return { skipped: true as const }
  }
  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: from.startsWith('whatsapp:') ? from : `whatsapp:${from}`,
        To: `whatsapp:${toE164}`,
        Body: body,
      }),
    },
  )
  if (!response.ok) {
    const detail = await response.text()
    throw new Error(`WhatsApp send failed: ${detail.slice(0, 300)}`)
  }
  const payload = (await response.json()) as { sid?: string }
  return { skipped: false as const, id: payload.sid ?? '' }
}

async function notifyContact(
  contact: ChefContact,
  input: {
    subject: string
    body: string
    inquiryId?: string
    requestId?: string
  },
) {
  if (contact.email) {
    try {
      const sent = await sendEmail(contact.email, input.subject, input.body)
      await recordNotice({
        chefId: contact.chefId,
        inquiryId: input.inquiryId,
        requestId: input.requestId,
        channel: 'email',
        direction: 'outbound',
        destination: contact.email,
        body: input.body,
        provider: sent.skipped ? 'skipped' : 'resend',
        providerMessageId: sent.skipped ? undefined : sent.id,
      })
    } catch (error) {
      console.error('Chef email notify failed', error)
    }
  }

  if (contact.whatsappE164) {
    try {
      const sent = await sendWhatsApp(contact.whatsappE164, input.body)
      await recordNotice({
        chefId: contact.chefId,
        inquiryId: input.inquiryId,
        requestId: input.requestId,
        channel: 'whatsapp',
        direction: 'outbound',
        destination: contact.whatsappE164,
        body: input.body,
        provider: sent.skipped ? 'skipped' : 'twilio',
        providerMessageId: sent.skipped ? undefined : sent.id,
      })
    } catch (error) {
      console.error('Chef WhatsApp notify failed', error)
    }
  }
}

export async function notifyInquiry(inquiry: DirectInquiry) {
  const contacts = await contactsToNotify(inquiry.chefId)
  await Promise.all(
    contacts.map((contact) =>
      notifyContact(contact, {
        subject: `New Girki inquiry from ${inquiry.customerName}`,
        body: inquiryMessage(inquiry, contact.displayName),
        inquiryId: inquiry.id,
      }),
    ),
  )
}

export async function notifyRequest(request: ChefRequestRecord) {
  const contacts = await contactsToNotify()
  await Promise.all(
    contacts.map((contact) =>
      notifyContact(contact, {
        subject: `New Girki chef request from ${request.customerName}`,
        body: requestMessage(request, contact.displayName),
        requestId: request.id,
      }),
    ),
  )
}

async function latestOpenTarget(chefId: string, parsed: ParsedChefReply) {
  if (parsed.ref?.kind === 'I') return { inquiryId: parsed.ref.id }
  if (parsed.ref?.kind === 'R') return { requestId: parsed.ref.id }

  const rows = await sql<
    Array<{ inquiry_id: string | number | null; request_id: string | number | null }>
  >`
    select inquiry_id, request_id
    from private.chef_notices
    where chef_id = ${chefId}
      and direction = 'outbound'
    order by created_at desc
    limit 1
  `
  const latest = rows[0]
  if (latest?.inquiry_id != null) return { inquiryId: String(latest.inquiry_id) }
  if (latest?.request_id != null) return { requestId: String(latest.request_id) }
  return {}
}

async function chefByWhatsApp(fromE164: string) {
  await upsertNanaFromEnv()
  const rows = await sql<
    Array<{ chef_id: string | number; slug: string; display_name: string }>
  >`
    select c.id as chef_id, c.slug, c.display_name
    from private.chef_contacts t
    join public.chef_profiles c on c.id = t.chef_id
    where t.whatsapp_e164 = ${fromE164}
    limit 1
  `
  const row = rows[0]
  if (!row) return null
  return { chefId: String(row.chef_id), slug: row.slug, displayName: row.display_name }
}

export async function applyWhatsAppReply(from: string, body: string) {
  const fromE164 = normalizeE164(from)
  const parsed = parseChefReply(body)
  const chef = await chefByWhatsApp(fromE164)
  if (!chef) {
    return {
      reply: '',
      ignored: true as const,
    }
  }

  await recordNotice({
    chefId: chef.chefId,
    inquiryId: parsed.ref?.kind === 'I' ? parsed.ref.id : undefined,
    requestId: parsed.ref?.kind === 'R' ? parsed.ref.id : undefined,
    channel: 'whatsapp',
    direction: 'inbound',
    destination: fromE164,
    body,
    parsedAmount: parsed.amount,
    provider: 'twilio',
  })

  if (!parsed.amount) {
    return {
      reply:
        'I need a quote amount, for example: 2500 Includes shopping, cooking, and cleanup',
      ignored: false as const,
    }
  }

  const target = await latestOpenTarget(chef.chefId, parsed)
  const notes = parsed.notes || 'Quoted via WhatsApp'

  if (target.inquiryId) {
    const { quoteInquiry } = await import('./marketplace.server')
    await quoteInquiry(target.inquiryId, parsed.amount)
    return {
      reply: `Got it — GH₵${parsed.amount} is now live for the guest. You can still update it from ${appUrl()}/chef-dashboard`,
      ignored: false as const,
    }
  }

  if (target.requestId) {
    const { createProposal } = await import('./marketplace.server')
    await createProposal({
      requestId: target.requestId,
      chefId: chef.slug,
      message: notes,
      proposedPrice: parsed.amount,
      currency: 'GHS',
      menuDescription: notes,
      includedServices: ['Menu design', 'Grocery sourcing', 'Cooking', 'Kitchen cleanup'],
    })
    return {
      reply: `Got it — GH₵${parsed.amount} is now live for the guest. You can still update it from ${appUrl()}/chef-dashboard`,
      ignored: false as const,
    }
  }

  return {
    reply:
      'I have the amount, but I could not match it to an open request. Quote from the dashboard or include the Ref from the original message.',
    ignored: false as const,
  }
}
