import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  notFoundComponent: () => (
    <main className="flex min-h-screen items-center justify-center bg-ploy-background-primary px-5 text-center">
      <div>
        <p className="typography-eyebrow">Girki</p>
        <h1 className="display-title mt-5 text-5xl">This page isn’t on the table.</h1>
        <a href="/" className="btn btn-primary mt-8">
          Back home
        </a>
      </div>
    </main>
  ),
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Girki: Private Chefs in Ghana',
      },
      { name: 'theme-color', content: '#e85c32' },
      {
        name: 'description',
        content:
          'Discover and book talented private chefs for everyday meals, intimate dinners, celebrations, vacations, and culinary experiences across Ghana.',
      },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:type', content: 'website' },
      {
        property: 'og:title',
        content: 'Girki: Private Chefs in Ghana',
      },
      {
        property: 'og:description',
        content:
          'Discover and book talented private chefs for everyday meals, intimate dinners, celebrations, vacations, and culinary experiences across Ghana.',
      },
      { name: 'twitter:card', content: 'summary' },
      {
        name: 'twitter:title',
        content: 'Girki: Private Chefs in Ghana',
      },
      {
        name: 'twitter:description',
        content:
          'Discover and book talented private chefs for everyday meals, intimate dinners, celebrations, vacations, and culinary experiences across Ghana.',
      },
    ],
    links: [
      { rel: 'icon', href: '/brand/girki-mark-terracotta.png', type: 'image/png' },
      { rel: 'apple-touch-icon', href: '/brand/girki-mark-terracotta.png' },
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  )
}
