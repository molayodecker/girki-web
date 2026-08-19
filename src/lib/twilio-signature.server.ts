import { createHmac, timingSafeEqual } from 'node:crypto'

export function twilioSignatureIsValid(
  url: string,
  params: Record<string, string>,
  signature: string,
) {
  const token = process.env.TWILIO_AUTH_TOKEN
  if (!token || !signature) return false
  const data =
    url +
    Object.keys(params)
      .sort()
      .map((key) => key + params[key])
      .join('')
  const expected = createHmac('sha1', token).update(data, 'utf8').digest('base64')
  const actual = Buffer.from(signature)
  const want = Buffer.from(expected)
  if (actual.length !== want.length) return false
  return timingSafeEqual(actual, want)
}
