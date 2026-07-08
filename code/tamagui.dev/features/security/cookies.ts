const SUPABASE_COOKIE_NAME = /^sb-[A-Za-z0-9._-]{1,160}$/

export function getSupabaseCookieNames(cookieHeader: string | null) {
  if (!cookieHeader) {
    return []
  }

  const names = new Set<string>()

  for (const cookie of cookieHeader.split(';')) {
    const name = cookie.trim().split('=')[0]

    if (SUPABASE_COOKIE_NAME.test(name)) {
      names.add(name)
    }
  }

  return [...names]
}

export function getExpiredSupabaseCookieHeaders(
  cookieHeader: string | null,
  host: string
) {
  const cookieNames = getSupabaseCookieNames(cookieHeader)
  const domain = getCookieDomain(host)
  const headers: string[] = []

  for (const name of cookieNames) {
    headers.push(formatExpiredCookie(name))

    if (domain) {
      headers.push(formatExpiredCookie(name, domain))
    }
  }

  return headers
}

function formatExpiredCookie(name: string, domain?: string) {
  const domainPart = domain ? `; Domain=${domain}` : ''
  const securePart = process.env.NODE_ENV === 'production' ? '; Secure' : ''

  return `${name}=; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/${domainPart}; SameSite=Lax${securePart}`
}

function getCookieDomain(host: string) {
  const hostname = host.split(':')[0].toLowerCase()

  if (hostname === 'tamagui.dev' || hostname.endsWith('.tamagui.dev')) {
    return '.tamagui.dev'
  }

  return null
}
