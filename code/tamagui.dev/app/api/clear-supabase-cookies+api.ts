import { apiRoute } from '~/features/api/apiRoute'
import { getExpiredSupabaseCookieHeaders } from '~/features/security/cookies'

export default apiRoute(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const headers = new Headers({
    'Cache-Control': 'no-store',
  })

  for (const cookie of getExpiredSupabaseCookieHeaders(
    req.headers.get('cookie'),
    req.headers.get('host') ?? ''
  )) {
    headers.append('Set-Cookie', cookie)
  }

  return new Response(null, { status: 204, headers })
})
