import { createServerClient } from '@supabase/ssr'

export const getTheme = async (id: string) => {
  const supabase = createServerClient(
    import.meta.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    {
      cookies: {
        getAll() {
          return []
        },
      },
    }
  )

  const { data: currentTheme, error: themeError } = await supabase
    .from('theme_histories')
    .select('theme_data, search_query, id, user_id, og_image_url, is_cached')
    .eq('id', Number.parseInt(id))
    .single()

  if (themeError) {
    return null
  }

  return {
    theme: currentTheme.theme_data,
    search: currentTheme.search_query,
    id: currentTheme.id,
  }
}
