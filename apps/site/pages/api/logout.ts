import { Database } from '@lib/supabase-types'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { NextApiHandler } from 'next'

const handler: NextApiHandler = async (req, res) => {
  const supabase = createPagesServerClient<Database>({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()
  const user = session?.user

  if (!user) {
    res.redirect('/login')
  }

  await supabase.auth.signOut()
  res.redirect('/login')
}

export default handler
