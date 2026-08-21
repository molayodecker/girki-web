import { createServerFn } from '@tanstack/react-start'
import { normalizePhone } from './phone'
import { sql } from './db.server'

function asRecord(data: unknown) {
  if (typeof data !== 'object' || data === null) throw new Error('Expected an object.')
  return data as Record<string, unknown>
}

function requiredString(value: unknown, label: string) {
  const text = typeof value === 'string' ? value.trim() : ''
  if (!text) throw new Error(`${label} is required.`)
  return text
}

export const syncPhoneProfileFn = createServerFn({ method: 'POST' })
  .validator((data: unknown) => {
    const input = asRecord(data)
    return { phone: requiredString(input.phone, 'Phone') }
  })
  .handler(async ({ data }) => {
    const phone = normalizePhone(data.phone)
    const { requireSupabaseUser } = await import('./supabase/server')
    const { user } = await requireSupabaseUser()

    await sql`
      insert into public.profiles (id, phone, email, display_name, account_role, account_status)
      values (
        ${user.id},
        ${phone},
        ${user.email ?? null},
        ${''},
        'customer',
        'active'
      )
      on conflict (id) do update set
        phone = excluded.phone,
        email = coalesce(excluded.email, public.profiles.email),
        updated_at = now()
    `

    return {
      userId: user.id,
      phone,
      accountRole: 'customer' as const,
    }
  })

export const getAuthProfileFn = createServerFn({ method: 'POST' }).handler(async () => {
  const { createSupabaseServerClient } = await import('./supabase/server')
  const supabase = createSupabaseServerClient()
  const { data } = await supabase.auth.getUser()
  if (!data.user) return null

  const rows = await sql<
    Array<{
      id: string
      phone: string | null
      display_name: string
      account_role: string
      account_status: string
    }>
  >`
    select id, phone, display_name, account_role, account_status
    from public.profiles
    where id = ${data.user.id}
    limit 1
  `

  const chef = await sql<
    Array<{
      id: string | number
      slug: string
      onboarding_status: string
      verification_state: string
      profile_status: string
    }>
  >`
    select id, slug, onboarding_status, verification_state, profile_status
    from public.chef_profiles
    where user_id = ${data.user.id}
    limit 1
  `

  return {
    userId: data.user.id,
    phone: data.user.phone ?? rows[0]?.phone ?? null,
    profile: rows[0]
      ? {
          displayName: rows[0].display_name,
          accountRole: rows[0].account_role,
          accountStatus: rows[0].account_status,
        }
      : null,
    chefApplication: chef[0]
      ? {
          id: String(chef[0].id),
          slug: chef[0].slug,
          onboardingStatus: chef[0].onboarding_status,
          verificationState: chef[0].verification_state,
          profileStatus: chef[0].profile_status,
        }
      : null,
  }
})

export const startChefApplicationFn = createServerFn({ method: 'POST' })
  .validator((data: unknown) => {
    const input = asRecord(data)
    return {
      displayName: requiredString(input.displayName, 'Name'),
      city: requiredString(input.city, 'City'),
      country: requiredString(input.country, 'Country'),
      email: typeof input.email === 'string' ? input.email.trim() : '',
    }
  })
  .handler(async ({ data }) => {
    const { requireSupabaseUser } = await import('./supabase/server')
    const { supabase, user } = await requireSupabaseUser()

    if (data.email) {
      await sql`
        update public.profiles
        set
          email = ${data.email},
          display_name = coalesce(nullif(display_name, ''), ${data.displayName}),
          updated_at = now()
        where id = ${user.id}
      `
    } else {
      await sql`
        update public.profiles
        set
          display_name = coalesce(nullif(display_name, ''), ${data.displayName}),
          updated_at = now()
        where id = ${user.id}
      `
    }

    const { data: chef, error } = await supabase.rpc('start_chef_application', {
      p_display_name: data.displayName,
      p_base_city: data.city,
      p_country: data.country,
    })

    if (error) throw new Error(error.message)
    return chef
  })

export const saveChefProfileStepFn = createServerFn({ method: 'POST' })
  .validator((data: unknown) => {
    const input = asRecord(data)
    return {
      professionalName: requiredString(input.professionalName, 'Professional name'),
      yearsExperience: Number(input.yearsExperience) || 0,
      bio: requiredString(input.bio, 'Bio'),
      specialties: requiredString(input.specialties, 'Specialties'),
    }
  })
  .handler(async ({ data }) => {
    const { requireSupabaseUser } = await import('./supabase/server')
    const { user } = await requireSupabaseUser()

    const updated = await sql`
      update public.chef_profiles
      set
        display_name = ${data.professionalName},
        years_experience = ${data.yearsExperience},
        bio = ${data.bio},
        specialties = ${data.specialties},
        onboarding_status = 'profile',
        updated_at = now()
      where user_id = ${user.id}
        and profile_status = 'draft'
      returning id, slug, onboarding_status
    `
    if (!updated[0]) throw new Error('Chef application not found.')
    return updated[0]
  })

