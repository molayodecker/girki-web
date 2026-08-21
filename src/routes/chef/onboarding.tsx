import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import SumsubWebSdk from '../../components/chef/SumsubWebSdk'
import PageShell, { PageIntro } from '../../components/layout/PageShell'
import {
  getAuthProfileFn,
  saveChefPricingStepFn,
  saveChefProfileStepFn,
  saveChefServicesStepFn,
  saveChefVerificationStepFn,
  startChefApplicationFn,
  submitChefApplicationFn,
} from '../../lib/auth.functions'
import {
  chefPersonalSchema,
  chefProfileSchema,
  type ChefPersonalValues,
  type ChefProfileValues,
} from '../../lib/validation/auth'

export const Route = createFileRoute('/chef/onboarding')({
  component: ChefOnboardingPage,
})

const SERVICE_OPTIONS = [
  { slug: 'private-dinner', label: 'Private Dinner' },
  { slug: 'date-night', label: 'Date Night' },
  { slug: 'weekly-meal-prep', label: 'Weekly Meal Prep' },
  { slug: 'parties-celebrations', label: 'Parties & Celebrations' },
  { slug: 'wedding', label: 'Weddings' },
  { slug: 'corporate-event', label: 'Corporate Events' },
  { slug: 'vacation-chef', label: 'Vacation Chef' },
] as const

type Step =
  | 'personal'
  | 'profile'
  | 'services'
  | 'pricing'
  | 'verification'
  | 'submit'
  | 'done'

function ChefOnboardingPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('personal')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [phone, setPhone] = useState<string | undefined>()
  const [kycSubmitted, setKycSubmitted] = useState(false)

  useEffect(() => {
    void getAuthProfileFn()
      .then((profile) => {
        if (!profile) {
          void navigate({ to: '/sign-in', search: { intent: 'chef' } })
          return
        }
        setPhone(profile.phone ?? undefined)
        if (profile.chefApplication?.onboardingStatus === 'submitted') {
          setStep('done')
        } else if (profile.chefApplication) {
          const map: Record<string, Step> = {
            started: 'profile',
            profile: 'services',
            services: 'pricing',
            pricing: 'verification',
            verification: 'submit',
            submitted: 'done',
            completed: 'done',
          }
          setStep(map[profile.chefApplication.onboardingStatus] ?? 'personal')
        }
      })
      .catch(() => navigate({ to: '/sign-in', search: { intent: 'chef' } }))
      .finally(() => setLoading(false))
  }, [navigate])

  if (loading) {
    return (
      <PageShell tone="sand">
        <main className="section-pad text-ploy-text-secondary">Loading onboarding…</main>
      </PageShell>
    )
  }

  return (
    <PageShell tone="sand">
      <main className="section-pad">
        <div className="mx-auto max-w-2xl">
          <PageIntro
            eyebrow="Chef onboarding"
            title="Build your Girki kitchen."
            copy="Verify identity with Sumsub, then Girki reviews your profile before you go live. Roles stay server-controlled — this never sets you to verified from the browser."
          />

          <ol className="mt-8 flex flex-wrap gap-2 text-xs uppercase tracking-[0.08em] text-ploy-text-secondary">
            {(['personal', 'profile', 'services', 'pricing', 'verification', 'submit'] as Step[]).map(
              (item) => (
                <li
                  key={item}
                  className={`rounded-full border px-3 py-1 ${
                    step === item
                      ? 'border-ploy-accent-tertiary text-ploy-text-primary'
                      : 'border-ploy-border-primary'
                  }`}
                >
                  {item}
                </li>
              ),
            )}
          </ol>

          {error ? <p className="mt-6 text-sm text-ploy-accent-secondary">{error}</p> : null}

          <div className="mt-8 rounded-[1.8rem] border border-ploy-border-primary bg-ploy-neutral-primary-s0 p-6 sm:p-8">
            {step === 'personal' ? (
              <PersonalStep
                onDone={async (values) => {
                  setError('')
                  try {
                    await startChefApplicationFn({
                      data: {
                        displayName: values.fullName,
                        city: values.city,
                        country: values.country,
                        email: values.email ?? '',
                      },
                    })
                    setStep('profile')
                  } catch (err) {
                    setError(err instanceof Error ? err.message : 'Unable to start application.')
                  }
                }}
              />
            ) : null}

            {step === 'profile' ? (
              <ProfileStep
                onDone={async (values) => {
                  setError('')
                  try {
                    await saveChefProfileStepFn({ data: values })
                    setStep('services')
                  } catch (err) {
                    setError(err instanceof Error ? err.message : 'Unable to save profile.')
                  }
                }}
              />
            ) : null}

            {step === 'services' ? (
              <ServicesStep
                onDone={async (services) => {
                  setError('')
                  try {
                    await saveChefServicesStepFn({ data: { services } })
                    setStep('pricing')
                  } catch (err) {
                    setError(err instanceof Error ? err.message : 'Unable to save services.')
                  }
                }}
              />
            ) : null}

            {step === 'pricing' ? (
              <PricingStep
                onDone={async (values) => {
                  setError('')
                  try {
                    await saveChefPricingStepFn({ data: values })
                    setStep('verification')
                  } catch (err) {
                    setError(err instanceof Error ? err.message : 'Unable to save pricing.')
                  }
                }}
              />
            ) : null}

            {step === 'verification' ? (
              <div className="space-y-6">
                <div>
                  <h2 className="font-heading text-2xl tracking-tight">Identity verification</h2>
                  <p className="mt-2 text-sm text-ploy-text-secondary">
                    Upload a government ID and complete the selfie check. Approval comes from
                    Sumsub webhooks on the server — not from this browser session.
                  </p>
                </div>
                <SumsubWebSdk
                  phone={phone}
                  onSubmitted={() => {
                    setKycSubmitted(true)
                    void saveChefVerificationStepFn({
                      data: { idNotes: 'Submitted via Sumsub WebSDK', references: '' },
                    }).catch(() => undefined)
                  }}
                  onError={setError}
                />
                <button
                  type="button"
                  className="btn btn-primary min-h-11"
                  disabled={!kycSubmitted}
                  onClick={() => setStep('submit')}
                >
                  Continue
                </button>
              </div>
            ) : null}

            {step === 'submit' ? (
              <div className="space-y-5">
                <h2 className="font-heading text-2xl tracking-tight">Submit application</h2>
                <p className="text-sm text-ploy-text-secondary">
                  We’ll keep your profile in draft until Girki activates it. Sumsub must return
                  GREEN before you can be published.
                </p>
                <button
                  type="button"
                  className="btn btn-primary min-h-11"
                  onClick={() => {
                    void submitChefApplicationFn()
                      .then(() => setStep('done'))
                      .catch((err: unknown) => {
                        setError(err instanceof Error ? err.message : 'Unable to submit.')
                      })
                  }}
                >
                  Submit chef application
                </button>
              </div>
            ) : null}

            {step === 'done' ? (
              <div className="space-y-5">
                <h2 className="font-heading text-2xl tracking-tight">Application received</h2>
                <p className="text-sm text-ploy-text-secondary">
                  Identity checks run through Sumsub. Once verified and activated by Girki, you can
                  quote from the chef portal.
                </p>
                <Link to="/" className="btn btn-primary inline-flex min-h-11">
                  Back home
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </PageShell>
  )
}

function PersonalStep({ onDone }: { onDone: (values: ChefPersonalValues) => Promise<void> }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChefPersonalValues>({
    resolver: zodResolver(chefPersonalSchema),
    defaultValues: { fullName: '', email: '', city: '', country: 'Ghana' },
  })

  return (
    <form className="space-y-4" onSubmit={handleSubmit((values) => void onDone(values))}>
      <h2 className="font-heading text-2xl tracking-tight">Personal information</h2>
      <Field label="Full name" error={errors.fullName?.message}>
        <input className="field" {...register('fullName')} />
      </Field>
      <Field label="Email (optional)" error={errors.email?.message}>
        <input type="email" className="field" {...register('email')} />
      </Field>
      <Field label="City" error={errors.city?.message}>
        <input className="field" {...register('city')} />
      </Field>
      <Field label="Country" error={errors.country?.message}>
        <input className="field" {...register('country')} />
      </Field>
      <button type="submit" className="btn btn-primary min-h-11" disabled={isSubmitting}>
        Continue
      </button>
    </form>
  )
}

function ProfileStep({ onDone }: { onDone: (values: ChefProfileValues) => Promise<void> }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChefProfileValues>({
    resolver: zodResolver(chefProfileSchema),
    defaultValues: {
      professionalName: '',
      yearsExperience: 1,
      bio: '',
      specialties: '',
    },
  })

  return (
    <form className="space-y-4" onSubmit={handleSubmit((values) => void onDone(values))}>
      <h2 className="font-heading text-2xl tracking-tight">Your chef profile</h2>
      <Field label="Professional name" error={errors.professionalName?.message}>
        <input className="field" {...register('professionalName')} />
      </Field>
      <Field label="Years of experience" error={errors.yearsExperience?.message}>
        <input
          type="number"
          className="field"
          {...register('yearsExperience', { valueAsNumber: true })}
        />
      </Field>
      <Field label="Bio" error={errors.bio?.message}>
        <textarea className="field min-h-28" {...register('bio')} />
      </Field>
      <Field label="Cuisine specialties" error={errors.specialties?.message}>
        <input className="field" placeholder="Ghanaian, seafood, …" {...register('specialties')} />
      </Field>
      <button type="submit" className="btn btn-primary min-h-11" disabled={isSubmitting}>
        Continue
      </button>
    </form>
  )
}

function ServicesStep({ onDone }: { onDone: (services: string[]) => Promise<void> }) {
  const [selected, setSelected] = useState<string[]>(['private-dinner'])
  const [busy, setBusy] = useState(false)

  return (
    <div className="space-y-5">
      <h2 className="font-heading text-2xl tracking-tight">Services</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {SERVICE_OPTIONS.map((service) => {
          const checked = selected.includes(service.slug)
          return (
            <label
              key={service.slug}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
                checked ? 'border-ploy-accent-tertiary' : 'border-ploy-border-primary'
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={(event) => {
                  setSelected((current) =>
                    event.target.checked
                      ? [...current, service.slug]
                      : current.filter((item) => item !== service.slug),
                  )
                }}
              />
              {service.label}
            </label>
          )
        })}
      </div>
      <button
        type="button"
        className="btn btn-primary min-h-11"
        disabled={busy || selected.length === 0}
        onClick={() => {
          setBusy(true)
          void onDone(selected).finally(() => setBusy(false))
        }}
      >
        Continue
      </button>
    </div>
  )
}

function PricingStep({
  onDone,
}: {
  onDone: (values: {
    startingPrice: number
    pricingModel: string
    minGuests: number
    maxGuests: number
  }) => Promise<void>
}) {
  const [startingPrice, setStartingPrice] = useState('800')
  const [pricingModel, setPricingModel] = useState('quote')
  const [minGuests, setMinGuests] = useState('2')
  const [maxGuests, setMaxGuests] = useState('12')
  const [busy, setBusy] = useState(false)

  return (
    <div className="space-y-4">
      <h2 className="font-heading text-2xl tracking-tight">Pricing</h2>
      <Field label="Starting price (GHS)">
        <input
          className="field"
          inputMode="numeric"
          value={startingPrice}
          onChange={(event) => setStartingPrice(event.target.value)}
        />
      </Field>
      <Field label="Pricing model">
        <select
          className="field"
          value={pricingModel}
          onChange={(event) => setPricingModel(event.target.value)}
        >
          <option value="quote">Custom quote</option>
          <option value="fixed">Fixed</option>
          <option value="per_guest">Per guest</option>
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Min guests">
          <input
            className="field"
            inputMode="numeric"
            value={minGuests}
            onChange={(event) => setMinGuests(event.target.value)}
          />
        </Field>
        <Field label="Max guests">
          <input
            className="field"
            inputMode="numeric"
            value={maxGuests}
            onChange={(event) => setMaxGuests(event.target.value)}
          />
        </Field>
      </div>
      <button
        type="button"
        className="btn btn-primary min-h-11"
        disabled={busy}
        onClick={() => {
          setBusy(true)
          void onDone({
            startingPrice: Number(startingPrice),
            pricingModel,
            minGuests: Number(minGuests),
            maxGuests: Number(maxGuests),
          }).finally(() => setBusy(false))
        }}
      >
        Continue to verification
      </button>
    </div>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="text-sm text-ploy-text-secondary">{label}</span>
      <div className="mt-2">{children}</div>
      {error ? <p className="mt-1 text-sm text-ploy-accent-secondary">{error}</p> : null}
    </label>
  )
}
