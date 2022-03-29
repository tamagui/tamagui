import { getStyleRules } from '@tamagui/helpers'

import { configListeners, getHasConfigured, setConfig } from './conf'
import { THEME_CLASSNAME_PREFIX, THEME_NAME_SEPARATOR } from './constants/constants'
import { isWeb } from './constants/platform'
import { Variable, createVariable, isVariable } from './createVariable'
import { createTamaguiProvider } from './helpers/createTamaguiProvider'
import { configureMedia } from './hooks/useMedia'
import {
  AnimationHook,
  CreateTamaguiConfig,
  GenericTamaguiConfig,
  MediaQueryKey,
  TamaguiInternalConfig,
} from './types'

export type CreateTamaguiProps =
  // user then re-defines the types after createTamagui returns the typed object they want
  Partial<Omit<GenericTamaguiConfig, 'themes' | 'tokens' | 'animations'>> & {
    animations?: {
      useAnimations: AnimationHook
      animations: {
        [key: string]: any
      }
      View?: any
      Text?: any
    }
    tokens: GenericTamaguiConfig['tokens']
    themes: {
      [key: string]: {
        [key: string]: string | number | Variable
      }
    }

    // TODO document
    // for ssr/native, will default to active
    mediaQueryDefaultActive?: MediaQueryKey[]
    cssStyleSeparator?: string
    maxDarkLightNesting?: number
  }

const PRE = THEME_CLASSNAME_PREFIX

const createdConfigs = new WeakMap<any, boolean>()

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

export function createTamagui<Conf extends CreateTamaguiProps>(
  config: Conf
): Conf extends Partial<CreateTamaguiConfig<infer A, infer B, infer C, infer D, infer E>>
  ? TamaguiInternalConfig<A, B, C, D, E>
  : unknown {
  // config is re-run by the @tamagui/static, dont double validate
  if (createdConfigs.has(config)) {
    return config as any
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
    let cssRules: string[] = []
    const varsByValue = new Map<string, Variable>()

    if (isWeb) {
      // tokens
      const tokenRules = new Set<string>()

      const addVar = (v: Variable) => {
        varsByValue[v.val] = v
        const rule = `--${v.name}:${typeof v.val === 'number' ? `${v.val}px` : v.val}`
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

    // themes
    for (const themeName in config.themes) {
      // to allow using the same theme with diff names, be sure we don't mutate!
      const theme = { ...config.themes[themeName] }
      config.themes[themeName] = theme

      let vars = ''

      for (const themeKey in theme) {
        if (isWeb) {
          const val = theme[themeKey]
          // TODO sanity check is necessary
          const varName = val instanceof Variable ? val.name : varsByValue[val]?.name
          vars += `--${themeKey}:${varName ? `var(--${varName})` : `${val}`};`
        }

        // make sure properly names theme variables
        ensureThemeVariable(theme, themeKey)
      }

      if (isWeb) {
        const isDarkOrLightBase = themeName === 'dark' || themeName === 'light'
        const isDark = themeName.includes('dark_')
        const selector = `${CNP}${themeName}`
        const addDarkLightSels = hasDarkLight && !isDarkOrLightBase
        const selectors = [selector]
        // since we dont specify dark/light in classnames we have to do an awkward specificity war
        // use config.maxDarkLightNesting to determine how deep you can nest until it breaks
        if (addDarkLightSels) {
          const childSelector = `${CNP}${themeName.replace('dark_', '').replace('light_', '')}`
          const [stronger, weaker] = isDark ? ['dark', 'light'] : ['light', 'dark']
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
        const cssRule = `${selectors.join(', ')} {\n${vars}\n}`
        cssRules.push(cssRule)
      }
    }

    varsByValue.clear()
    Object.freeze(cssRules)

    return {
      cssRules,
      css: cssRules.join('\n'),
    }
  })()

  // faster lookups token keys become $keys to match input
  const tokensParsed: any = parseTokens(config.tokens)

  const getCSS = () => {
    return `${themeConfig.css}\n${[...getStyleRules()].join('\n')}`
  }

  const next: TamaguiInternalConfig = {
    animations: {},
    shorthands: {},
    media: {},
    ...config,
    Provider: createTamaguiProvider({
      getCSS,
      defaultTheme: 'light',
      ...config,
    }),
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

const parseTokens = (tokens: any) => {
  const res: any = {}
  for (const key in tokens) {
    res[key] = {}
    if (key === 'font') {
      for (const family in tokens.font) {
        const obj = {}
        res.font[`$${family}`] = obj
        for (const attrKey in tokens.font[family]) {
          const attr = tokens.font[family][attrKey]
          if (attrKey === 'family') {
            obj[attrKey] = attr
            continue
          }
          obj[attrKey] = Object.keys(attr).reduce((acc, cur) => {
            acc[`$${cur}`] = attr[cur]
            return acc
          }, {})
        }
      }
      continue
    }
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
  if (!isVariable(val)) {
    theme[key] = createVariable({
      name: key,
      val,
    })
  } else {
    if (val.name !== key) {
      // rename to theme name
      theme[key] = createVariable({
        name: key,
        val: val.val,
      })
    }
  }
}
