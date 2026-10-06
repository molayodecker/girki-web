import { Link, createFileRoute } from '@tanstack/react-router'
import { Send } from 'lucide-react'
import { useMemo, useState } from 'react'
import { chefPortalDemo } from '../../data/chef-portal-demo'
import { initials, matchesQuery } from '../../components/portal/format'
import { Route as ChefDashboardRoute } from './route'

export const Route = createFileRoute('/chef-dashboard/messages')({
  component: ChefMessagesPage,
})

function ChefMessagesPage() {
  const search = ChefDashboardRoute.useSearch()
  const { messages } = chefPortalDemo
  const threads = useMemo(
    () =>
      messages.threads.filter((thread) =>
        matchesQuery(`${thread.name} ${thread.preview}`, search.q),
      ),
    [messages.threads, search.q],
  )
  const [activeId, setActiveId] = useState(threads[0]?.id ?? messages.threads[0]?.id)
  const active = messages.threads.find((thread) => thread.id === activeId) ?? messages.threads[0]

  return (
    <div className="grid min-h-[32rem] gap-4 xl:grid-cols-12">
      <aside className="portal-card overflow-hidden xl:col-span-4">
        <ul>
          {threads.map((thread) => {
            const selected = thread.id === active?.id
            return (
              <li key={thread.id} className="border-b border-portal-border last:border-0">
                <button
                  type="button"
                  onClick={() => setActiveId(thread.id)}
                  className={[
                    'flex w-full items-start gap-3 px-4 py-3.5 text-left transition',
                    selected ? 'bg-portal-accent/12' : 'hover:bg-white/[0.03]',
                  ].join(' ')}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="truncate text-sm font-medium">{thread.name}</p>
                      <span className="shrink-0 text-xs text-portal-muted">{thread.time}</span>
                    </div>
                    <p className="mt-1 truncate text-sm text-portal-muted">{thread.preview}</p>
                  </div>
                </button>
              </li>
            )
          })}
        </ul>
      </aside>

      <section className="portal-card flex min-h-[28rem] flex-col xl:col-span-8">
        {active ? (
          <>
            <header className="flex flex-wrap items-center gap-3 border-b border-portal-border px-5 py-4">
              <div className="flex size-10 items-center justify-center rounded-full bg-portal-accent/20 text-sm font-semibold text-portal-accent">
                {initials(active.name)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{active.name}</p>
                {active.bookingMeta ? (
                  <p className="text-sm text-portal-muted">{active.bookingMeta}</p>
                ) : (
                  <p className="text-sm text-portal-muted">{active.preview}</p>
                )}
              </div>
              {active.bookingId ? (
                <Link
                  to="/chef-dashboard/bookings/$bookingId"
                  params={{ bookingId: active.bookingId }}
                  search={search}
                  className="btn btn-outline min-h-9 px-3.5"
                >
                  Open booking
                </Link>
              ) : null}
            </header>

            <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-5 py-5">
              {(active.id === 'amara' ? messages.chat : [
                {
                  from: 'guest' as const,
                  text: active.preview,
                  time: active.time,
                },
              ]).map((message, index) => {
                const mine = message.from === 'chef'
                return (
                  <div
                    key={`${message.time}-${index}`}
                    className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={[
                        'max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                        mine
                          ? 'bg-portal-accent/20 ring-1 ring-inset ring-portal-accent/35'
                          : 'bg-white/[0.05]',
                      ].join(' ')}
                    >
                      <p>{message.text}</p>
                      <p className="mt-2 text-[11px] text-portal-muted">{message.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <footer className="border-t border-portal-border p-4">
              <form
                className="flex gap-2"
                onSubmit={(event) => {
                  event.preventDefault()
                }}
              >
                <input
                  className="field flex-1"
                  placeholder={`Write to ${active.name.split(' ')[0]}`}
                  aria-label="Message"
                />
                <button type="submit" className="btn btn-outline min-h-11 px-4">
                  <Send size={15} /> Send
                </button>
              </form>
            </footer>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center p-8 text-sm text-portal-muted">
            No conversation selected.
          </div>
        )}
      </section>
    </div>
  )
}
