import { getStyleRules } from '@tamagui/helpers'

import { isWeb } from './constants/platform'
import { Variable, createVariable } from './createVariable'
import { createTamaguiProvider } from './helpers/createTamaguiProvider'
import { configureMedia } from './hooks/useMedia'
import {
  CreateTamaguiConfig,
  GenericTamaguiConfig,
  MediaQueryKey,
  TamaguiInternalConfig,
  TamaguiProviderProps,
} from './types'

export type CreateTamaguiProps = TamaguiProviderProps &
  // we omit and re-declare it because we need to allow instantation types to be flexible
  // user then re-defines the types after createTamagui returns the typed object they want
  Omit<GenericTamaguiConfig, 'themes'> & {
    themes: {
      [key: string]: {
        [key: string]: string | number | Variable
      }
    }
    // for ssr/native, will default to active
    mediaQueryDefaultActive?: MediaQueryKey[]
  }

let conf: TamaguiInternalConfig | null

export const getHasConfigured = () => !!conf

export const getTamagui = () => conf!
export const getTokens = () => conf!.tokensParsed
export const getThemes = () => conf!.themes

type ConfigListener = (conf: TamaguiInternalConfig) => void
const configListeners = new Set<ConfigListener>()
export const onConfiguredOnce = (cb: ConfigListener) => {
  if (conf) {
    cb(conf)
  } else {
    configListeners.add(cb)
  }
}

const PREFIX = `theme--`

const createdConfigs = new WeakMap<any, boolean>()

export function createTamagui<Conf extends CreateTamaguiProps>(
  config: Conf
): Conf extends CreateTamaguiConfig<infer A, infer B, infer C, infer D>
  ? TamaguiInternalConfig<A, B, C, D>
  : unknown {
  // config is re-run by the @tamagui/static, dont double validate
  if (createdConfigs.has(config)) {
    return config as any
  }

  // test env loads a few times as it runs diff tests
  if (conf) {
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
      let tokenRule = `:root {`
      const addVar = (v: Variable) => {
        varsByValue[v.val] = v
        const rule = `--${v.name}:${typeof v.val === 'number' ? `${v.val}px` : v.val};`
        tokenRule += rule
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
      cssRules.push(`${tokenRule}\n}`)
    }

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
          vars += `--${themeKey}:${varName ? `var(--${varName});` : `${val}`};`
        }

        // make sure properly names theme variables
        ensureThemeVariable(theme, themeKey)
      }

      if (isWeb) {
        const [themeClassName, parentName] = themeName.includes('-')
          ? themeName.split('-')
          : [themeName, '']
        // tiny hack for now assuming light/dark are typical parentName
        const oppositeName = parentName === 'dark' ? 'light' : 'dark'
        const cssParentSel = parentName ? `.${PREFIX}${parentName}` : ''
        const cssChildSel = `.${PREFIX}${themeClassName}`
        const cssSel = `${cssParentSel} ${cssChildSel}`
        // we need to force specificity
        const cssRule = `${cssSel}, .${PREFIX}${oppositeName} ${cssSel} {\n${vars}\n}`
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

  // we could do this above in theme loop
  // all themes should match key and we just need variable name
  // TODO once w react native we'd want to have a reverse lookup back to value
  const themeParsed: any = {}
  const firstKey = Object.keys(config.themes)[0]
  for (const key in config.themes[firstKey]) {
    // themeParsed[`$${key}`] = config.themes[firstKey][key]
    const val = config.themes[firstKey][key].val
    themeParsed[`$${key}`] = new Variable({ val, name: key })
  }

  const next: TamaguiInternalConfig = {
    // @ts-ignore
    shorthands: {},
    ...config,
    Provider: createTamaguiProvider({
      defaultTheme: 'light',
      ...config,
    }),
    themeConfig,
    themeParsed,
    tokensParsed,
    parsed: true,
    getCSS() {
      return `${themeConfig.css}\n${[...getStyleRules()].join('\n')}`
    },
  }

  conf = next

  if (configListeners.size) {
    configListeners.forEach((cb) => cb(next))
    configListeners.clear()
  }

  createdConfigs.set(next, true)

  // @ts-expect-error
  return next
}

export function getThemeParentClassName(themeName?: string | null) {
  return `theme-parent ${themeName ? `${PREFIX}${themeName}` : ''}`
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
  if (!(val instanceof Variable)) {
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
