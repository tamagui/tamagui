import { isServer } from '@tamagui/constants'
import type { ThemeDefinition, ThemeParsed } from '@tamagui/web'
import {
  activeThemeManagers,
  ensureThemeVariable,
  getConfig,
  getThemeCSSRules,
  proxyThemeToParents,
  updateConfig,
} from '@tamagui/web'

export function _mutateTheme(props: {
  name: string
  theme: Partial<Record<keyof ThemeDefinition, any>>
  insertCSS?: boolean
  mutationType?: 'replace' | 'update'
}) {
  if (isServer) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Theme mutation is not supported on server side')
    }
    return
  }
  const config = getConfig()
  const { name: themeName, theme: themeIn, insertCSS, mutationType } = props

  if (process.env.NODE_ENV === 'development') {
    if (!config) {
      throw new Error('No config')
    }
    const theme = config.themes[props.name]
    if (mutationType && !theme) {
      throw new Error(
        `${mutationType === 'replace' ? 'Replace' : 'Update'} theme failed! Theme ${
          props.name
        } does not exist`
      )
    }
    if (!props.mutationType && theme) {
      return { theme }
    }
  }

  const theme = {
    ...(mutationType === 'update' ? config.themes[themeName] ?? {} : {}),
    ...themeIn,
  } as ThemeParsed

  for (const key in theme) {
    ensureThemeVariable(theme, key)
  }

  const themeProxied = proxyThemeToParents(themeName, theme, config.themes)
  config.themes[themeName] = themeProxied

  let cssRules: string[] = []

  updateConfig('themes', { ...config.themes, [themeName]: themeProxied })

  if (process.env.TAMAGUI_TARGET === 'web') {
    if (insertCSS) {
      cssRules = getThemeCSSRules({
        // @ts-ignore this works but should be fixed types
        config,
        themeName,
        names: [themeName],
        theme,
      })
      const id = `t_theme_style_${themeName}`
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

  activeThemeManagers.forEach((manager) => {
    if (manager.state.name === props.name) {
      manager.updateState(
        {
          name: props.name,
          forceTheme: themeProxied,
        },
        true
      )
    }
  })

  // trigger updates in components
  return {
    theme: themeProxied,
    cssRules,
  }
}
