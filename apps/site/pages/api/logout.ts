import { apiRoute } from '@lib/apiRoute'
import { protectApiRoute } from '@lib/protectApiRoute'
import { NextApiHandler } from 'next'

export default apiRoute(async (req, res) => {
  const { session, supabase } = await protectApiRoute({ req, res })
  const user = session?.user

  if (!user) {
    res.redirect('/login')
  }

  await supabase.auth.signOut()
  res.redirect('/login')
})
