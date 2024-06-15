import { createServerClient, type CookieOptions } from '@supabase/ssr'
import type { Endpoint } from 'vxs'
import { getCookie, setCookie } from '~/features/api/cookies'

export const GET: Endpoint = async (req) => {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const next = url.searchParams.get('next') ?? '/'

  console.warn(`auth callback`)

  const response = new Response()

  if (code) {
    const supabase = createServerClient(
      import.meta.env.NEXT_PUBLIC_SUPABASE_URL!,
      import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(key: string) {
            return getCookie(req.headers, key)
          },
          set(key: string, value: string, options: CookieOptions) {
            setCookie(response.headers, { key, value, ...options })
          },
          remove(key: string, options: CookieOptions) {
            console.warn('TODO')
            // ({ key, ...options })
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error(`Error authenticating`, error)
    }

    return Response.redirect(`${origin}${next}`)
  }

  // return the user to an error page with instructions
  // TODO
  return Response.redirect(`${origin}/auth/auth-code-error`)
}
