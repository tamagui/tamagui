import { configListeners, getHasConfigured, setConfig } from './conf'
import { THEME_CLASSNAME_PREFIX } from './constants/constants'
import { isWeb } from './constants/platform'
import { Variable, createCSSVariable, createVariable, isVariable } from './createVariable'
import { createTamaguiProvider } from './helpers/createTamaguiProvider'
import { getInsertedRules } from './helpers/insertStyleRule'
import { configureMedia } from './hooks/useMedia'
import {
  AnimationDriver,
  CreateTamaguiConfig,
  GenericTamaguiConfig,
  MediaQueryKey,
  TamaguiInternalConfig,
  ThemeObject,
} from './types'

export type CreateTamaguiProps =
  // user then re-defines the types after createTamagui returns the typed object they want
  Partial<Omit<GenericTamaguiConfig, 'themes' | 'tokens' | 'animations'>> & {
    animations?: AnimationDriver<any>
    tokens: GenericTamaguiConfig['tokens']
    themes: {
      [key: string]: {
        [key: string]: string | number | Variable
      }
    }

    // for the first render, determines which media queries are true
    // useful for SSR
    mediaQueryDefaultActive?: MediaQueryKey[]

    // what's between each CSS style rule, set to "\n" to be easier to read
    // defaults: "\n" when NODE_ENV=development, "" otherwise
    cssStyleSeparator?: string

    // (Advanced)
    // on the web, tamagui treats `dark` and `light` themes as special and
    // generates extra CSS to avoid having to re-render the entire page.
    // this CSS relies on specificity hacks that multiply by your sub-themes.
    // this sets the maxiumum number of nested dark/light themes you can do
    // defaults to 3 for a balance, but can be higher if you nest them deeply.
    maxDarkLightNesting?: number

    // adds @media(prefers-color-scheme) media queries for dark/light
    shouldAddPrefersColorThemes?: boolean

    // only if you put the theme classname on the html element we have to generate diff
    themeClassNameOnRoot?: boolean
  }

// config is re-run by the @tamagui/static, dont double validate
const createdConfigs = new WeakMap<any, boolean>()

