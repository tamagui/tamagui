import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'

export default apiRoute(async (req) => {
  const { supabase, session } = await ensureAuth({ req })
  const user = session?.user

  if (!user) {
    return Response.redirect('/login')
  }

  try {
    await supabase.auth.signOut()
    return Response.redirect('/login')
  } catch (error) {
    console.error('Error signing out:', error)
    // , { error: 'Logout failed, please try again.' }
    return Response.redirect('/login')
  }
})
