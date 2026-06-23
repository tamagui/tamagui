import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import { supabaseAdmin } from '~/features/auth/supabaseAdmin'

type GitHubUser = {
  id: string
  full_name: string | null
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

  // strip postgrest filter metacharacters (incl. comma, the .or()/.in() delimiter)
  const sanitized = query.replace(/[%_\\*(),]/g, '').trim()

  try {
    // never return email (PII enumeration). match on name only, or on an exact
    // email the caller already knows in full - no substring email search.
    let builder = supabaseAdmin
      .from('users')
      .select('id, full_name, avatar_url')
      .neq('id', user.id)
      .limit(5)

    builder = query.includes('@')
      ? builder.eq('email', query.trim().toLowerCase())
      : builder.ilike('full_name', `%${sanitized}%`)

    const { data, error } = await builder

    if (error) {
      throw error
    }

    return Response.json({ users: data } as { users: GitHubUser[] })
  } catch (error) {
    return Response.json({ error: 'Failed to fetch GitHub users' }, { status: 500 })
  }
})
