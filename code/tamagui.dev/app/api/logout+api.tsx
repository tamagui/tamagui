import { redirect } from 'one'
import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'

export default apiRoute(async (req) => {
  const { supabase, user } = await ensureAuth({ req })

  if (!user) {
    console.warn(`No user found during logout`)
    return redirect('/login')
  }

  console.warn(`Logging out`)

  try {
    await supabase.auth.signOut()
    return redirect('/login')
  } catch (error) {
    console.error('Error signing out:', error)
    return redirect('/login')
  }
})
