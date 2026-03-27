/**
 * detects tailwind syntax mode from loader props.
 *
 * production: tailwind.tamagui.dev subdomain
 * development: ?syntax=tailwind search param
 */
export function isTailwindMode(props: {
  search?: string
  request?: Request
}): boolean {
  // check subdomain (production: tailwind.tamagui.dev)
  const host = props.request?.headers.get('host') || ''
  if (host.startsWith('tailwind.')) return true

  // check search param (development: ?syntax=tailwind)
  if (props.search?.includes('syntax=tailwind')) return true

  return false
}
