import { createFileRoute } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { chefPortalDemo } from '../../data/chef-portal-demo'
import { matchesQuery } from '../../components/portal/format'
import { Route as ChefDashboardRoute } from './route'

export const Route = createFileRoute('/chef-dashboard/menus')({
  component: ChefMenusPage,
})

function ChefMenusPage() {
  const search = ChefDashboardRoute.useSearch()
  const { menus } = chefPortalDemo
  const items = menus.items.filter((menu) =>
    matchesQuery(`${menu.name} ${menu.blurb} ${menu.kicker} ${menu.status}`, search.q),
  )

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-portal-muted">{menus.summary}</p>
        <button type="button" className="btn btn-outline min-h-9 px-3.5">
          <Plus size={14} /> New menu
        </button>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {items.map((menu) => (
          <article key={menu.name} className="portal-card flex flex-col p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-portal-muted">
                  {menu.kicker}
                </p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight">{menu.name}</h3>
              </div>
              <span
                className={
                  menu.status === 'Published'
                    ? 'portal-chip bg-portal-accent/16 text-portal-accent'
                    : 'portal-chip bg-white/8 text-portal-muted'
                }
              >
                {menu.status}
              </span>
            </div>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-portal-muted">{menu.blurb}</p>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-portal-border pt-4 text-sm text-portal-muted">
              <span>Courses {menu.courses}</span>
              <span>Per head {menu.price}</span>
              <span>Booked {menu.booked}</span>
              <button type="button" className="ml-auto text-sm text-portal-accent hover:underline">
                Edit
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
