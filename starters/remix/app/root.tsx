import { Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react'
import { Providers } from './providers'
import tamaguiResetStyles from '@tamagui/core/reset.css?url'
import { LinksFunction } from '@remix-run/node'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Providers>{children}</Providers>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: tamaguiResetStyles },
]

export default function App() {
  return <Outlet />
}
