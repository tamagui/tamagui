import { createStudioThemes } from '@tamagui/theme-builder'
import type { BuildThemeSuiteProps } from '@tamagui/themes'
import type { ThemeName } from 'tamagui'
import { mutateThemes } from 'tamagui'

const STUDIO_INTERNAL_THEME_NAME = 'studiodemointernal'

export function getStudioInternalThemeName(id: string) {
  return `${STUDIO_INTERNAL_THEME_NAME}${id}` as ThemeName
}

const last = new Map()
const running = new Map()

export const builtThemes: Record<string, any> = {}

if (process.env.NODE_ENV === 'development') {
  globalThis['builtThemes'] = builtThemes
}

export async function updatePreviewTheme(
  args: BuildThemeSuiteProps & {
    id: string
  }
) {
  const cacheKey = JSON.stringify(args)

  // avoid re-running same exact thing
  if (last.get(args.id) === cacheKey) {
    return false
  }
  // async lock
  running.set(args.id, cacheKey)

  const { themes } = createStudioThemes(args)

  // async stale check
  if (running.get(args.id) !== cacheKey) {
    return false
  }

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

  console.warn(`updatePreviewTheme()`, args.id, { themes, insertThemes })

  last.set(args.id, cacheKey)

  if (process.env.NODE_ENV === 'development') {
    builtThemes[args.id] = themes
  }

  mutateThemes({
    themes: insertThemes,
    batch: args.id,
  })

  return true
}
