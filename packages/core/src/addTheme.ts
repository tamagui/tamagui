import { isWeb } from '@tamagui/constants'

import { getConfig, updateConfig } from './config'
import { getThemeCSSRules } from './helpers/getThemeCSSRules'
import { ensureThemeVariable, proxyThemeToParents } from './helpers/themes'
import { ThemeDefinition, ThemeParsed } from './types'

export function addTheme({
  name: themeName,
  theme: themeIn,
  insertCSS,
  update,
}: {
  name: string
  theme: ThemeDefinition
  insertCSS?: boolean
  update?: boolean
}) {
  const config = getConfig()
  if (process.env.NODE_ENV === 'development') {
    if (!config) {
      throw new Error(`Must run createTamagui once before loading theme`)
    }
    if (!update && config.themes[themeName]) {
      throw new Error(`Already defined theme "${themeName}", use updateTheme to change values`)
    }
  }

  const theme = { ...themeIn } as ThemeParsed
  for (const key in theme) {
    ensureThemeVariable(theme, key)
  }

  const themeProxied = proxyThemeToParents(themeName, theme, config.themes)
  config.themes[themeName] = themeProxied

  let cssRules: string[] = []

  if (isWeb) {
    if (insertCSS) {
      cssRules = getThemeCSSRules({
        // @ts-ignore this works but should be fixed types
        config,
        themeName,
        names: [themeName],
        theme,
      })
      const id = `tamagui_theme_style_${themeName}`
      const existing = document.querySelector(`#${id}`)
      const style = document.createElement('style')
      style.id = id
      style.appendChild(document.createTextNode(cssRules.join('\n')))
      document.head.appendChild(style)
      if (existing) {
        existing.parentElement?.removeChild(existing)
      }
    }
  }

  updateConfig('themes', { ...config.themes, [themeName]: themeProxied })

  // trigger updates in components

  return {
    theme: themeProxied,
    cssRules,
  }
}
