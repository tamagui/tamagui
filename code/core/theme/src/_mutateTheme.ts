import React from 'react'
import { isServer } from '@tamagui/constants'
import type { ThemeDefinition, ThemeParsed } from '@tamagui/web'
import {
  activeThemeManagers,
  ensureThemeVariable,
  getConfig,
  getThemeCSSRules,
  proxyThemeToParents,
  simpleHash,
  updateConfig,
} from '@tamagui/web'
import { startTransition } from '@tamagui/start-transition'

type MutateThemeOptions = {
  mutationType: 'replace' | 'update' | 'add'
  insertCSS?: boolean
  avoidUpdate?: boolean
}

type PartialTheme = Partial<Record<keyof ThemeDefinition, any>>

export type MutateOneThemeProps = {
  name: string
  theme: PartialTheme
}

// need to name the batch in case the theme amount changes so it removes properly
type Batch = boolean | string

// more advanced helper used only internally in studio for now
export function mutateThemes({
  themes,
  batch,
  insertCSS = true,
  ...props
}: Omit<MutateThemeOptions, 'mutationType'> & {
  themes: MutateOneThemeProps[] // if using batch, know that if you later on do addTheme/etc it will break things
  // batch is only useful if you know youre only ever going to change these themes using batch
  // aka only in studio as a preview mode
  batch?: Batch
}) {
  const allThemesProxied: Record<string, ThemeParsed> = {}
  const allThemesRaw: Record<string, ThemeParsed> = {}
  for (const { name, theme } of themes) {
    const res = _mutateTheme({
      ...props,
      name,
      theme,
      // we'll do one update at the end
      avoidUpdate: true,
      // always add which also replaces but doesnt fail first time
      mutationType: 'add',
    })
    if (res) {
      allThemesProxied[name] = res.theme
      allThemesRaw[name] = res.themeRaw
    }
  }

  const cssRules = insertCSS ? insertThemeCSS(allThemesRaw, batch) : []

  startTransition(() => {
    for (const themeName in allThemesProxied) {
      const theme = allThemesProxied[themeName]
      updateThemeConfig(themeName, theme)
      notifyThemeManagersOfUpdate(themeName, theme)
    }
  })

  return {
    themes: allThemesProxied,
    themesRaw: allThemesRaw,
    cssRules,
  }
}

export function _mutateTheme(props: MutateThemeOptions & MutateOneThemeProps) {
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

    if (mutationType !== 'add' && !theme) {
      throw new Error(
        `${mutationType === 'replace' ? 'Replace' : 'Update'} theme failed! Theme ${
          props.name
        } does not exist`
      )
    }
  }

  const theme = {
    ...(mutationType === 'update' ? (config.themes[themeName] ?? {}) : {}),
    ...themeIn,
  } as ThemeParsed

  for (const key in theme) {
    ensureThemeVariable(theme, key)
  }

  const themeProxied = proxyThemeToParents(themeName, theme)

  const response = {
    themeRaw: theme,
    theme: themeProxied,
    cssRules: [] as string[],
  }

  if (props.avoidUpdate) {
    return response
  }

  if (insertCSS) {
    response.cssRules = insertThemeCSS({
      [themeName]: theme,
    })
  }

  updateThemeConfig(themeName, themeProxied)
  notifyThemeManagersOfUpdate(themeName, themeProxied)

  return response
}

function updateThemeConfig(themeName: string, theme: ThemeParsed) {
  const config = getConfig()
  config.themes[themeName] = theme
  updateConfig('themes', config.themes)
}

function notifyThemeManagersOfUpdate(themeName: string, theme: ThemeParsed) {
  activeThemeManagers.forEach((manager) => {
    if (manager.state.name === themeName) {
      manager.updateStateFromProps(
        {
          name: themeName,
          forceTheme: theme,
        },
        true
      )
    }
  })
}

function insertThemeCSS(themes: Record<string, PartialTheme>, batch: Batch = false) {
  if (process.env.TAMAGUI_TARGET !== 'web') {
    return []
  }

  const config = getConfig()
  let cssRules: string[] = []

  for (const themeName in themes) {
    const theme = themes[themeName]

    const rules = getThemeCSSRules({
      config,
      themeName,
      names: [themeName],
      hasDarkLight: true,
      theme,
    })

    cssRules = [...cssRules, ...rules]

    if (!batch) {
      updateStyle(`t_theme_style_${themeName}`, rules)
    }
  }

  if (batch) {
    const id = simpleHash(typeof batch == 'string' ? batch : Object.keys(themes).join(''))
    updateStyle(`t_theme_style_${id}`, cssRules)
  }

  return cssRules
}

function updateStyle(id: string, rules: string[]) {
  const existing = document.querySelector(`#${id}`)
  const style = document.createElement('style')
  style.id = id
  style.appendChild(document.createTextNode(rules.join('\n')))
  document.head.appendChild(style)
  if (existing) {
    existing.parentElement?.removeChild(existing)
  }
}
