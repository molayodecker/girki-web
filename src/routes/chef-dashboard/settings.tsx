import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { chefPortalDemo } from '../../data/chef-portal-demo'

export const Route = createFileRoute('/chef-dashboard/settings')({
  component: ChefSettingsPage,
})

function ChefSettingsPage() {
  const { settings } = chefPortalDemo
  const [name, setName] = useState<string>(settings.name)
  const [city, setCity] = useState<string>(settings.city)
  const [radius, setRadius] = useState<string>(settings.radius)
  const [bio, setBio] = useState<string>(settings.bio)

  return (
    <div className="grid gap-4 xl:grid-cols-12">
      <section className="portal-card p-5 xl:col-span-6">
        <h3 className="text-base font-semibold">Your profile</h3>
        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm text-portal-muted">Name</span>
            <input className="field" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm text-portal-muted">Base city</span>
              <input className="field" value={city} onChange={(e) => setCity(e.target.value)} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm text-portal-muted">Travel radius</span>
              <input className="field" value={radius} onChange={(e) => setRadius(e.target.value)} />
            </label>
          </div>
          <label className="block">
            <span className="mb-1.5 block text-sm text-portal-muted">How you cook</span>
            <textarea
              className="field min-h-28 py-3"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </label>
          <div>
            <p className="mb-2 text-sm text-portal-muted">Cuisines</p>
            <div className="flex flex-wrap gap-2">
              {settings.cuisines.map((cuisine) => (
                <span key={cuisine} className="portal-chip bg-portal-accent/16 text-portal-accent">
                  {cuisine}
                </span>
              ))}
              <button type="button" className="portal-chip bg-transparent text-portal-muted ring-1 ring-inset ring-white/14">
                + add
              </button>
            </div>
          </div>
          <button type="button" className="btn btn-primary min-h-10 px-4">
            Save changes
          </button>
        </div>
      </section>

      <div className="space-y-4 xl:col-span-6">
        <section className="portal-card p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-base font-semibold">Booking rules</h3>
            <button type="button" className="text-sm text-portal-accent hover:underline">
              Edit rules
            </button>
          </div>
          <dl className="mt-4 space-y-3 text-sm">
            {settings.rules.map((rule) => (
              <div key={rule.k} className="flex justify-between gap-4">
                <dt className="text-portal-muted">{rule.k}</dt>
                <dd className="font-medium">{rule.v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="portal-card p-5">
          <h3 className="text-base font-semibold">Payout account</h3>
          <p className="mt-4 text-sm font-medium">{settings.payout.bank}</p>
          <p className="mt-2 text-sm text-portal-muted">{settings.payout.note}</p>
          <button type="button" className="btn btn-outline mt-5 min-h-9 px-3.5">
            Verify
          </button>
        </section>
      </div>
    </div>
  )
}
