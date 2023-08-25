import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { NextApiRequest, NextApiResponse } from 'next'

import { Database } from './supabase-types'

/**
 * makes a supabase instance for the current user and returns a 401 if there's no user
 */
export async function protectApiRoute(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createPagesServerClient<Database>({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()
  const user = session?.user

  if (!session || !user) {
    res.status(401).json({
      error: 'The user is not authenticated',
    })
    throw new Error('The user is not authenticated')
  }

  return { supabase, session, user: user! }
}
