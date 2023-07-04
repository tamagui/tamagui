import { isRSC, isWeb } from '@tamagui/constants'

import { configListeners, setConfig } from './config'
import { Variable, getVariableValue } from './createVariable'
import { createVariables } from './createVariables'
import { getThemeCSSRules } from './helpers/getThemeCSSRules'
import {
  getAllRules,
  listenForSheetChanges,
  scanAllSheets,
} from './helpers/insertStyleRule'
import { registerCSSVariable, variableToCSS } from './helpers/registerCSSVariable'
import { ensureThemeVariable, proxyThemeToParents } from './helpers/themes'
import { configureMedia } from './hooks/useMedia'
import { parseFont, registerFontVariables } from './insertFont'
import { Tamagui } from './Tamagui'
import {
  CreateTamaguiProps,
  GetCSS,
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

  let fontSizeTokens: Set<string> | null = null

  const fontsParsed = (() => {
    const res = {} as typeof fontTokens
    for (const familyName in fontTokens) {
      const font = fontTokens[familyName]
      const fontParsed = parseFont(font)
      res[`$${familyName}`] = fontParsed
      if (!fontSizeTokens && fontParsed.size) {
        fontSizeTokens = new Set(Object.keys(fontParsed.size))
      }
    }
    return res!
  })()

  const specificTokens = {}

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
          const variable = configIn.tokens[key][skey] as Variable

          // set specific tokens (like $size.sm)
          specificTokens[`$${key}.${skey}`] = variable

          if (process.env.NODE_ENV === 'development') {
            if (typeof variable === 'undefined') {
              throw new Error(
                `No value for tokens.${key}.${skey}:\n${JSON.stringify(
                  variable,
                  null,
                  2
                )}`
              )
            }
          }

          registerCSSVariable(variable)
          declarations.push(variableToCSS(variable, key === 'zIndex'))
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
    const existing = new Map<string, DedupedTheme>()

    // first, de-dupe and parse them
    for (const themeName in themes) {
      // forces us to separate the dark/light themes (otherwise we generate bad t_light prefix selectors)
      const darkOrLightSpecificPrefix = themeName.startsWith('dark')
        ? 'dark'
        : themeName.startsWith('light')
        ? 'light'
        : ''

      const rawTheme = themes[themeName] as ThemeParsed

      // dont force referential equality but may need something more consistent than JSON.stringify
      // separate between dark/light
      const key = darkOrLightSpecificPrefix + JSON.stringify(rawTheme)

      // if existing, avoid
      if (existing.has(key)) {
        const e = existing.get(key)!
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

      existing.set(key, dedupedThemes[themeName])
    }

    // proxy upwards to get parent variables (themes are subset going down)
    for (const themeName in themes) {
      themes[themeName] = proxyThemeToParents(themeName, themes[themeName], themes)
    }

    return {
      themes,
      cssRuleSets,
      getThemeRulesSets() {
        // then, generate CSS from de-duped
        let themeRuleSets: string[] = []

        if (isWeb || isRSC) {
          for (const themeName in dedupedThemes) {
            const nextRules = getThemeCSSRules({
              config: configIn,
              themeName,
              ...dedupedThemes[themeName],
            })
            themeRuleSets = [...themeRuleSets, ...nextRules]
          }
        }

        return themeRuleSets
      },
    }
  })()

  // faster $lookups
  const tokensParsed: any = Object.fromEntries(
    Object.entries(configIn.tokens).map(([k, v]) => {
      const val = Object.fromEntries(Object.entries(v).map(([k, v]) => [`$${k}`, v]))
      return [k, val]
    })
  )

  const shorthands = configIn.shorthands || {}

  let lastCSSInsertedRulesIndex = -1

  const getCSS: GetCSS = ({ separator = '\n', sinceLastCall, exclude } = {}) => {
    if (sinceLastCall && lastCSSInsertedRulesIndex >= 0) {
      // after first run with sinceLastCall
      const rules = getAllRules()
      lastCSSInsertedRulesIndex = rules.length
      return rules.slice(lastCSSInsertedRulesIndex).join(separator)
    }

    // set so next time getNewCSS will trigger only new rules
    lastCSSInsertedRulesIndex = 0

    const runtimeStyles = getAllRules().join(separator)

    if (exclude === 'design-system') {
      return runtimeStyles
    }

    const designSystem = `._ovs-contain {overscroll-behavior:contain;}
.t_unmounted .t_will-mount {opacity:0;visibility:hidden;}
.is_Text .is_Text {display:inline-flex;}
._dsp_contents {display:contents;}
${themeConfig.cssRuleSets.join(separator)}`

    return `${designSystem}
${exclude ? '' : themeConfig.getThemeRulesSets().join(separator)}
${runtimeStyles}`
  }

  const getNewCSS: GetCSS = (opts) => getCSS({ ...opts, sinceLastCall: true })

  const defaultFont =
    configIn.defaultFont ||
    // uses font named "body" if present for compat
    ('body' in configIn.fonts ? 'body' : false) ||
    // defaults to the first font to make life easier
    Object.keys(configIn.fonts)[0]

  const config: TamaguiInternalConfig = {
    onlyAllowShorthands: false,
    fontLanguages: [],
    animations: {} as any,
    media: {},
    ...configIn,
    // already processed by createTokens()
    tokens: configIn.tokens as any,
    // vite made this into a function if it wasn't set
    shorthands,
    inverseShorthands: shorthands
      ? Object.fromEntries(Object.entries(shorthands).map(([k, v]) => [v, k]))
      : {},
    themes: themeConfig.themes as any,
    fontsParsed,
    themeConfig,
    tokensParsed,
    parsed: true,
    getNewCSS,
    getCSS,
    defaultFont,
    fontSizeTokens: fontSizeTokens || new Set(),
    specificTokens,
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
      // rome-ignore lint/nursery/noConsoleLog: ok
      console.log('Tamagui config:', config)
    }
    if (!globalThis['Tamagui']) {
      globalThis['Tamagui'] = Tamagui
    }
  }

  return config as any
}
