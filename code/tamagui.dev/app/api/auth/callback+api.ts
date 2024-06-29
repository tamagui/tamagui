import type { Endpoint } from 'vxs'
import { getSupabaseServerClient } from '~/features/api/getSupabaseServerClient'

export const GET: Endpoint = async (req) => {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const next = url.searchParams.get('next') ?? '/'

  console.info(` - code ${code}`)

  if (!code) {
    return Response.error()
  }

  // this handles setting cookies via setCurrentRequestHeaders
  const supabase = getSupabaseServerClient(req)
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error(`Error authenticating`, error)
  }

  const headers = new Headers()
  headers.set('content-type', 'text/html')

  // this will get the cookies added in getSupabaseServerClient thanks to vxs
  return new Response(
    `<html>
        <head>
          <script>
            window.location.href = "${next}"
          </script>
        </head>
      </html>`,
    {
      headers,
    }
  )
}
