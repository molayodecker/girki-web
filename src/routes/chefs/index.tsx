import { Link, createFileRoute } from '@tanstack/react-router'
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
            eyebrow="Our chefs"
            title="Africa has extraordinary chefs. Girki helps you find them."
            copy="Browse stories, specialties, and sample menus, then send a request so they can propose a menu around your table."
            action={
              <Link to="/request" className="btn btn-primary">
                Start a request
              </Link>
            }
          />
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {chefs.map((chef) => (
              <ChefCard key={chef.id} chef={chef} />
            ))}
          </div>
        </div>
      </main>
    </PageShell>
  )
}
