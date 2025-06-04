import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from '@supabase/ssr'
import { setResponseHeaders } from 'one'

export function getSupabaseServerClient(request: Request) {
  if (!import.meta.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error(`Missing NEXT_PUBLIC_SUPABASE_URL`)
  }
  if (!import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error(`Missing NEXT_PUBLIC_SUPABASE_ANON_KEY`)
  }

  const cookies = parseCookieHeader(request.headers.get('Cookie') ?? '')

  return createServerClient(
    import.meta.env.NEXT_PUBLIC_SUPABASE_URL!,
    import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        debug(message, ...args) {
          if (process.env.DEBUG) {
            console.info(` [supabase-auth] ${message}`, ...args)
          }
        },
      },
      cookies: {
        getAll() {
          return cookies
        },

        setAll(cookiesToSet) {
          setResponseHeaders((headers) => {
            cookiesToSet.forEach(({ name, value, options }) =>
              headers.append('Set-Cookie', serializeCookieHeader(name, value, options))
            )
          })
        },
      },
    }
  )
}
