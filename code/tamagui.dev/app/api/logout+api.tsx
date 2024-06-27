import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import { redirect } from '~/features/api/redirect'

export default apiRoute(async (req) => {
  const { supabase, session } = await ensureAuth({ req })
  const user = session?.user

  if (!user) {
    return redirect('/login')
  }

  try {
    await supabase.auth.signOut()
    return redirect('/login')
  } catch (error) {
    console.error('Error signing out:', error)
    // , { error: 'Logout failed, please try again.' }
    return redirect('/login')
  }
})
