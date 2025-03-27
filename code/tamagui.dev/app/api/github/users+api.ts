import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'

type GitHubUser = {
  id: number
  full_name: string | null
  avatar_url: string | null
}

export default apiRoute(async (req) => {
  if (req.method !== 'GET') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  const { supabase, user } = await ensureAuth({ req })
  const url = new URL(req.url)
  const query = url.searchParams.get('q')

  if (!query) {
    return Response.json({ error: 'Query parameter is required' }, { status: 400 })
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .ilike('full_name', `%${query}%`)

    if (error) {
      throw error
    }

    return Response.json({ users: data } as { users: GitHubUser[] })
  } catch (error) {
    return Response.json({ error: 'Failed to fetch GitHub users' }, { status: 500 })
  }
})
