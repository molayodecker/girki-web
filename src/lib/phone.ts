import { parsePhoneNumberFromString } from 'libphonenumber-js'

/** Normalize to E.164 for storage and SMS providers. */
export function normalizePhone(value: string) {
  const phone = parsePhoneNumberFromString(value)
  if (!phone || !phone.isValid()) {
    throw new Error('Enter a valid phone number.')
  }
  return phone.number
}
