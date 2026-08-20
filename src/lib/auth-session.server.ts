import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { getCookie, setCookie, deleteCookie } from '@tanstack/react-start/server'
import { sql } from './db.server'
import type { ChefSession } from './marketplace/types'

export type { ChefSession }

const CHEF_COOKIE = 'girki_chef_session'
const SESSION_DAYS = 14

function sessionSecret() {
  const secret = process.env.CHEF_SESSION_SECRET ?? process.env.TWILIO_AUTH_TOKEN
  if (!secret) {
    throw new Error('CHEF_SESSION_SECRET is not configured.')
  }
  return secret
}

function sign(payload: string) {
  return createHmac('sha256', sessionSecret()).update(payload).digest('base64url')
}

function encodeSession(session: ChefSession, expiresAt: number) {
  const body = Buffer.from(
    JSON.stringify({
      chefId: session.chefId,
      slug: session.slug,
      displayName: session.displayName,
      email: session.email,
      exp: expiresAt,
    }),
  ).toString('base64url')
  return `${body}.${sign(body)}`
}

function decodeSession(token: string): ChefSession | null {
  const [body, signature] = token.split('.')
  if (!body || !signature) return null
  const expected = sign(body)
  const left = Buffer.from(signature)
  const right = Buffer.from(expected)
  if (left.length !== right.length || !timingSafeEqual(left, right)) return null
  try {
    const parsed = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as {
      chefId?: string
      slug?: string
      displayName?: string
      email?: string
      exp?: number
    }
    if (!parsed.chefId || !parsed.slug || !parsed.exp || parsed.exp < Date.now()) return null
    return {
      chefId: parsed.chefId,
      slug: parsed.slug,
      displayName: parsed.displayName ?? parsed.slug,
      email: parsed.email ?? '',
    }
  } catch {
    return null
  }
}

export function hashPassword(password: string, salt = randomBytes(16).toString('hex')) {
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(':')
  if (!salt || !hash) return false
  const next = scryptSync(password, salt, 64).toString('hex')
  const left = Buffer.from(hash, 'hex')
  const right = Buffer.from(next, 'hex')
  if (left.length !== right.length) return false
  return timingSafeEqual(left, right)
}

export function hashAccessToken(token: string) {
  return createHmac('sha256', sessionSecret()).update(token).digest('hex')
}

export function createAccessToken() {
  return randomBytes(32).toString('base64url')
}

export function readChefSession(): ChefSession | null {
  const token = getCookie(CHEF_COOKIE)
  if (!token) return null
  return decodeSession(token)
}

export function requireChefSession(): ChefSession {
  const session = readChefSession()
  if (!session) throw new Error('Unauthorized. Sign in as a chef to continue.')
  return session
}

export function issueChefSession(session: ChefSession) {
  const expiresAt = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000
  setCookie(CHEF_COOKIE, encodeSession(session, expiresAt), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  })
}

export function clearChefSession() {
  deleteCookie(CHEF_COOKIE, { path: '/' })
}

export async function authenticateChef(email: string, password: string): Promise<ChefSession> {
  const normalized = email.trim().toLowerCase()
  if (!normalized || !password) throw new Error('Email and password are required.')

  // Keep Nana's portal password in sync from env when present.
  if (process.env.CHEF_NANA_EMAIL && process.env.CHEF_NANA_PASSWORD) {
    const nanaEmail = process.env.CHEF_NANA_EMAIL.trim().toLowerCase()
    if (normalized === nanaEmail) {
      await sql`
        insert into private.chef_contacts (chef_id, email, password_hash, whatsapp_e164)
        select
          id,
          ${process.env.CHEF_NANA_EMAIL.trim()},
          ${hashPassword(process.env.CHEF_NANA_PASSWORD)},
          ${process.env.CHEF_NANA_WHATSAPP ? process.env.CHEF_NANA_WHATSAPP : null}
        from public.chef_profiles
        where slug = 'nana'
        on conflict (chef_id) do update set
          email = excluded.email,
          password_hash = excluded.password_hash,
          whatsapp_e164 = coalesce(excluded.whatsapp_e164, private.chef_contacts.whatsapp_e164),
          updated_at = now()
      `
    }
  }

  const rows = await sql<
    Array<{
      chef_id: string | number
      slug: string
      display_name: string
      email: string | null
      password_hash: string | null
    }>
  >`
    select
      c.id as chef_id,
      c.slug,
      c.display_name,
      t.email,
      t.password_hash
    from private.chef_contacts t
    join public.chef_profiles c on c.id = t.chef_id
    where lower(coalesce(t.email, '')) = ${normalized}
    limit 1
  `

  const row = rows[0]
  if (!row?.password_hash || !verifyPassword(password, row.password_hash)) {
    throw new Error('Invalid email or password.')
  }

  return {
    chefId: String(row.chef_id),
    slug: row.slug,
    displayName: row.display_name,
    email: row.email ?? normalized,
  }
}
