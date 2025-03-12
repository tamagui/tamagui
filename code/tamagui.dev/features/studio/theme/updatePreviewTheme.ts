import { createStudioThemes } from '@tamagui/theme-builder'
import type { BuildThemeSuiteProps } from '@tamagui/themes'
import type { ThemeName } from 'tamagui'
import { debounce, mutateThemes } from 'tamagui'

const STUDIO_INTERNAL_THEME_NAME = 'studiodemointernal'

export function getStudioInternalThemeName(id: string) {
  return `${STUDIO_INTERNAL_THEME_NAME}${id}` as ThemeName
}

const running = new Map()

export const builtThemes: Record<string, any> = {}
export let lastInserted = null as any

if (process.env.NODE_ENV === 'development') {
  globalThis['builtThemes'] = builtThemes
}

const themeCache = new Map<
  string,
  {
    palettes: any
    schemes: any
    templateStrategy: string
    themes: any
  }
>()

export async function updatePreviewTheme(
  args: BuildThemeSuiteProps & {
    id: string
  }
) {
  const cacheKey = args.id
  const cached = themeCache.get(cacheKey)

  if (
    cached &&
    JSON.stringify(cached.palettes) === JSON.stringify(args.palettes) &&
    JSON.stringify(cached.schemes) === JSON.stringify(args.schemes) &&
    cached.templateStrategy === args.templateStrategy
  ) {
    return false
  }

  const { themes } = createStudioThemes(args)

  themeCache.set(cacheKey, {
    palettes: args.palettes,
    schemes: args.schemes,
    templateStrategy: args.templateStrategy ?? 'base',
    themes,
  })

  let insertThemes: any[] = []

  for (const themeName in themes) {
    const theme = themes[themeName]
    const [scheme, ...rest] = themeName.split('_')
    const finalName = [scheme, getStudioInternalThemeName(args.id), ...rest].join('_')
    insertThemes.push({
      name: finalName,
      theme,
    })
  }

  if (process.env.NODE_ENV === 'development') {
    builtThemes[args.id] = themes
  }

  lastInserted = themes

  console.warn('UPDATE themes', insertThemes)
  mutateThemes({
    themes: insertThemes,
    batch: 'themes',
  })

  return true
}
