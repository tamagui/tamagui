import { apiRoute, postgresError } from '~/features/api/apiRoute'
import { supabaseAdmin } from '~/features/auth/supabaseAdmin'
import { freeThemes, type FreeTheme } from '~/features/docs/freeThemes'

let cachedThemes: FreeTheme[] | undefined
let cachedAt = 0
const cacheDuration = 20 * 60 * 1000

export default apiRoute(async () => {
  if (cachedThemes && Date.now() - cachedAt < cacheDuration) {
    return Response.json({ themes: cachedThemes })
  }

  const { data, error } = await supabaseAdmin
    .from('theme_histories')
    .select('id, search_query, theme_data')
    .in(
      'id',
      freeThemes.map((theme) => theme.id)
    )

  if (error) {
    throw postgresError(error)
  }

  const themesById = new Map(data.map((theme) => [theme.id, theme]))
  cachedThemes = freeThemes.flatMap((theme) => {
    const storedTheme = themesById.get(theme.id)
    return storedTheme
      ? [
          {
            ...theme,
            searchQuery: storedTheme.search_query,
            themeData: storedTheme.theme_data as unknown as FreeTheme['themeData'],
          },
        ]
      : []
  })
  cachedAt = Date.now()

  return Response.json({ themes: cachedThemes })
})
