import z from 'zod'
import { getSupabaseServerClient } from '../../api/getSupabaseServerClient'
import type { ThemeSuiteItemData } from './types'

const ColorEntrySchema = z.object({
  index: z.number(),
  hue: z.object({
    light: z.number(),
    dark: z.number(),
    sync: z.boolean().optional(),
    syncLeft: z.boolean().optional(),
  }),
  sat: z.object({
    light: z.number(),
    dark: z.number(),
    sync: z.boolean().optional(),
    syncLeft: z.boolean().optional(),
  }),
  lum: z.object({
    light: z.number(),
    dark: z.number(),
    sync: z.boolean().optional(),
    syncLeft: z.boolean().optional(),
  }),
})

const PaletteSchema = z.object({
  name: z.string(),
  anchors: z.array(ColorEntrySchema),
})

export const ThemeSuiteSchema = z.object({
  name: z.string(),
  palettes: z.object({
    base: PaletteSchema,
    accent: PaletteSchema,
  }),
  schemes: z.object({
    light: z.boolean().optional(),
    dark: z.boolean().optional(),
  }),
  templateStrategy: z.literal('base'),
})

export const getTheme = async (id: string, request?: Request) => {
  const supabaseServerClient = getSupabaseServerClient(request)
  const { data: currentTheme, error: themeError } = await supabaseServerClient
    .from('theme_histories')
    .select(`
      theme_data,
      search_query,
      id,
      is_cached,
      og_image_url,
      user_id
    `)
    .eq('id', Number.parseInt(id))
    .single()

  let user_name: string | null = null

  if (currentTheme?.user_id) {
    const { data: user, error: userError } = await supabaseServerClient!
      .from('users')
      .select('full_name')
      .eq('id', currentTheme.user_id)
      .single()

    user_name = user?.full_name ?? null
  }

  if (themeError) {
    return null
  }

  const themeData = ThemeSuiteSchema.parse(currentTheme.theme_data)

  return {
    theme: themeData as unknown as ThemeSuiteItemData,
    search: currentTheme.search_query,
    id: currentTheme.id,
    is_cached: currentTheme.is_cached as boolean | null,
    og_image_url: currentTheme.og_image_url as string | null,
    user_name: user_name as string | null,
  }
}
