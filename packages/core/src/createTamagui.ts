import { isRSC, isWeb } from '@tamagui/constants'

import { configListeners, setConfig } from './config'
import { createVariables, tokensKeysOrdered } from './createVariables'
import { getThemeCSSRules } from './helpers/getThemeCSSRules'
import {
  getAllRules,
  listenForSheetChanges,
  scanAllSheets,
} from './helpers/insertStyleRule'
import {
  registerCSSVariable,
  tokensValueToVariable,
  variableToCSS,
} from './helpers/registerCSSVariable'
import { ensureThemeVariable, proxyThemeToParents } from './helpers/themes'
import { configureMedia } from './hooks/useMedia'
import { parseFont, registerFontVariables } from './insertFont'
import { Tamagui } from './Tamagui'
import {
  CreateTamaguiProps,
  InferTamaguiConfig,
  TamaguiInternalConfig,
  ThemeParsed,
} from './types'

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
      throw new Error('Must define tokens')
    }
    if (!configIn.themes) {
      throw new Error('Must define themes')
    }
    if (!configIn.fonts) {
      throw new Error('Must define fonts')
    }
  }

  scanAllSheets()
  listenForSheetChanges()

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
    const cssRuleSets: string[] = []

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
        fontDeclarations[key] = {
          name: name.slice(1),
          declarations: fontVars,
          language,
        }
      }

      const sep =
        process.env.NODE_ENV === 'development' ? configIn.cssStyleSeparator || ' ' : ''

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
    let themeRuleSets: string[] = []

    if (isWeb || isRSC) {
      for (const themeName in dedupedThemes) {
        themeRuleSets = [
          ...themeRuleSets,
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

    return {
      themes,
      cssRuleSets,
      themeRuleSets,
    }
  })()

  // faster $lookups
  const tokensParsed: any = Object.fromEntries(
    Object.entries(configIn.tokens).map(([k, v]) => {
      const val = Object.fromEntries(Object.entries(v).map(([k, v]) => [`$${k}`, v]))
      tokensKeysOrdered.set(val, tokensKeysOrdered.get(v))
      return [k, val]
    })
  )

  const shorthands = configIn.shorthands || {}

  const config: TamaguiInternalConfig = {
    fontLanguages: [],
    animations: {} as any,
    media: {},
    ...configIn,
    // already processed by createTokens()
    tokens: configIn.tokens as any,
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
    getCSS: (separator = '\n') => {
      return `
._ovs-contain {overscroll-behavior:contain;}
.t_unmounted .t_will-mount {opacity:0;visibility:hidden;}
.is_Text .is_Text {display:inline-flex;}
._dsp_contents {display:contents;}
${themeConfig.cssRuleSets.join(separator)}
${themeConfig.themeRuleSets.join(separator)}
${getAllRules().join(separator)}`
    },
    // const tokens = [...getToken(tokens.size[0])]
    // .spacer-sm + ._dsp_contents._dsp-sm-hidden { margin-left: -var(--${}) }
  }

  configureMedia(config)
  setConfig(config)

  if (configListeners.size) {
    configListeners.forEach((cb) => cb(config))
    configListeners.clear()
  }

  createdConfigs.set(config, true)

  if (process.env.NODE_ENV === 'development') {
    if (process.env.DEBUG?.startsWith('tamagui')) {
      // eslint-disable-next-line no-console
      console.log('Tamagui config:', config)
    }
    if (!globalThis['Tamagui']) {
      globalThis['Tamagui'] = Tamagui
    }
  }

  return config as any
}
