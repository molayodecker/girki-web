import { type FormEvent, useState } from 'react'
import type { Chef } from '../data/marketplace'
import { marketplaceRepository } from '../lib/marketplace.functions'

const inputClass =
  'min-h-12 w-full rounded-2xl border border-ploy-border-primary bg-ploy-neutral-primary-s0 px-4 outline-none transition-colors focus:border-ploy-accent-tertiary'

export default function DirectInquiryForm({ chef }: { chef: Chef }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [guestCount, setGuestCount] = useState('2')
  const [occasion, setOccasion] = useState('Private dinner')
  const [location, setLocation] = useState('')
  const [budget, setBudget] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [confirmationId, setConfirmationId] = useState('')
  const [error, setError] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (!name || !email || !phone || !eventDate || !location) {
      setError('Please complete your contact details, event date, and location.')
      return
    }

    setSubmitting(true)
    try {
      const inquiry = await marketplaceRepository.createInquiry({
        chefId: chef.id,
        customerName: name,
        email,
        phone,
        eventDate,
        guestCount: Math.max(1, Number.parseInt(guestCount, 10) || 1),
        occasion,
        location,
        budget,
        message,
        currency: 'GHS',
      })
      setConfirmationId(inquiry.id)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to send this inquiry.')
    } finally {
      setSubmitting(false)
    }
  }

  if (confirmationId) {
    return (
      <div className="rounded-[2rem] border border-ploy-border-primary bg-ploy-neutral-primary-s0 p-7 sm:p-9">
        <p className="typography-eyebrow">Inquiry sent</p>
        <h2 className="display-title mt-4 text-3xl">{chef.name} has your request.</h2>
        <p className="mt-4 max-w-xl leading-relaxed text-ploy-text-secondary">
          We emailed {chef.name} and sent a WhatsApp copy. They can quote from the dashboard or by
          replying on WhatsApp with the amount and any notes.
        </p>
        <p className="mt-5 text-sm text-ploy-text-secondary">Reference: {confirmationId}</p>
      </div>
    )
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-[2rem] border border-ploy-border-primary bg-ploy-neutral-primary-s0 p-7 sm:p-9"
    >
      <p className="typography-eyebrow">Request to book</p>
      <h2 className="display-title mt-4 text-3xl">Tell {chef.name} about the table.</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ploy-text-secondary">
        This starts as an inquiry, not a charge. The chef can review the details and send a quote.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <label>
          <span className="typography-eyebrow mb-2 block">Name</span>
          <input value={name} onChange={(event) => setName(event.target.value)} className={inputClass} />
        </label>
        <label>
          <span className="typography-eyebrow mb-2 block">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={inputClass}
          />
        </label>
        <label>
          <span className="typography-eyebrow mb-2 block">Phone</span>
          <input
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className={inputClass}
          />
        </label>
        <label>
          <span className="typography-eyebrow mb-2 block">Event date</span>
          <input
            type="date"
            value={eventDate}
            onChange={(event) => setEventDate(event.target.value)}
            className={inputClass}
          />
        </label>
        <label>
          <span className="typography-eyebrow mb-2 block">Guests</span>
          <input
            type="number"
            min="1"
            value={guestCount}
            onChange={(event) => setGuestCount(event.target.value)}
            className={inputClass}
          />
        </label>
        <label>
          <span className="typography-eyebrow mb-2 block">Occasion</span>
          <input
            value={occasion}
            onChange={(event) => setOccasion(event.target.value)}
            className={inputClass}
          />
        </label>
        <label className="sm:col-span-2">
          <span className="typography-eyebrow mb-2 block">Location</span>
          <input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="East Legon, Accra"
            className={inputClass}
          />
        </label>
        <label className="sm:col-span-2">
          <span className="typography-eyebrow mb-2 block">Budget</span>
          <input
            value={budget}
            onChange={(event) => setBudget(event.target.value)}
            placeholder="e.g. GH₵2,500-3,500"
            className={inputClass}
          />
        </label>
        <label className="sm:col-span-2">
          <span className="typography-eyebrow mb-2 block">Notes</span>
          <textarea
            rows={5}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Menu ideas, dietary needs, timing, or anything the chef should know."
            className={`${inputClass} py-4`}
          />
        </label>
      </div>

      {error ? <p className="mt-5 text-sm text-ploy-accent-secondary">{error}</p> : null}

      <button type="submit" className="btn btn-primary mt-7 min-h-12 px-8" disabled={submitting}>
        {submitting ? 'Sending…' : 'Send inquiry'}
      </button>
    </form>
  )
}
