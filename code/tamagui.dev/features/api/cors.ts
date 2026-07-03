import { setResponseHeaders } from 'one'

export const setupCors = (req: Request) => {
  const origin = req.headers.get('origin')

  if (isValidOrigin(origin)) {
    setResponseHeaders((headers) => {
      headers.set('Access-Control-Allow-Origin', origin)
      headers.set('Access-Control-Allow-Credentials', 'true')
      headers.set('Allow', 'GET, POST, PUT, DELETE, PATCH')
    })
  }
}

// exact local dev origins (the desktop/dev app on :1421) — matched verbatim so
// attacker hosts like http://evil-localhost:1421 can't slip past a suffix check.
const DEV_ORIGINS = new Set(['http://localhost:1421', 'http://127.0.0.1:1421'])

function isValidOrigin(origin?: string | null): origin is string {
  if (typeof origin !== 'string') return false
  if (DEV_ORIGINS.has(origin)) return true
  // prod: require a real https origin on tamagui.dev / stripe.com (or a subdomain).
  // parse so the scheme is checked and the host is compared exactly (host carries
  // any port), so e.g. http://… and eviltamagui.dev are both rejected.
  let url: URL
  try {
    url = new URL(origin)
  } catch {
    return false
  }
  if (url.protocol !== 'https:') return false
  const { host } = url
  return (
    host === 'tamagui.dev' ||
    host.endsWith('.tamagui.dev') ||
    host === 'stripe.com' ||
    host.endsWith('.stripe.com')
  )
}
