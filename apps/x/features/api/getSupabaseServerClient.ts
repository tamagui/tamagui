import { createServerClient, parse, serialize } from '@supabase/ssr'
import { setCurrentRequestHeaders } from 'vxs/headers'
import type { Database } from '../supabase/types'

export function getSupabaseServerClient(request: Request) {
  if (!import.meta.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error(`Missing NEXT_PUBLIC_SUPABASE_URL`)
  }
  if (!import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error(`Missing NEXT_PUBLIC_SUPABASE_ANON_KEY`)
  }

  const cookies = parse(request.headers.get('Cookie') ?? '')

  return createServerClient<Database>(
    import.meta.env.NEXT_PUBLIC_SUPABASE_URL!,
    import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        flowType: 'pkce',
        debug(message, ...args) {
          console.info(` [supabase-auth] ${message}`, ...args)
        },
      },
      cookies: {
        get: (key) => {
          return cookies[key]
        },
        set: (key, value, options) => {
          setCurrentRequestHeaders((headers) => {
            const serialized = serialize(key, value, options)
            headers.append('Set-Cookie', serialized)
          })
        },
        remove: (key, options) => {
          setCurrentRequestHeaders((headers) => {
            headers.append('Set-Cookie', serialize(key, '', options))
          })
        },
      },
    }
  )
}
