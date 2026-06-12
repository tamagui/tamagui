/**
 * detects tailwind syntax mode from loader props.
 *
 * production: tailwind.tamagui.dev subdomain
 * development: ?syntax=tailwind search param
 */
export function isTailwindMode(props: {
  path?: string
  search?: string
  request?: Request
}): boolean {
  const path = props.path || (props.request ? getRequestPath(props.request) : '')

  return (
    isTailwindHost(props.request?.headers.get('host') || '') ||
    isTailwindSearch(props.search || '') ||
    isTailwindPath(path)
  )
}

export function isTailwindHost(host: string): boolean {
  return host.startsWith('tailwind.')
}

export function isTailwindSearch(search: string): boolean {
  return new URLSearchParams(search).get('syntax') === 'tailwind'
}

export function isTailwindLocation(location: Pick<Location, 'host' | 'search'>): boolean {
  return isTailwindHost(location.host) || isTailwindSearch(location.search)
}

export function isTailwindPath(pathname: string): boolean {
  return (
    pathname === '/tailwind' ||
    pathname.startsWith('/tailwind/') ||
    pathname.startsWith('/tailwind-ui/')
  )
}

export function toTailwindPath(pathname: string): string {
  if (pathname === '/') {
    return '/tailwind'
  }
  if (pathname.startsWith('/docs/intro/')) {
    return pathname.replace('/docs/intro/', '/tailwind/intro/')
  }
  if (pathname.startsWith('/docs/core/')) {
    return pathname.replace('/docs/core/', '/tailwind/core/')
  }
  if (pathname.startsWith('/docs/guides/')) {
    return pathname.replace('/docs/guides/', '/tailwind/guides/')
  }
  if (pathname.startsWith('/ui/')) {
    return pathname.replace('/ui/', '/tailwind-ui/')
  }
  return pathname
}

export function toTamaguiPath(pathname: string): string {
  if (pathname.startsWith('/tailwind/intro/')) {
    return pathname.replace('/tailwind/intro/', '/docs/intro/')
  }
  if (pathname.startsWith('/tailwind/core/')) {
    return pathname.replace('/tailwind/core/', '/docs/core/')
  }
  if (pathname.startsWith('/tailwind/guides/')) {
    return pathname.replace('/tailwind/guides/', '/docs/guides/')
  }
  if (pathname.startsWith('/tailwind-ui/')) {
    return pathname.replace('/tailwind-ui/', '/ui/')
  }
  return pathname
}

function getRequestPath(request: Request): string {
  try {
    return new URL(request.url).pathname
  } catch {
    return ''
  }
}
