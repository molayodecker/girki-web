import { createHmac, timingSafeEqual } from 'node:crypto'

const SUMSUB_BASE = process.env.SUMSUB_API_URL?.replace(/\/$/, '') || 'https://api.sumsub.com'

function requireAppToken() {
  const token = process.env.SUMSUB_APP_TOKEN
  if (!token) throw new Error('SUMSUB_APP_TOKEN is not configured.')
  if (process.env.NODE_ENV !== 'production' && !token.startsWith('sbx:')) {
    throw new Error('Use a Sumsub sandbox App Token (sbx:…) while developing.')
  }
  return token
}

function requireSecretKey() {
  const secret = process.env.SUMSUB_SECRET_KEY
  if (!secret) throw new Error('SUMSUB_SECRET_KEY is not configured.')
  return secret
}

export function chefSumsubLevelName() {
  return process.env.SUMSUB_CHEF_LEVEL_NAME?.trim() || 'id-and-liveness'
}

function sign(ts: string, method: string, pathWithQuery: string, body = '') {
  const payload = `${ts}${method.toUpperCase()}${pathWithQuery}${body}`
  return createHmac('sha256', requireSecretKey()).update(payload).digest('hex')
}

export async function sumsubRequest(
  method: string,
  pathWithQuery: string,
  body?: string,
) {
  const ts = Math.floor(Date.now() / 1000).toString()
  const bodyText = body ?? ''
  const signature = sign(ts, method, pathWithQuery, bodyText)

  const response = await fetch(`${SUMSUB_BASE}${pathWithQuery}`, {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-App-Token': requireAppToken(),
      'X-App-Access-Ts': ts,
      'X-App-Access-Sig': signature,
    },
    body: bodyText || undefined,
  })

  const text = await response.text()
  let json: unknown = null
  try {
    json = text ? JSON.parse(text) : null
  } catch {
    json = { raw: text }
  }

  if (!response.ok) {
    const message =
      typeof json === 'object' &&
      json &&
      'description' in json &&
      typeof (json as { description: unknown }).description === 'string'
        ? (json as { description: string }).description
        : `Sumsub request failed (${response.status})`
    throw new Error(message)
  }

  return json
}

export async function mintChefAccessToken(externalUserId: string) {
  const levelName = encodeURIComponent(chefSumsubLevelName())
  const userId = encodeURIComponent(externalUserId)
  const path = `/resources/accessTokens?userId=${userId}&levelName=${levelName}&ttlInSecs=600`
  const data = (await sumsubRequest('POST', path)) as { token?: string; userId?: string }
  if (!data.token) throw new Error('Sumsub did not return an access token.')
  return { token: data.token, userId: data.userId ?? externalUserId, levelName: chefSumsubLevelName() }
}

const ALG_MAP: Record<string, string> = {
  HMAC_SHA1_HEX: 'sha1',
  HMAC_SHA256_HEX: 'sha256',
  HMAC_SHA512_HEX: 'sha512',
}

export function verifySumsubWebhook(rawBody: Buffer, digestHex: string | null, algHeader: string | null) {
  const secret = process.env.SUMSUB_WEBHOOK_SECRET
  if (!secret) throw new Error('SUMSUB_WEBHOOK_SECRET is not configured.')

  const alg = ALG_MAP[algHeader || 'HMAC_SHA256_HEX']
  if (!alg || !digestHex) return false

  const actual = createHmac(alg, secret).update(rawBody).digest('hex')
  const left = Buffer.from(actual, 'hex')
  const right = Buffer.from(digestHex, 'hex')
  if (left.length !== right.length) return false
  return timingSafeEqual(left, right)
}

export type SumsubWebhookEvent = {
  type?: string
  applicantId?: string
  externalUserId?: string
  reviewResult?: {
    reviewAnswer?: string
    reviewRejectType?: string
    rejectLabels?: string[]
  }
}
