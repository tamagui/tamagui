import { getStyleRules } from '@tamagui/helpers'

import { Variable, createVariable, isVariable } from './createVariable'
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
export const getTamaguiConfig = () => conf!

type ConfigListener = (conf: TamaguiInternalConfig) => void
const configListeners = new Set<ConfigListener>()
export const onConfiguredOnce = (cb: ConfigListener) => {
  if (conf) {
    cb(conf)
  } else {
    configListeners.add(cb)
  }
}

const THEME_CLASS_PREFIX = `theme--`

export function createTamagui<Conf extends CreateTamaguiProps>(
  config: Conf
): Conf extends CreateTamaguiConfig<infer A, infer B, infer C, infer D>
  ? TamaguiInternalConfig<A, B, C, D>
  : unknown {
  if (conf) {
    throw new Error(`#000 createTamagui called twice`)
  }

  configureMedia({
    queries: config.media as any,
    defaultActive: config.mediaQueryDefaultActive,
  })

  const themeConfig = (() => {
    let cssRules: string[] = []

    // tokens
    let tokenRule = `:root {`
    const varsByValue = new Map<string, Variable>()
    for (const key in config.tokens) {
      for (const skey in config.tokens[key]) {
        const v = config.tokens[key][skey]
        varsByValue[v.val] = v
        tokenRule += `--${v.name}:${typeof v.val === 'number' ? `${v.val}px` : v.val};`
      }
    }
    cssRules.push(`${tokenRule}\n}`)

    // themes
    for (const themeName in config.themes) {
      // to allow using the same theme with diff names, be sure we don't mutate!
      config.themes[themeName] = { ...config.themes[themeName] }
      const theme = config.themes[themeName]
      let vars = ''
      for (const themeKey in theme) {
        const val = theme[themeKey]
        const getVariableCSS = (inv: any) => {
          const v = varsByValue[inv] ?? inv
          return isVariable(v) ? `--${themeKey}:var(--${v.name});` : `--${themeKey}:${v};`
        }
        vars += getVariableCSS(val)

        // TODO sanity check is necessary
        // make everything a variable that gets put into css
        if (!isVariable(val)) {
          theme[themeKey] = createVariable({
            name: themeKey,
            val,
          })
        }
      }

      const [themeClassName, parentName] = themeName.includes('-')
        ? themeName.split('-')
        : [themeName, '']

      const cssRule = `${
        parentName ? `.${THEME_CLASS_PREFIX}${parentName} ` : ''
      }.${THEME_CLASS_PREFIX}${themeClassName} {\n${vars}\n}`

      cssRules.push(cssRule)
    }

    Object.freeze(cssRules)

    return {
      cssRules,
      css: cssRules.join('\n'),
    }
  })()

  // faster lookups token keys become $keys to match input
  const tokensParsed: any = {}
  for (const key in config.tokens) {
    tokensParsed[key] = {}
    for (const skey in config.tokens[key]) {
      tokensParsed[key][`$${skey}`] = config.tokens[key][skey]
    }
  }
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
    ...config,
    Provider: createTamaguiProvider({
      defaultTheme: 'light',
      ...config,
    }),
    themeConfig,
    themeParsed,
    tokensParsed,
    getCSS() {
      return `${themeConfig.css}\n${[...getStyleRules()].join('\n')}`
    },
  }
  conf = next

  if (configListeners.size) {
    configListeners.forEach((cb) => cb(next))
    configListeners.clear()
  }

  // @ts-expect-error
  return next
}

export function getThemeParentClassName(themeName?: string | null) {
  return `theme-parent ${themeName ? `${THEME_CLASS_PREFIX}${themeName}` : ''}`
}

// insertSheet() {
//   // TODO use new react method of inserting
//   const tag = createStyleTag()
//   for (const rule of cssRules) {
//     tag?.sheet?.insertRule(rule)
//   }
// },

// function createStyleTag(): HTMLStyleElement | null {
//   if (typeof document === 'undefined') {
//     return null
//   }
//   const tag = document.createElement('style')
//   tag.className = 'tamagui-css-vars'
//   tag.setAttribute('type', 'text/css')
//   tag.appendChild(document.createTextNode(''))
//   if (!document.head) {
//     throw new Error('expected head')
//   }
//   document.head.appendChild(tag)
//   return tag
// }
