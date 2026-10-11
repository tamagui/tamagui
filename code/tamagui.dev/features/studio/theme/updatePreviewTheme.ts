import type { ThemeName } from 'tamagui'
import { debounce, mutateThemes } from 'tamagui'
import { createStudioThemes } from './palettes'
import type { BuildThemeSuiteProps } from './types'

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
    themes: any
  }
>()

const styleId = 't_theme_style_themes'

// the inserted css and the cache describe the same state, so they reset together
export function clearPreviewTheme() {
  themeCache.clear()
  if (typeof document !== 'undefined') {
    const style = document.getElementById(styleId)
    if (style) {
      style.textContent = ''
    }
  }
}

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
    JSON.stringify(cached.schemes) === JSON.stringify(args.schemes)
  ) {
    return false
  }

  const { themes } = createStudioThemes(args)

  themeCache.set(cacheKey, {
    palettes: args.palettes,
    schemes: args.schemes,
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

  if (typeof document !== 'undefined') {
    const internalId = getStudioInternalThemeName(args.id)
    const rules: string[] = []

    for (const themeName in themes) {
      const theme = themes[themeName]
      const [scheme, ...rest] = themeName.split('_')
      const subTheme = rest.length ? `_${rest.join('_')}` : ''
      const targetClass = `t_${internalId}${subTheme}`

      const decls: string[] = []
      for (const key in theme) {
        const val = theme[key]
        if (val !== undefined && val !== null) {
          decls.push(`--${key}: ${val}`)
        }
      }

      const selectors = [
        `:root.t_${scheme} .${targetClass}`,
        `:root.t_${scheme} .${targetClass}:not(#t_theme_full_name)`,
        `:root .t_${scheme}.${targetClass}`,
        `.t_${scheme}.${targetClass}`,
        `.t_${scheme} .${targetClass}`,
        `.t_${targetClass}`,
      ]

      rules.push(`${selectors.join(',\n')} {\n  ${decls.join(';\n  ')};\n}`)
    }

    let style = document.getElementById(styleId) as HTMLStyleElement | null
    if (!style) {
      style = document.createElement('style')
      style.id = styleId
      document.head.appendChild(style)
    }
    style.textContent = rules.join('\n\n')
  }

  // the site ships extracted css, so core emits no theme rules here; the css
  // above is the only source and core must not replace its style element
  mutateThemes({
    themes: insertThemes,
    insertCSS: false,
  })

  return true
}
