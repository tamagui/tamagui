import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import { supabaseAdmin } from '~/features/auth/supabaseAdmin'

export default apiRoute(async (req) => {
  const { user } = await ensureAuth({ req })
  const url = new URL(req.url)
  const searchQuery = url.searchParams.get('q')
  const userId = url.searchParams.get('uid')
  const id = url.searchParams.get('id')

  if (id) {
    const { data, error } = await supabaseAdmin
      .from('theme_histories')
      .select('theme_data, search_query')
      .eq('id', id)

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json(data)
  }

  // Get specific theme
  if (searchQuery && userId) {
    const { data, error } = await supabaseAdmin
      .from('theme_histories')
      .select('theme_data, search_query')
      .eq('user_id', userId)
      .eq('search_query', searchQuery)
      .single()

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
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
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ histories: data })
})
