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
    // for ssr/native, will default to active
    mediaQueryDefaultActive?: MediaQueryKey[]
  }

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
      const sep = process.env.NODE_ENV === 'development' ? '\n  ' : ''
      cssRules.push(`:root {${sep}${[...tokenRules].join(`;${sep}`)}${sep}}`)
    }

    const baseThemeNames = [
      ...new Set(Object.keys(config.themes).filter((x) => !x.includes(THEME_NAME_SEPARATOR))),
    ]

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
        // assuming we have themes in every combo:
        //   ['dark', 'light', 'blue', 'alt1', 'alt2', 'button']
        // light-blue-alt1-button
        // [
        //   '.theme--light .theme--blue .theme--alt1 .theme--button',
        //   '.theme--light-blue .theme--alt1 .theme--button',
        //   '.theme--light-blue-alt1 .theme--button',
        //   '.theme--light-blue-alt1-button',
        // ]
        const selectors = new Set<string>()
        const themeNames = themeName.split(THEME_NAME_SEPARATOR)
        const [name, ...subThemeNames] = themeNames

        let selectorCombos: string[][] = []

        if (!subThemeNames.length) {
          selectorCombos = [[themeName]]
        } else {
          // gather all combinations of joined/separate names
          selectorCombos = [
            // all separate
            [name, ...subThemeNames],
            // all joined
            [[name, ...subThemeNames].join('_')],
          ]
          // get all middle combos
          for (let point = 1; point < themeNames.length; point++) {
            const [before, after] = [themeNames.slice(0, point), themeNames.slice(point)]
            if (before.length > 1) {
              selectorCombos.push([before.join('_'), ...after])
            }
            if (after.length > 1) {
              selectorCombos.push([...before, after.join('_')])
            }
          }
        }

        for (const combo of selectorCombos) {
          const selector = combo.map((x) => `.${THEME_CLASSNAME_PREFIX}${x}`).join(' ')
          selectors.add(selector)
          // add specificity selector hacks
          for (const baseName of baseThemeNames) {
            if (baseName === name) continue
            selectors.add(`.${THEME_CLASSNAME_PREFIX}${baseName} ${selector}`)
          }
        }

        const selectorsStr = [...selectors].join(', ')
        const cssRule = `${selectorsStr} {\n${vars}\n}`
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
    const val = config.themes[firstKey][key]
    themeParsed[`$${key}`] = new Variable({ val, name: key })
  }

  const getCSS = () => {
    return `${themeConfig.css}\n${[...getStyleRules()].join('\n')}`
  }

  const next: TamaguiInternalConfig = {
    animations: {},
    shorthands: {},
    media: {},
    // TODO fix types
    ...(config as any),
    Provider: createTamaguiProvider({
      getCSS,
      defaultTheme: 'light',
      ...config,
    }),
    themeConfig,
    themeParsed,
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
