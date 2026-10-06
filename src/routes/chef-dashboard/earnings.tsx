import { createFileRoute } from '@tanstack/react-router'
import { chefPortalDemo } from '../../data/chef-portal-demo'
import { matchesQuery } from '../../components/portal/format'
import { Route as ChefDashboardRoute } from './route'

export const Route = createFileRoute('/chef-dashboard/earnings')({
  component: ChefEarningsPage,
})

function ChefEarningsPage() {
  const search = ChefDashboardRoute.useSearch()
  const { earnings } = chefPortalDemo
  const payouts = earnings.payouts.filter((row) =>
    matchesQuery(`${row.dinner} ${row.status} ${row.net}`, search.q),
  )

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {earnings.stats.map((stat) => (
          <article key={stat.k} className="portal-card p-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-portal-muted">
              {stat.k}
            </p>
            <p className="mt-3 text-2xl font-semibold tracking-tight">{stat.v}</p>
            <p className="mt-2 text-sm text-portal-muted">{stat.note}</p>
          </article>
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-12">
        <section className="portal-card p-5 xl:col-span-5">
          <h3 className="text-base font-semibold">Last six months</h3>
          <div className="mt-6 flex h-44 items-end gap-3">
            {earnings.chart.map((bar) => (
              <div key={bar.month} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <span className="text-[10px] text-portal-muted">{bar.value}</span>
                <div
                  className={`w-full rounded-t-md ${bar.current ? 'bg-portal-accent/70' : 'bg-portal-accent/35'}`}
                  style={{ height: `${bar.h}%` }}
                />
                <span className="text-xs text-portal-muted">{bar.month}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="portal-card overflow-hidden xl:col-span-7">
          <div className="border-b border-portal-border px-5 py-4">
            <h3 className="text-base font-semibold">Payouts</h3>
          </div>
          <div className="hidden grid-cols-[4.5rem_1.4fr_5.5rem_5rem_5.5rem_5.5rem] gap-3 border-b border-portal-border px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-portal-muted lg:grid">
            <span>Date</span>
            <span>Dinner</span>
            <span>Gross</span>
            <span>Fee</span>
            <span>Net</span>
            <span>Status</span>
          </div>
          <ul>
            {payouts.map((row) => (
              <li
                key={`${row.date}-${row.dinner}`}
                className="grid grid-cols-1 gap-1 border-b border-portal-border px-5 py-3.5 text-sm last:border-0 lg:grid-cols-[4.5rem_1.4fr_5.5rem_5rem_5.5rem_5.5rem] lg:items-center lg:gap-3"
              >
                <span className="text-portal-muted">{row.date}</span>
                <span>{row.dinner}</span>
                <span className="tabular-nums text-portal-muted">{row.gross}</span>
                <span className="tabular-nums text-portal-muted">{row.fee}</span>
                <span className="font-medium tabular-nums">{row.net}</span>
                <span
                  className={
                    row.status === 'Clearing'
                      ? 'portal-chip w-fit bg-white/6 text-portal-muted ring-1 ring-inset ring-white/14'
                      : 'portal-chip w-fit bg-white/8 text-portal-muted'
                  }
                >
                  {row.status}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
