import type { Endpoint } from 'vxs'
import { requestAsyncLocalStore } from 'vxs/headers'
import { getSupabaseServerClient } from '~/features/api/getSupabaseServerClient'

export const GET: Endpoint = async (req) => {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const next = url.searchParams.get('next') ?? '/'

  console.info(` - code ${code}`, requestAsyncLocalStore.getStore())

  if (!code) {
    return Response.error()
  }

  const supabase = getSupabaseServerClient(req)
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error(`Error authenticating`, error)
  }

  const headers = new Headers()
  headers.set('content-type', 'text/html')

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
