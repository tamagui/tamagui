import { getConfig } from './conf'
import { ensureThemeVariable, getThemeCSSRules, proxyThemeToParents } from './helpers/themes'
import { ThemeObject } from './types'

export const loadTheme = ({
  name: themeName,
  theme: themeIn,
  insertCSS,
}: {
  name: string
  theme: ThemeObject
  insertCSS?: boolean
}) => {
  const config = getConfig()
  if (!config) {
    throw new Error(`Must run createTamagui once before loading theme`)
  }
  if (config.themes[themeName]) {
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

  if (insertCSS && typeof document !== 'undefined') {
    const style = document.createElement('style')
    style.appendChild(document.createTextNode(cssRules.join('\n')))
    document.head.appendChild(style)
  }

  return {
    theme: themeProxied,
    cssRules,
  }
}
