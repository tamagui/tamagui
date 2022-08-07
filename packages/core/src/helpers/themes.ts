import { THEME_CLASSNAME_PREFIX } from '../constants/constants'
import { Variable, createVariable, isVariable } from '../createVariable'
import { GetThemeUnwrapped } from '../hooks/getThemeUnwrapped'
import { CreateTamaguiProps, ThemeObject } from '../types'
import { tokensValueToVariable } from './registerCSSVariable'

// mutates, freeze after
// shared by createTamagui so extracted here
export function ensureThemeVariable(theme: any, key: string) {
  const val = theme[key]
  const themeKey = key
  if (!isVariable(val)) {
    theme[key] = createVariable({
      key: themeKey,
      name: themeKey,
      val,
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

export function proxyThemeToParents(
  themeName: string,
  theme: any,
  themes: CreateTamaguiProps['themes']
) {
  // we could test if this is better as just a straight object spread or fancier proxy
  const cur: string[] = []
  // if theme is dark_blue_alt1_Button
  // this will be the parent names in order: ['dark', 'dark_blue', 'dark_blue_alt1"]
  const parents = themeName
    .split('_')
    .slice(0, -1)
    .map((part) => {
      cur.push(part)
      return cur.join('_')
    })

  const hasParents = parents.length

  // proxy fallback values to parent theme values
  return new Proxy(theme, {
    get(target, key) {
      if (key === GetThemeUnwrapped) {
        return theme
      }
      if (!hasParents || Reflect.has(target, key)) {
        return Reflect.get(target, key)
      }
      // check parents
      for (let i = parents.length - 1; i >= 0; i--) {
        const parent = themes[parents[i]]
        if (!parent) {
          continue
        }
        if (Reflect.has(parent, key)) {
          return Reflect.get(parent, key)
        }
      }
      return Reflect.get(target, key)
    },
  })
}

export function getThemeCSSRules({
  config,
  themeName,
  theme,
  names,
}: {
  config: CreateTamaguiProps
  themeName: string
  theme: ThemeObject
  names: string[]
}) {
  const cssRuleSets: string[] = []

  // special case for SSR
  const hasDarkLight = 'light' in config.themes && 'dark' in config.themes
  const CNP = `.${THEME_CLASSNAME_PREFIX}`
  let vars = ''

  // themeToVariableToValueMap.set(theme, {})
  // const varToValMap = themeToVariableToValueMap.get(theme)
  for (const themeKey in theme) {
    const variable = theme[themeKey] as Variable
    let value: any = null
    // if (varToValMap) {
    //   varToValMap[variable.variable] = variable.val
    // }
    if (variable.isFloating || !tokensValueToVariable.has(variable.val)) {
      value = variable.val
    } else {
      value = tokensValueToVariable.get(variable.val)!.variable
    }
    vars += `--${themeKey}:${value};`
  }

  const isDarkOrLightBase = themeName === 'dark' || themeName === 'light'
  const selectors = names.map((name) => {
    return `${CNP}${name}`
  })

  // since we dont specify dark/light in classnames we have to do an awkward specificity war
  // use config.maxDarkLightNesting to determine how deep you can nest until it breaks
  if (hasDarkLight) {
    for (const subName of names) {
      const isDark = isDarkOrLightBase || subName.startsWith('dark_')
      const childSelector = `${CNP}${subName.replace(isDark ? 'dark_' : 'light_', '')}`
      const order = isDark ? ['dark', 'light'] : ['light', 'dark']
      if (isDarkOrLightBase) {
        order.reverse()
      }
      const [stronger, weaker] = order
      const max = config.maxDarkLightNesting ?? 3

      new Array(Math.round(max * 1.5)).fill(undefined).forEach((_, pi) => {
        const isOdd = pi % 2 === 1
        if (isOdd && pi < 3) return
        const parents = new Array(pi + 1).fill(undefined).map((_, psi) => {
          return `${CNP}${psi % 2 === 0 ? stronger : weaker}`
        })
        let parentSelectors = parents.length > 1 ? parents.slice(1) : parents
        if (isOdd) {
          const [_first, second, ...rest] = parentSelectors
          parentSelectors = [second, ...rest, second]
        }
        // avoid .t_light .t_light at the end (make sure child is unique from last parent)
        const lastParentSelector = parentSelectors[parentSelectors.length - 1]
        selectors.push(
          `${parentSelectors.join(' ')} ${
            childSelector === lastParentSelector ? '' : childSelector
          }`
        )
      })
    }
  }

  const rootSep = config.themeClassNameOnRoot ? '' : ' '
  const css = `${selectors.map((x) => `:root${rootSep}${x}`).join(', ')} {${vars}}`
  cssRuleSets.push(css)

  if (config.shouldAddPrefersColorThemes && isDarkOrLightBase) {
    // add media prefers for dark/light base
    const isDark = themeName.startsWith('dark')
    cssRuleSets.push(
      `@media(prefers-color-scheme: ${isDark ? 'dark' : 'light'}) {
body { background:${theme.background}; color: ${theme.color} }
:root {${vars} } 
}`
    )
  }

  return cssRuleSets
}