export function createTamagui<Conf extends CreateTamaguiProps>(
  config: Conf
): Conf extends Partial<CreateTamaguiConfig<infer A, infer B, infer C, infer D, infer E, infer F>>
  ? TamaguiInternalConfig<A, B, C, D, E, F>
  : unknown {
  if (createdConfigs.has(config)) {
    return config as any
  }

  if (process.env.NODE_ENV === 'development') {
    if (!config.tokens) {
      throw new Error(`No tokens provided to Tamagui config`)
    }
    if (!config.themes) {
      throw new Error(`No themes provided to Tamagui config`)
    }
  }

  // test env loads a few times as it runs diff tests
  if (getHasConfigured()) {
    console.warn('Called createTamagui twice! Should never do so')
    // throw new Error(`#000 createTamagui called twice`)
  }

  configureMedia({
    queries: config.media as any,
    defaultActive: config.mediaQueryDefaultActive,
  })

  const themeConfig = (() => {
    const themes = { ...config.themes }
    let cssRules: string[] = []
    const varsByValue = new Map<string, Variable>()

    if (isWeb) {
      // tokens
      const tokenRules = new Set<string>()

      const addVar = (v: Variable) => {
        varsByValue[v.val] = v
        const rule = `--${createCSSVariable(v.name, false)}:${
          typeof v.val === 'number' ? `${v.val}px` : v.val
        }`
        tokenRules.add(rule)
      }

      for (const key in config.tokens) {
        for (const skey in config.tokens[key]) {
          const val = config.tokens[key][skey]
          if (key === 'font') {
            for (const fkey in val) {
              if (fkey === 'family') {
                addVar(val[fkey])
              } else {
                for (const fskey in val[fkey]) {
                  addVar(val[fkey][fskey])
                }
              }
            }
          } else {
            addVar(val)
          }
        }
      }
      const sep = process.env.NODE_ENV === 'development' ? config.cssStyleSeparator || ' ' : ''
      cssRules.push(`:root {${sep}${[...tokenRules].join(`;${sep}`)}${sep}}`)
    }

    // special case for SSR
    const hasDarkLight = 'light' in config.themes && 'dark' in config.themes
    const CNP = `.${THEME_CLASSNAME_PREFIX}`

    // dedupe themes to avoid duplicate CSS generation
    const existing = new WeakMap()
    const dedupedThemes: {
      [key: string]: {
        names: string[]
        theme: ThemeObject
      }
    } = {}

    // first, de-dupe and parse them
    for (const themeName in themes) {
      const rawTheme = themes[themeName]

      // if existing, avoid
      if (existing.has(rawTheme)) {
        const e = existing.get(rawTheme)
        e.names.push(themeName)
        continue
      }

      // parse into variables
      const theme = { ...config.themes[themeName] }
      for (const key in theme) {
        // make sure properly names theme variables
        ensureThemeVariable(theme, key)
      }
      themes[themeName] = theme

      if (themeName === 'light') console.log('made', themeName, theme)

      // set deduped
      dedupedThemes[themeName] = {
        names: [themeName],
        theme,
      }
      existing.set(theme, dedupedThemes[themeName])
    }

    // then, generate from de-duped
    for (const themeName in dedupedThemes) {
      const { theme, names } = dedupedThemes[themeName]
      let vars = ''

      for (const themeKey in theme) {
        if (isWeb) {
          const val = theme[themeKey]
          let varName: string
          let varVal: string

          if (isVariable(val)) {
            varName = val.key
            varVal = val.isFloating ? val.val : createCSSVariable(varName)
          } else {
            varName = varsByValue[val]?.key
            varVal = varName ? createCSSVariable(varName) : `${val}`
          }

          if (process.env.NODE_ENV === 'development') {
            if (!varName) {
              console.warn('no var name in theme', themeName, themeKey)
              continue
            }
          }

          vars += `--${themeKey}:${varVal};`
        }
      }

      if (themeName === 'light') {
        console.log('vars', vars.split(';'))
      }

      if (isWeb) {
        const isDarkOrLightBase = themeName === 'dark' || themeName === 'light'
        const isDark = themeName.startsWith('dark')
        const selectors = names.map((name) => {
          return `${CNP}${name}`
        })

        // since we dont specify dark/light in classnames we have to do an awkward specificity war
        // use config.maxDarkLightNesting to determine how deep you can nest until it breaks
        if (hasDarkLight) {
          for (const subName of names) {
            const childSelector = `${CNP}${subName.replace('dark_', '').replace('light_', '')}`
            const order = isDark ? ['dark', 'light'] : ['light', 'dark']
            if (isDarkOrLightBase) {
              order.reverse()
            }
            const [stronger, weaker] = order
            const max = config.maxDarkLightNesting ?? 3
            new Array(max * 2).fill(undefined).forEach((_, pi) => {
              if (pi % 2 === 1) return
              const parents = new Array(pi + 1).fill(undefined).map((_, psi) => {
                return `${CNP}${psi % 2 === 0 ? stronger : weaker}`
              })
              selectors.push(
                `${(parents.length > 1 ? parents.slice(1) : parents).join(' ')} ${childSelector}`
              )
            })
          }
        }

        const rootSep = config.themeClassNameOnRoot ? '' : ' '
        cssRules.push(`${selectors.map((x) => `:root${rootSep}${x}`).join(', ')} {${vars}}`)

        if (config.shouldAddPrefersColorThemes ?? true) {
          // add media prefers for dark/light base
          if (isDarkOrLightBase) {
            cssRules.push(
              `@media(prefers-color-scheme: ${isDark ? 'dark' : 'light'}) {
    body { background:${theme.background}; color: ${theme.color} }
    :root {${vars} } 
  }`
            )
          }
        }
      }
    }

    varsByValue.clear()
    Object.freeze(cssRules)
    const css = cssRules.join('\n')

    return {
      themes,
      cssRules,
      css,
    }
  })()

  // faster lookups token keys become $keys to match input
  const tokensParsed: any = parseTokens(config.tokens)

  const fontsParsed = (() => {
    if (!config.fonts) {
      throw new Error(`No fonts defined!`)
    }
    const res = {} as typeof config.fonts
    for (const familyName in config.fonts) {
      const family = config.fonts[familyName]
      const parsed = {}
      for (const attrKey in family) {
        const attr = family[attrKey]
        if (attrKey === 'family') {
          parsed[attrKey] = attr
          continue
        }
        parsed[attrKey] = Object.keys(attr).reduce((acc, cur) => {
          acc[`$${cur}`] = attr[cur]
          return acc
        }, {})
      }
      res[`$${familyName}`] = parsed as any
    }
    return res!
  })()

  const getCSS = () => {
    return `${themeConfig.css}\n${getInsertedRules().join('\n')}`
  }

  if (config.shorthands) {
    for (const key in config.shorthands) {
      reversedShorthands[config.shorthands[key]] = key
    }
  }

  const next: TamaguiInternalConfig = {
    fonts: {},
    animations: {} as any,
    shorthands: {},
    media: {},
    ...config,
    themes: themeConfig.themes,
    Provider: createTamaguiProvider({
      getCSS,
      defaultTheme: 'light',
      ...config,
      themes: themeConfig.themes,
    }),
    fontsParsed,
    themeConfig,
    tokensParsed,
    parsed: true,
    getCSS,
  }

  setConfig(next)

  if (configListeners.size) {
    configListeners.forEach((cb) => cb(next))
    configListeners.clear()
  }

  createdConfigs.set(next, true)

  // @ts-expect-error
  return next
}

export const reversedShorthands: Record<string, string> = {}

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

// mutates, freeze after
// shared by createTamagui so extracted here
function ensureThemeVariable(theme: any, key: string) {
  const val = theme[key]
  const themeKey = key
  if (!isVariable(val)) {
    theme[key] = createVariable({
      key: themeKey,
      name: themeKey,
      val,
      isFloating: true,
    })
  } else {
    if (val.name !== themeKey) {
      // rename to theme name
      theme[key] = createVariable({
        key: val.name,
        name: themeKey,
        val: val.val,
      })
    }
  }
}

// for quick testing types:
// const x = createTamagui({
//   shorthands: {},
//   media: {},
//   themes: {},
//   tokens: {
//     font: {},
//     color: {},
//     radius: {},
//     size: {},
//     space: {},
//     zIndex: {},
//   },
// })
