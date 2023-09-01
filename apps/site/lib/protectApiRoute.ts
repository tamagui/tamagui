import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { NextApiRequest, NextApiResponse } from 'next'

import { Database } from './supabase-types'
import { supabaseCookieOptions } from './supabase-utils'

/**
 * makes a supabase instance for the current user and returns a 401 if there's no user
 */
export async function protectApiRoute({
  req,
  res,
  shouldRedirect = false,
}: {
  req: NextApiRequest
  res: NextApiResponse
  shouldRedirect?: boolean
}) {
  const supabase = createPagesServerClient<Database>(
    { req, res },
    { cookieOptions: supabaseCookieOptions }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()
  const user = session?.user

  if (!session || !user) {
    if (process.env.IS_TAMAGUI_DEV) {
      console.warn(`Not authenticated but IS_TAMAGUI_DEV is set so allowing route.`)
    } else {
      if (shouldRedirect) {
        res.redirect(
          303,
          `/login?${new URLSearchParams({
            redirect_to: req.url ?? '',
          }).toString()}`
        )
      } else {
        res.status(401).json({
          error: 'The user is not authenticated',
        })
      }
      throw new Error('The user is not authenticated')
    }
  }

  return { supabase, session: session!, user: user! }
}
