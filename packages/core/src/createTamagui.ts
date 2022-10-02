import { isRSC, isWeb } from '@tamagui/constants'

import { configListeners, setConfig } from './config'
import { createVariables } from './createVariables'
import { getThemeCSSRules } from './helpers/getThemeCSSRules'
import { getAllRules } from './helpers/insertStyleRule'
import {
  registerCSSVariable,
  tokensValueToVariable,
  variableToCSS,
} from './helpers/registerCSSVariable'
import { ensureThemeVariable, proxyThemeToParents } from './helpers/themes'
import { configureMedia } from './hooks/useMedia'
import { parseFont, registerFontVariables } from './insertFont'
import { Tamagui } from './Tamagui'
import { CreateTamaguiProps, InferTamaguiConfig, TamaguiInternalConfig, ThemeParsed } from './types'

// config is re-run by the @tamagui/static, dont double validate
const createdConfigs = new WeakMap<any, boolean>()

export function createTamagui<Conf extends CreateTamaguiProps>(
  configIn: Conf
): InferTamaguiConfig<Conf> {
  if (createdConfigs.has(configIn)) {
    return configIn as any
  }

  if (process.env.NODE_ENV === 'development') {
    if (!configIn.tokens) {
      throw new Error(`Must define tokens`)
    }
    if (!configIn.themes) {
      throw new Error(`Must define themes`)
    }
    if (!configIn.fonts) {
      throw new Error(`Must define fonts`)
    }
  }

  const fontTokens = Object.fromEntries(
    Object.entries(configIn.fonts!).map(([k, v]) => {
      return [k, createVariables(v, 'f', true)]
    })
  )

  const fontsParsed = (() => {
    const res = {} as typeof fontTokens
    for (const familyName in fontTokens) {
      res[`$${familyName}`] = parseFont(fontTokens[familyName])
    }
    return res!
  })()

  const themeConfig = (() => {
    const themes = { ...configIn.themes }
    let cssRuleSets: string[] = []

    if (isWeb) {
      const declarations: string[] = []
      const fontDeclarations: Record<
        string,
        { name: string; declarations: string[]; language?: string }
      > = {}

      for (const key in configIn.tokens) {
        for (const skey in configIn.tokens[key]) {
          const val = configIn.tokens[key][skey]
          registerCSSVariable(val)
          declarations.push(variableToCSS(val))
        }
      }

      for (const key in fontsParsed) {
        const fontParsed = fontsParsed[key]
        const [name, language] = key.includes('_') ? key.split('_') : [key]
        const fontVars = registerFontVariables(fontParsed)
        fontDeclarations[key] = { name: name.slice(1), declarations: fontVars, language }
      }

      const sep = process.env.NODE_ENV === 'development' ? configIn.cssStyleSeparator || ' ' : ''

      function declarationsToRuleSet(decs: string[], selector = '') {
        return `:root${selector} {${sep}${[...decs].join(`;${sep}`)}${sep}}`
      }

      // non-font
      cssRuleSets.push(declarationsToRuleSet(declarations))

      // fonts
      if (fontDeclarations) {
        for (const key in fontDeclarations) {
          const { name, declarations, language = 'default' } = fontDeclarations[key]
          const fontSelector = `.font_${name}`
          const langSelector = `:root .t_lang-${name}-${language} ${fontSelector}`
          const selectors =
            language === 'default' ? ` ${fontSelector}, ${langSelector}` : langSelector
          const specificRuleSet = declarationsToRuleSet(declarations, selectors)
          cssRuleSets.push(specificRuleSet)
        }
      }
    }

    // dedupe themes to avoid duplicate CSS generation
    type DedupedTheme = {
      names: string[]
      theme: ThemeParsed
    }
    const dedupedThemes: {
      [key: string]: DedupedTheme
    } = {}
    const existing = new WeakMap<ThemeParsed, DedupedTheme>()

    // first, de-dupe and parse them
    for (const themeName in themes) {
      const rawTheme = themes[themeName] as ThemeParsed

      // if existing, avoid
      if (existing.has(rawTheme)) {
        const e = existing.get(rawTheme)!
        themes[themeName] = e.theme
        e.names.push(themeName)
        continue
      }

      // ensure each theme object unique for dedupe
      const theme = { ...rawTheme }
      // parse into variables
      for (const key in theme) {
        // make sure properly names theme variables
        ensureThemeVariable(theme, key)
      }
      themes[themeName] = theme

      // set deduped
      dedupedThemes[themeName] = {
        names: [themeName],
        theme,
      }
      existing.set(rawTheme, dedupedThemes[themeName])
    }

    // then, generate CSS from de-duped
    if (isWeb || isRSC) {
      for (const themeName in dedupedThemes) {
        cssRuleSets = [
          ...cssRuleSets,
          ...getThemeCSSRules({
            config: configIn,
            themeName,
            ...dedupedThemes[themeName],
          }),
        ]
      }
    }

    // proxy upwards to get parent variables (themes are subset going down)
    for (const themeName in themes) {
      themes[themeName] = proxyThemeToParents(themeName, themes[themeName], themes)
    }

    tokensValueToVariable.clear()
    Object.freeze(cssRuleSets)
    const css = cssRuleSets.join('\n')

    return {
      // could improve types but we do ensureThemeVariable so its accurate
      themes,
      cssRuleSets,
      css,
    }
  })()

  // faster lookups token keys become $keys to match input
  const tokensParsed: any = parseTokens(configIn.tokens)

  const getCSS = () => {
    return `${themeConfig.css}\n${getAllRules().join('\n')}`
  }

  const shorthands = configIn.shorthands || {}

  const config: TamaguiInternalConfig = {
    fontLanguages: [],
    defaultTheme: 'light',
    animations: {} as any,
    media: {},
    ...configIn,
    // vite made this into a function if it wasn't set
    shorthands: { ...shorthands },
    inverseShorthands: shorthands
      ? Object.fromEntries(Object.entries(shorthands).map(([k, v]) => [v, k]))
      : {},
    themes: themeConfig.themes as any,
    fontsParsed,
    themeConfig,
    tokensParsed,
    parsed: true,
    getCSS,
  }

  configureMedia(config)
  setConfig(config)

  if (configListeners.size) {
    configListeners.forEach((cb) => cb(config))
    configListeners.clear()
  }

  createdConfigs.set(config, true)

  if (process.env.NODE_ENV === 'development') {
    if (!globalThis['Tamagui']) {
      globalThis['Tamagui'] = Tamagui
    }
  }

  return config as any
}

const parseTokens = (tokens: any) => {
  const res: any = {}
  for (const key in tokens) {
    res[key] = {}
    for (const skey in tokens[key]) {
      res[key][`$${skey}`] = tokens[key][skey]
    }
  }
  return res
}
