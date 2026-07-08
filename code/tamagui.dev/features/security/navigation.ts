const CONTROL_CHARS = /[\u0000-\u001F\u007F]/
const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '[::1]', '::1'])

type InternalPathOptions = {
  fallback?: string
  origin?: string
}

type ExternalUrlOptions = {
  allowedOrigins: readonly string[]
  allowLocalHttp?: boolean
}

type RequestOriginOptions = {
  allowedHostnames?: readonly string[]
  fallbackOrigin?: string
}

type RequestLike = Pick<Request, 'headers' | 'url'>

const DEFAULT_ALLOWED_REQUEST_HOSTNAMES = ['tamagui.dev', 'www.tamagui.dev'] as const
const DEFAULT_PUBLIC_ORIGIN = 'https://tamagui.dev'

export function safeDecodeURIComponent(value: string) {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

export function getSafeInternalPath(value: unknown, options: InternalPathOptions = {}) {
  const fallback = options.fallback ?? '/'

  if (typeof value !== 'string') {
    return fallback
  }

  const trimmed = value.trim()

  if (
    !trimmed ||
    CONTROL_CHARS.test(trimmed) ||
    trimmed.startsWith('//') ||
    trimmed.includes('\\')
  ) {
    return fallback
  }

  const origin =
    options.origin ??
    (typeof window === 'undefined' ? 'https://tamagui.dev' : window.location.origin)

  try {
    const baseUrl = new URL(origin)
    const url = new URL(trimmed, baseUrl)

    if (url.origin !== baseUrl.origin) {
      return fallback
    }

    return `${url.pathname}${url.search}${url.hash}`
  } catch {
    return fallback
  }
}

export function navigateToInternalPath(
  value: unknown,
  options: InternalPathOptions = {}
) {
  if (typeof window === 'undefined') {
    return
  }

  window.location.assign(getSafeInternalPath(value, options))
}

export function getSafeExternalUrl(value: unknown, options: ExternalUrlOptions) {
  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()

  if (!trimmed || CONTROL_CHARS.test(trimmed)) {
    return null
  }

  let url: URL

  try {
    url = new URL(trimmed)
  } catch {
    return null
  }

  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    return null
  }

  if (url.protocol === 'http:' && !isAllowedLocalHttp(url, options.allowLocalHttp)) {
    return null
  }

  const allowedOrigins = new Set(options.allowedOrigins)

  return allowedOrigins.has(url.origin) ? url.toString() : null
}

export function getSafeSupabaseAuthUrl(value: unknown) {
  const supabaseOrigin = getSupabaseOrigin()

  if (!supabaseOrigin) {
    return null
  }

  return getSafeExternalUrl(value, {
    allowedOrigins: [supabaseOrigin],
    allowLocalHttp: process.env.NODE_ENV !== 'production',
  })
}

export function getSafeRequestOrigin(
  request: RequestLike,
  options: RequestOriginOptions = {}
) {
  const fallbackOrigin = options.fallbackOrigin ?? DEFAULT_PUBLIC_ORIGIN
  const allowedHostnames = options.allowedHostnames ?? DEFAULT_ALLOWED_REQUEST_HOSTNAMES

  try {
    const url = new URL(request.url)

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return fallbackOrigin
    }

    if (!isAllowedRequestHostname(url.hostname, allowedHostnames)) {
      return fallbackOrigin
    }

    const forwardedProtocol = getForwardedProtocol(
      request.headers.get('x-forwarded-proto')
    )
    if (forwardedProtocol) {
      url.protocol = `${forwardedProtocol}:`
    }

    if (url.protocol === 'http:' && !isAllowedLocalHttp(url, true)) {
      url.protocol = 'https:'
    }

    return url.origin
  } catch {
    return fallbackOrigin
  }
}

function getSupabaseOrigin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

  if (!supabaseUrl) {
    return null
  }

  try {
    return new URL(supabaseUrl).origin
  } catch {
    return null
  }
}

function isAllowedLocalHttp(url: URL, allowLocalHttp = false) {
  if (!allowLocalHttp) {
    return false
  }

  return LOCAL_HOSTNAMES.has(url.hostname)
}

function isAllowedRequestHostname(hostname: string, allowedHostnames: readonly string[]) {
  const normalizedHostname = hostname.toLowerCase()

  return (
    LOCAL_HOSTNAMES.has(normalizedHostname) ||
    allowedHostnames.includes(normalizedHostname)
  )
}

function getForwardedProtocol(value: string | null) {
  const protocol = value?.split(',')[0]?.trim().toLowerCase()

  return protocol === 'http' || protocol === 'https' ? protocol : null
}
