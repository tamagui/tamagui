import { getConfigMaybe, setConfig, setTokens } from './config'
import type { DeepVariableObject } from './createVariables'
import { createVariables } from './createVariables'
import { defaultAnimationDriver } from './helpers/defaultAnimationDriver'
import {
  buildCSSRuleSets,
  createFontCSS,
  createThemeCSS,
  createTokenCSS,
  getCSS as getCSSHelper,
} from './helpers/createDesignSystem'
import { scanAllSheets } from './helpers/insertStyleRule'
import { proxyThemesToParents } from './helpers/proxyThemeToParents'
import { ensureThemeVariable } from './helpers/themes'
import { configureMedia } from './hooks/useMedia'
import { parseFont, registerFontVariables } from './insertFont'
import { Tamagui } from './Tamagui'
import type {
  CreateTamaguiProps,
  DedupedTheme,
  DedupedThemes,
  GenericFont,
  GetCSS,
  InferTamaguiConfig,
  TamaguiInternalConfig,
  ThemeParsed,
  ThemesLikeObject,
  TokensMerged,
  TokensParsed,
  Variable,
} from './types'

/**
 * Determines if a token category should have px units added.
 * Following the principle: only add px to predefined categories that need them.
 * Custom categories default to unitless.
 */
function shouldTokenCategoryHaveUnits(category: string): boolean {
  // From TokenCategories type: 'color' | 'space' | 'size' | 'radius' | 'zIndex'
  // These are the only predefined categories that should get px units
  const UNIT_CATEGORIES = new Set(['size', 'space', 'radius'])

  // Only add px to predefined dimensional categories
  // Custom categories (like 'opacity', 'customWidth') default to unitless
  return UNIT_CATEGORIES.has(category)
}

