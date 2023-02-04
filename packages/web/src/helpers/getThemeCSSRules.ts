import { simpleHash } from '@tamagui/helpers'

import { THEME_CLASSNAME_PREFIX } from '../constants/constants'
import { Variable, variableToString } from '../createVariable'
import { CreateTamaguiProps, ThemeParsed } from '../types'
import { tokensValueToVariable } from './registerCSSVariable'

export function getThemeCSSRules({
  config,
  themeName,
  theme,
  names,
}: {
  config: CreateTamaguiProps
  themeName: string
  theme: ThemeParsed
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
    if (!tokensValueToVariable.has(variable.val)) {
      value = variable.val
    } else {
      value = tokensValueToVariable.get(variable.val)!.variable
    }
    // Hash themeKey in case it has invalid chars too
    vars += `--${simpleHash(themeKey, 40)}:${value};`
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
      const max = config.maxDarkLightNesting ?? 3

      if (!(isDark || subName.startsWith('light_'))) {
        // neither light nor dark subtheme, just generate one selector with :root:root which
        // will override all :root light/dark selectors generated below
        selectors.push(`:root:root ${CNP}${subName}`)
        continue
      }

      const childSelector = `${CNP}${subName.replace(isDark ? 'dark_' : 'light_', '')}`
      const order = isDark ? ['dark', 'light'] : ['light', 'dark']
      if (isDarkOrLightBase) {
        order.reverse()
      }
      const [stronger, weaker] = order
      const numSelectors = Math.round(max * 1.5)

      for (let pi = 0; pi < numSelectors; pi++) {
        const isOdd = pi % 2 === 1
        if (isOdd && pi < 3) continue
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
      }
    }
  }

  const selectorsString = selectors.map((x) => {
    // only do our :root attach if it's not light/dark - not support sub themes on root saves a lot of effort/size
    // this isBaseTheme logic could probably be done more efficiently above
    const isBaseTheme =
      x === '.t_dark' ||
      x === '.t_light' ||
      x.startsWith('.t_dark ') ||
      x.startsWith('.t_light ')
    const rootSep = isBaseTheme && config.themeClassNameOnRoot ? '' : ' '
    return `:root${rootSep}${x}`
  })
  const css = `${selectorsString.join(', ')} {${vars}}`
  cssRuleSets.push(css)

  if (config.shouldAddPrefersColorThemes && isDarkOrLightBase) {
    // add media prefers for dark/light base
    const isDark = themeName.startsWith('dark')
    cssRuleSets.push(
      `@media(prefers-color-scheme: ${isDark ? 'dark' : 'light'}) {
body { background:${variableToString(theme.background)}; color: ${variableToString(
        theme.color
      )} }
:root {${vars} } 
}`
    )
  }

  return cssRuleSets
}
