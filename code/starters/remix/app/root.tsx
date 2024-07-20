import { Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react'
import { Providers } from './providers'
import Tamagui from '../tamagui.config'
import './tamagui.css'
import { isClient } from '@tamagui/core'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <Styles />
      </head>
      <body>
        <Providers>{children}</Providers>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}

export const Styles = () => {
  if (isClient) {
    return null
  }
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Tamagui.getCSS({
          // design system generated into tamagui.css
          exclude: 'design-system',
        }),
      }}
    />
  )
}
