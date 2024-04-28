import { createServerClient } from '@supabase/ssr'
import { setCurrentRequestHeaders } from '@vxrn/router/headers'
import type { Database } from '../supabase/types'
import { getCookie, setCookie } from './cookies'
import { setupCors } from './cors'

/**
 * makes a supabase instance for the current user and returns a 401 if there's no user
 */
export const ensureAuthenticated = async ({
  req,
  shouldRedirect = false,
}: {
  req: Request
  shouldRedirect?: boolean
}) => {
  setupCors(req)

  const supabase = createServerClient<Database>(
    import.meta.env.NEXT_PUBLIC_SUPABASE_URL!,
    import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (key) => {
          return decodeURIComponent(getCookie(req.headers, key) ?? '')
        },
        set: (key, value, options) => {
          setCurrentRequestHeaders((headers) => {
            setCookie(headers, {
              key,
              value,
              httpOnly: true,
              sameSite: 'Lax',
              ...options,
            })
          })
        },
        remove: (key, options) => {
          setCurrentRequestHeaders((headers) => {
            setCookie(headers, { key, value: '', ...options, httpOnly: true })
          })
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()
  const user = session?.user

  if (!session || !user) {
    if (shouldRedirect) {
      throw Response.redirect(
        `/login?${new URLSearchParams({
          redirect_to: req.url ?? '',
        }).toString()}`,
        303
      )
    }

    throw Response.json(
      {
        error: 'The user is not authenticated',
      },
      {
        status: 401,
        statusText: `Not authed: ${!session ? 'no session' : ''} ${
          !user ? 'no user' : ''
        }`,
      }
    )
  }

  return { supabase, session, user }
}
