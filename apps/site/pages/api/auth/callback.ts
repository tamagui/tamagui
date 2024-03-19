import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import type { NextApiHandler } from 'next'

import { supabaseCookieOptions } from '../../../lib/supabase-utils'

const handler: NextApiHandler = async (req, res) => {
  const { code } = req.query

  if (code) {
    const supabase = createPagesServerClient(
      { req, res },
      { cookieOptions: supabaseCookieOptions }
    )

    await supabase.auth.exchangeCodeForSession(String(code))
  }

  res.redirect('/')
}

export default handler
