import type { Endpoint } from 'one'

export const GET: Endpoint = async (req) => {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')

  if (!code) {
    return Response.error()
  }

  const headers = new Headers()
  headers.set('content-type', 'text/html')

  // Pass code to client for PKCE exchange - the code verifier is in localStorage
  // so the client must complete the exchange
  return new Response(
    `<html>
        <head>
          <script>
            window.location.href = "/auth?code=${encodeURIComponent(code)}"
          </script>
        </head>
      </html>`,
    {
      headers,
    }
  )
}
