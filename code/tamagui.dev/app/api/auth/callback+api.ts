import type { Endpoint } from 'one'

export const GET: Endpoint = async (req) => {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')

  if (!code) {
    return Response.error()
  }

  // Pass code to client page - client will exchange using its stored PKCE code verifier
  const headers = new Headers()
  headers.set('content-type', 'text/html')

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
