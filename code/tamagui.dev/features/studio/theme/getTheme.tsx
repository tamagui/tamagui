import { createServerClient } from '@supabase/ssr'
import z from 'zod'
import type { ThemeSuiteItemData } from './types'

const ColorEntrySchema = z.object({
  index: z.number(),
  hue: z.object({
    light: z.number(),
    dark: z.number(),
    sync: z.boolean(),
    syncLeft: z.boolean().optional(),
  }),
  sat: z.object({
    light: z.number(),
    dark: z.number(),
    sync: z.boolean(),
  }),
  lum: z.object({
    light: z.number(),
    dark: z.number(),
  }),
})

const PaletteSchema = z.object({
  name: z.string(),
  anchors: z.array(ColorEntrySchema),
})

const ThemeSuiteSchema = z.object({
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
    .select('theme_data, search_query, id, is_cached, og_image_url')
    .eq('id', Number.parseInt(id))
    .single()

  if (themeError) {
    return null
  }

  const themeData = ThemeSuiteSchema.parse(currentTheme.theme_data)

  return {
    theme: themeData as ThemeSuiteItemData,
    search: currentTheme.search_query,
    id: currentTheme.id,
    is_cached: currentTheme.is_cached as boolean | null,
    og_image_url: currentTheme.og_image_url as string | null,
  }
}