export function createTamagui<Conf extends CreateTamaguiProps>(
  configIn: Conf
): InferTamaguiConfig<Conf> {
  // if config already exists (e.g., from another copy of tamagui in vite ssr), reuse it
  const existingConfig = getConfigMaybe()

  if (existingConfig) {
    // merge it and re-run since this new instance may add config
    // or maybe a test case
    configIn = { ...existingConfig, ...configIn }
  }

  // ensure variables
  const tokensParsed: TokensParsed = {} as any
  const tokens = createVariables(configIn.tokens || {})

  if (configIn.tokens) {
    // faster lookups
    const tokensMerged: TokensMerged = {} as any
    for (const cat in tokens) {
      tokensParsed[cat] = {}
      tokensMerged[cat] = {}
      const tokenCat = tokens[cat]
      for (const key in tokenCat) {
        const val = tokenCat[key]
        const prefixedKey = `$${key}`
        tokensParsed[cat][prefixedKey] = val as any
        tokensMerged[cat][prefixedKey] = val as any
        tokensMerged[cat][key] = val as any
      }
    }
    setTokens(tokensMerged)
  }

  let foundThemes: DedupedThemes | undefined
  if (configIn.themes) {
    const noThemes = Object.keys(configIn.themes).length === 0
    if (noThemes && !process.env.TAMAGUI_DID_OUTPUT_CSS) {
      foundThemes = scanAllSheets(noThemes, tokensParsed)
    }
  }

  let fontSizeTokens: Set<string> | null = null
  let fontsParsed:
    | {
        [k: string]: DeepVariableObject<GenericFont<string>>
      }
    | undefined

  if (configIn.fonts) {
    const fontTokens = Object.fromEntries(
      Object.entries(configIn.fonts).map(([k, v]) => {
        return [k, createVariables(v, 'f', true)]
      })
    )

    fontsParsed = (() => {
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
  }

  const specificTokens = {}

  const themeConfig = (() => {
    // populate specificTokens (needed for runtime)
    const sortedTokenKeys = Object.keys(tokens).sort()
    for (const key of sortedTokenKeys) {
      const sortedSubKeys = Object.keys(tokens[key]).sort()
      for (const skey of sortedSubKeys) {
        const variable = tokens[key][skey] as any as Variable
        specificTokens[`$${key}.${skey}`] = variable

        if (process.env.NODE_ENV === 'development') {
          if (typeof variable === 'undefined') {
            throw new Error(
              `No value for tokens.${key}.${skey}:\n${JSON.stringify(variable, null, 2)}`
            )
          }
        }
      }
    }

    // CSS generation (tree-shaken when TAMAGUI_DID_OUTPUT_CSS is set)
    const declarations = createTokenCSS(tokens as any, shouldTokenCategoryHaveUnits)
    const fontDeclarations = createFontCSS(fontsParsed, registerFontVariables)
    const cssRuleSets = buildCSSRuleSets(declarations, fontDeclarations)

    const themesIn = configIn.themes as ThemesLikeObject
    const dedupedThemes = foundThemes ?? getThemesDeduped(themesIn, tokens.color)
    const themes = proxyThemesToParents(dedupedThemes)

    return {
      themes,
      cssRuleSets,
      getThemeRulesSets() {
        return createThemeCSS(dedupedThemes, configIn)
      },
    }
  })()

  // Keep track of user-provided shorthands separately
  const userShorthands = configIn.shorthands || {}

  // Merge built-in shorthands with user shorthands (user takes precedence)
  const shorthands = { ...builtinShorthands, ...userShorthands }

  const lastCSSIndex = { value: -1 }

  const getCSS: GetCSS = (opts = {}) => {
    return getCSSHelper(themeConfig, opts, lastCSSIndex)
  }

  const getNewCSS: GetCSS = (opts) => getCSS({ ...opts, sinceLastCall: true })

  const defaultFontSetting = configIn.settings?.defaultFont

  const defaultFont = (() => {
    let val = defaultFontSetting
    if (val?.[0] === '$') {
      val = val.slice(1)
    }
    return val
  })()

  const defaultPositionSetting = configIn.settings?.defaultPosition || 'static'

  const defaultProps = configIn.defaultProps || {}
  // apply defaultPosition via defaultProps when not static
  if (process.env.TAMAGUI_TARGET === 'web' && defaultPositionSetting !== 'static') {
    defaultProps.View = {
      ...defaultProps.View,
      position: defaultPositionSetting,
    }
  }

  // ensure prefixed with $
  const defaultFontToken = defaultFont ? `$${defaultFont}` : ''

  // Text inherits font from root via CSS, no need for default fontFamily
  // only explicit fontFamily prop should add font_* class

  const config: TamaguiInternalConfig = {
    fonts: {},
    onlyAllowShorthands: false,
    fontLanguages: [],
    animations: defaultAnimationDriver,
    media: {},
    ...configIn,
    defaultProps,
    settings: {
      webContainerType: 'inline-size',
      ...configIn.settings,
    },
    tokens: tokens as any,
    // vite made this into a function if it wasn't set
    shorthands,
    userShorthands,
    inverseShorthands: shorthands
      ? Object.fromEntries(Object.entries(shorthands).map(([k, v]) => [v, k]))
      : {},
    themes: themeConfig.themes as any,
    fontsParsed: fontsParsed || {},
    themeConfig,
    tokensParsed: tokensParsed as any,
    parsed: true,
    getNewCSS,
    getCSS,
    defaultFont,
    fontSizeTokens: fontSizeTokens || new Set(),
    specificTokens,
    defaultFontToken,
    // const tokens = [...getToken(tokens.size[0])]
    // .spacer-sm + ._dsp_contents._dsp-sm-hidden { margin-left: -var(--${}) }
  }

  setConfig(config)
  configureMedia(config)

  if (process.env.NODE_ENV === 'development') {
    if (process.env.DEBUG?.startsWith('tamagui')) {
      console.info('Tamagui config:', config)
    }
    if (!globalThis['Tamagui']) {
      globalThis['Tamagui'] = Tamagui
    }
  }

  return config as any
}

// dedupes the themes if given them via JS config
function getThemesDeduped(
  themes: ThemesLikeObject,
  colorTokens?: Record<string, any>
): DedupedThemes {
  const dedupedThemes: DedupedThemes = []
  const existing = new Map<string, DedupedTheme>()

  // Sort theme names for deterministic CSS output order
  const sortedThemeNames = Object.keys(themes).sort()

  // first, de-dupe and parse them
  for (const themeName of sortedThemeNames) {
    // forces us to separate the dark/light themes (otherwise we generate bad t_light prefix selectors)
    const darkOrLightSpecificPrefix = themeName.startsWith('dark')
      ? 'dark'
      : themeName.startsWith('light')
        ? 'light'
        : ''

    const rawTheme = themes[themeName]

    // dont force referential equality but may need something more consistent than JSON.stringify
    // separate between dark/light
    const key = darkOrLightSpecificPrefix + JSON.stringify(rawTheme)

    // if existing, avoid
    if (existing.has(key)) {
      const e = existing.get(key)!
      e.names.push(themeName)
      continue
    }

    // ensure each theme object unique for dedupe
    // is ThemeParsed because we call ensureThemeVariable
    // color tokens are spread first as fallbacks, theme values take precedence
    const theme = { ...colorTokens, ...rawTheme } as any as ThemeParsed

    // parse into variables
    for (const key in theme) {
      // make sure properly names theme variables
      ensureThemeVariable(theme, key)
    }

    // set deduped
    const deduped: DedupedTheme = {
      names: [themeName],
      theme,
    }
    dedupedThemes.push(deduped)
    existing.set(key, deduped)
  }

  return dedupedThemes
}

// Built-in shorthands used internally for short classname generation
const builtinShorthands = {
  bblr: 'borderBottomLeftRadius',
  bbrr: 'borderBottomRightRadius',
  bbs: 'borderBottomStyle',
  bls: 'borderLeftStyle',
  brc: 'borderRightColor',
  brs: 'borderRightStyle',
  brw: 'borderRightWidth',
  bs: 'borderStyle',
  btc: 'borderTopColor',
  btlr: 'borderTopLeftRadius',
  btrr: 'borderTopRightRadius',
  bts: 'borderTopStyle',
  btw: 'borderTopWidth',
  bw: 'borderWidth',
  bxs: 'boxSizing',
  bxsh: 'boxShadow',
  col: 'color',
  cur: 'cursor',
  dsp: 'display',
  fb: 'flexBasis',
  fd: 'flexDirection',
  ff: 'fontFamily',
  fs: 'fontSize',
  fst: 'fontStyle',
  fw: 'fontWeight',
  fwr: 'flexWrap',
  // height: 'h',
  lh: 'lineHeight',
  ls: 'letterSpacing',
  o: 'opacity',
  ov: 'overflow',
  ox: 'overflowX',
  oy: 'overflowY',
  pe: 'pointerEvents',
  pos: 'position',
  td: 'textDecorationLine',
  tr: 'transform',
  tt: 'textTransform',
  va: 'verticalAlign',
  wb: 'wordBreak',
  // width: 'w',
  ws: 'whiteSpace',
  ww: 'wordWrap',
} as const
