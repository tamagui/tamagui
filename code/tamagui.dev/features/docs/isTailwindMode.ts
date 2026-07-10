import { cookieHasTailwind } from './syntaxCookie'

/**
 * detects tailwind syntax mode from loader props.
 *
 * production: tailwind.tamagui.dev subdomain
 * development: ?syntax=tailwind search param or /tailwind route aliases
 * both: sticky tamaguiSyntax cookie set by the header toggle, so the mode
 * survives every navigation; an explicit ?syntax= param overrides it
 */
export function isTailwindMode(props: { search?: string; request?: Request }): boolean {
  // explicit param wins in both directions so links can override the cookie
  if (props.search?.includes('syntax=tamagui')) return false
  if (props.search?.includes('syntax=tailwind')) return true

  // check subdomain (production: tailwind.tamagui.dev)
  const host = props.request?.headers.get('host') || ''
  if (host.startsWith('tailwind.')) return true

  const pathname = props.request ? new URL(props.request.url).pathname : ''
  if (pathname.startsWith('/tailwind')) return true

  // sticky mode from the header toggle
  if (cookieHasTailwind(props.request?.headers.get('cookie'))) return true

  return false
}
