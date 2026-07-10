/**
 * detects tailwind syntax mode from loader props.
 *
 * production: tailwind.tamagui.dev subdomain
 * development: ?syntax=tailwind search param or /tailwind route aliases
 */
export function isTailwindMode(props: { search?: string; request?: Request }): boolean {
  // check subdomain (production: tailwind.tamagui.dev)
  const host = props.request?.headers.get('host') || ''
  if (host.startsWith('tailwind.')) return true

  // check search param (development: ?syntax=tailwind)
  if (props.search?.includes('syntax=tailwind')) return true

  const pathname = props.request ? new URL(props.request.url).pathname : ''
  if (pathname.startsWith('/tailwind')) return true

  return false
}
