import { getConfig } from './conf'
import { isWeb } from './constants/platform'
import { getThemeCSSRules } from './helpers/getThemeCSSRules'
import { ensureThemeVariable, proxyThemeToParents } from './helpers/themes'
import { ThemeObject } from './types'

export function addTheme({
  name: themeName,
  theme: themeIn,
  insertCSS,
  update,
}: {
  name: string
  theme: ThemeObject
  insertCSS?: boolean
  update?: boolean
}) {
  const config = getConfig()
  if (!config) {
    throw new Error(`Must run createTamagui once before loading theme`)
  }
  if (!update && config.themes[themeName]) {
    throw new Error(`Already defined theme "${themeName}", use updateTheme to change values`)
  }
  const theme = { ...themeIn }
  for (const key in theme) {
    ensureThemeVariable(theme, key)
  }
  const cssRules = getThemeCSSRules({
    config,
    themeName,
    names: [themeName],
    theme,
  })
  const themeProxied = proxyThemeToParents(themeName, theme, config.themes)
  config.themes[themeName] = themeProxied

  if (insertCSS && isWeb) {
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

  return {
    theme: themeProxied,
    cssRules,
  }
}
