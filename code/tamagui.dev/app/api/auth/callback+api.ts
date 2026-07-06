import type { Endpoint } from 'one'

export const GET: Endpoint = async (req) => {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')

  if (!code) {
    return new Response('Missing code parameter', { status: 400 })
  }

  // Pass code to client page - client will exchange using its stored PKCE code verifier.
  const redirectUrl = new URL('/auth', req.url)
  redirectUrl.searchParams.set('code', code)

  return new Response(null, {
    status: 303,
    headers: {
      'Cache-Control': 'no-store',
      Location: redirectUrl.toString(),
    },
  })
}
