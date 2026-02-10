import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import { supabaseAdmin } from '~/features/auth/supabaseAdmin'

type GitHubUser = {
  id: string
  full_name: string | null
  email: string | null
  avatar_url: string | null
}

export default apiRoute(async (req) => {
  if (req.method !== 'GET') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  const { user } = await ensureAuth({ req })
  const url = new URL(req.url)
  const query = url.searchParams.get('q')

  if (!query) {
    return Response.json({ error: 'Query parameter is required' }, { status: 400 })
  }

  const sanitized = query.replace(/[%_\\*()]/g, '')

  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .or(`full_name.ilike.%${sanitized}%, email.ilike.%${sanitized}%`)
      .neq('id', user.id)
      .limit(5)

    if (error) {
      throw error
    }

    return Response.json({ users: data } as { users: GitHubUser[] })
  } catch (error) {
    return Response.json({ error: 'Failed to fetch GitHub users' }, { status: 500 })
  }
})
