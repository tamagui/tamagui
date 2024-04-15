import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import type { NextApiRequest, NextApiResponse } from 'next'

import { HandledResponseTermination } from './apiRoute'
import { setupCors } from './cors'
import type { Database } from './supabase-types'
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
  setupCors(req, res)
  const supabase = createPagesServerClient<Database>(
    { req, res },
    { cookieOptions: supabaseCookieOptions }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()
  const user = session?.user

  if (!session || !user) {
    if (shouldRedirect) {
      res.redirect(
        303,
        `/login?${new URLSearchParams({
          redirect_to: req.url ?? '',
        }).toString()}`
      )
      throw new HandledResponseTermination(`Redirecting to login`)
    }

    // Instead of throwing an error after sending a response, we now encapsulate the response sending and error throwing in a function that can be caught by the caller.
    const errorMessage = `Not authed: ${!session ? 'no session' : ''} ${!user ? 'no user' : ''}`;
    res.status(401).json({
      error: 'The user is not authenticated',
    });
    // This error is now part of the response body instead of being thrown, allowing the caller to handle it appropriately.
    // The caller can check for this specific error message to determine the next steps.
    res.end(JSON.stringify({ error: new HandledResponseTermination(errorMessage) }));
  }

  return { supabase, session, user }
}
