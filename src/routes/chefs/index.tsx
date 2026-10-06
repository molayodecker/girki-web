import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import ChefCard from '../../components/ChefCard'
import PageShell, { PageIntro } from '../../components/layout/PageShell'
import { chefs } from '../../data/marketplace'

export const Route = createFileRoute('/chefs/')({
  component: ChefsPage,
})

function ChefsPage() {
  return (
    <PageShell>
      <main className="section-pad">
        <div className="mx-auto max-w-7xl">
          <PageIntro
            eyebrow="The chefs"
            title="Professional chefs behind every experience."
            copy="Girki connects talented private chefs with hosts who want restaurant-quality food at home. Browse stories, specialties, and sample menus, then send a request so they can propose a menu around your table."
            action={
              <Link
                to="/request"
                className="inline-flex min-h-12 items-center gap-2 bg-girki-saffron px-6 font-heading text-sm font-semibold text-[#1c1418] transition-transform hover:-translate-y-0.5"
              >
                Start a request
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            }
          />
          <div className="mt-14 grid gap-10 border-t-2 border-[#1c1418] pt-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
            {chefs.map((chef) => (
              <ChefCard key={chef.id} chef={chef} />
            ))}
          </div>
        </div>
      </main>
    </PageShell>
  )
}
