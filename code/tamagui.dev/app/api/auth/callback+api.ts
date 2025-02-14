import type { Endpoint } from 'one'
import { getSupabaseServerClient } from '~/features/api/getSupabaseServerClient'

export const GET: Endpoint = async (req) => {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const next = url.searchParams.get('next') ?? '/'

  if (!code) {
    return Response.error()
  }

  // this handles setting cookies via setResponseHeaders
  const supabase = getSupabaseServerClient(req)
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error(`Error authenticating`, error)
  }

  const headers = new Headers()
  headers.set('content-type', 'text/html')

  // Add login_success=true to the redirect URL
  const redirectUrl = new URL(next, url.origin)
  redirectUrl.searchParams.set('login_success', 'true')

  // this will get the cookies added in getSupabaseServerClient thanks to one
  return new Response(
    `<html>
        <head>
          <script>
            window.location.href = "${redirectUrl.toString()}"
          </script>
        </head>
      </html>`,
    {
      headers,
    }
  )
}