export const saveChefServicesStepFn = createServerFn({ method: 'POST' })
  .validator((data: unknown) => {
    const input = asRecord(data)
    const services = Array.isArray(input.services)
      ? input.services.map(String).filter(Boolean)
      : []
    if (services.length === 0) throw new Error('Select at least one service.')
    return { services }
  })
  .handler(async ({ data }) => {
    const { requireSupabaseUser } = await import('./supabase/server')
    const { user } = await requireSupabaseUser()

    const chef = await sql<{ id: string | number }[]>`
      select id from public.chef_profiles
      where user_id = ${user.id} and profile_status = 'draft'
      limit 1
    `
    if (!chef[0]) throw new Error('Chef application not found.')

    await sql`delete from public.chef_services where chef_id = ${chef[0].id}`

    for (const serviceSlug of data.services) {
      await sql`
        insert into public.chef_services (
          chef_id, service_type_id, title, pricing_model, currency, is_active
        )
        select
          ${chef[0].id},
          st.id,
          st.name,
          'quote',
          'GHS',
          true
        from public.service_types st
        where st.slug = ${serviceSlug}
      `
    }

    await sql`
      update public.chef_profiles
      set onboarding_status = 'services', updated_at = now()
      where id = ${chef[0].id}
    `

    return { ok: true as const, services: data.services }
  })

export const saveChefPricingStepFn = createServerFn({ method: 'POST' })
  .validator((data: unknown) => {
    const input = asRecord(data)
    const startingPrice = Number(input.startingPrice)
    if (!Number.isFinite(startingPrice) || startingPrice <= 0) {
      throw new Error('Enter a starting price greater than zero.')
    }
    return {
      startingPrice,
      pricingModel:
        input.pricingModel === 'per_guest' || input.pricingModel === 'fixed'
          ? input.pricingModel
          : 'quote',
      minGuests: Math.max(1, Number(input.minGuests) || 1),
      maxGuests: Math.max(1, Number(input.maxGuests) || 12),
    }
  })
  .handler(async ({ data }) => {
    const { requireSupabaseUser } = await import('./supabase/server')
    const { user } = await requireSupabaseUser()

    const chef = await sql<{ id: string | number }[]>`
      select id from public.chef_profiles
      where user_id = ${user.id} and profile_status = 'draft'
      limit 1
    `
    if (!chef[0]) throw new Error('Chef application not found.')

    await sql`
      update public.chef_services
      set
        pricing_model = ${data.pricingModel},
        base_price = ${data.startingPrice},
        min_guests = ${data.minGuests},
        max_guests = ${data.maxGuests}
      where chef_id = ${chef[0].id}
    `

    await sql`
      update public.chef_profiles
      set onboarding_status = 'pricing', updated_at = now()
      where id = ${chef[0].id}
    `

    return { ok: true as const }
  })

export const saveChefVerificationStepFn = createServerFn({ method: 'POST' })
  .validator((data: unknown) => {
    const input = asRecord(data)
    return {
      idNotes: typeof input.idNotes === 'string' ? input.idNotes.trim() : '',
      references: typeof input.references === 'string' ? input.references.trim() : '',
    }
  })
  .handler(async ({ data }) => {
    const { requireSupabaseUser } = await import('./supabase/server')
    const { user } = await requireSupabaseUser()

    const note = [data.idNotes && `ID: ${data.idNotes}`, data.references && `Refs: ${data.references}`]
      .filter(Boolean)
      .join('\n')

    const updated = await sql`
      update public.chef_profiles
      set
        headline = coalesce(nullif(headline, ''), ${note || 'Verification materials pending review'}),
        onboarding_status = 'verification',
        verification_state = 'pending',
        updated_at = now()
      where user_id = ${user.id}
        and profile_status = 'draft'
      returning id
    `
    if (!updated[0]) throw new Error('Chef application not found.')
    return { ok: true as const }
  })

export const submitChefApplicationFn = createServerFn({ method: 'POST' }).handler(async () => {
  const { requireSupabaseUser } = await import('./supabase/server')
  const { supabase } = await requireSupabaseUser()
  const { data, error } = await supabase.rpc('submit_chef_application')
  if (error) throw new Error(error.message)
  return data
})

export const signOutFn = createServerFn({ method: 'POST' }).handler(async () => {
  const { createSupabaseServerClient } = await import('./supabase/server')
  const supabase = createSupabaseServerClient()
  await supabase.auth.signOut()
  return { ok: true as const }
})
