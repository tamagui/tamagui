import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import { supabaseAdmin } from '~/features/auth/supabaseAdmin'

export default apiRoute(async (req) => {
  const { user } = await ensureAuth({ req })
  const url = new URL(req.url)
  const id = url.searchParams.get('id')

  // a single theme from the caller's own history (scoped to user_id so one user
  // can't read another's themes/prompts by guessing an id). public sharing of a
  // theme by id goes through getTheme/theme-share, not this history endpoint.
  if (id) {
    const { data, error } = await supabaseAdmin
      .from('theme_histories')
      .select('theme_data, search_query')
      .eq('id', Number(id))
      .eq('user_id', user.id)

    if (error) {
      return Response.json({ error: 'Failed to load theme' }, { status: 500 })
    }

    return Response.json(data)
  }

  const { data, error } = await supabaseAdmin
    .from('theme_histories')
    .select('theme_data, search_query, created_at, id')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(30)

  if (error) {
    return Response.json({ error: 'Failed to load themes' }, { status: 500 })
  }

  return Response.json({ histories: data })
})
