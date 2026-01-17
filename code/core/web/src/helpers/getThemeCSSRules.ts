import { simpleHash } from '@tamagui/helpers'
import { getSetting } from '../config'
import { THEME_CLASSNAME_PREFIX } from '../constants/constants'
import { variableToString } from '../createVariable'
import type { CreateTamaguiProps, ThemeParsed, Variable } from '../types'
import { tokensValueToVariable } from './registerCSSVariable'
import { sortString } from './sortString'

export function getThemeCSSRules(props: {
  config: CreateTamaguiProps
  themeName: string
  theme: ThemeParsed
  names: string[]
  hasDarkLight?: boolean
}) {
  const cssRuleSets: string[] = []

  if (process.env.TAMAGUI_TARGET === 'native') {
    return cssRuleSets
  }
  if (
    !process.env.TAMAGUI_DOES_SSR_CSS ||
    process.env.TAMAGUI_DOES_SSR_CSS === 'mutates-themes' ||
    process.env.TAMAGUI_DOES_SSR_CSS === 'false'
  ) {
    const { themeName, theme, names } = props

    const CNP = `.${THEME_CLASSNAME_PREFIX}`
    let vars = ''

    for (const themeKey in theme) {
      const variable = theme[themeKey] as Variable
      let value: any = null

      if (!tokensValueToVariable.has(variable.val)) {
        value = variable.val
      } else {
        value = tokensValueToVariable.get(variable.val)!.variable
      }
      // Hash themeKey in case it has invalid chars too
      vars += `--${process.env.TAMAGUI_CSS_VARIABLE_PREFIX || ''}${simpleHash(
        themeKey,
        40
      )}:${value};`
    }

    const selectors = names.map((name) => `${CNP}${name}`).sort(sortString)

    // only do our :root attach if it's not light/dark - not support sub themes on root saves a lot of effort/size
    const selectorsString =
      selectors
        .map((x) => {
          const rootSep =
            isBaseTheme(x) &&
            (getSetting('addThemeClassName') === 'html' ||
              getSetting('addThemeClassName') === 'body')
              ? ''
              : ' '
          return `:root${rootSep}${x}`
        })
        .join(', ') + `, .tm_xxt`

    const css = `${selectorsString} {${vars}}`
    cssRuleSets.push(css)

    if (getSetting('shouldAddPrefersColorThemes')) {
      const bgString = theme.background
        ? `background:${variableToString(theme.background)};`
        : ''
      const fgString = theme.color ? `color:${variableToString(theme.color)}` : ''
      const bodyRules = `body{${bgString}${fgString}}`
      const isDark = themeName.startsWith('dark')
      const baseName = isDark ? 'dark' : 'light'
      const lessSpecificSelectors = selectors
        .map((x) => {
          if (x == darkSelector || x === lightSelector) return `:root`
          if (
            (isDark && x.startsWith(lightSelector)) ||
            (!isDark && x.startsWith(darkSelector))
          ) {
            return
          }
          return x.replace(/^\.t_(dark|light) /, '').trim()
        })
        .filter(Boolean)
        .join(', ')

      const themeRules = `${lessSpecificSelectors} {${vars}}`
      const prefersMediaSelectors = `@media(prefers-color-scheme:${baseName}){
    ${bodyRules}
    ${themeRules}
  }`
      cssRuleSets.push(prefersMediaSelectors)
    }

    const selectionStyles = getSetting('selectionStyles')
    if (selectionStyles) {
      const rules = selectionStyles(theme as any)
      if (rules) {
        const selectionSelectors = selectors.map((s) => `${s} ::selection`).join(', ')
        const styles = Object.entries(rules)
          .flatMap(([k, v]) =>
            v
              ? `${k === 'backgroundColor' ? 'background' : k}:${variableToString(v)}`
              : []
          )
          .join(';')
        if (styles) {
          const css = `${selectionSelectors}{${styles}}`
          cssRuleSets.push(css)
        }
      }
    }
  }

  return cssRuleSets
}

const darkSelector = '.t_dark'
const lightSelector = '.t_light'
const isBaseTheme = (x: string) =>
  x === darkSelector ||
  x === lightSelector ||
  x.startsWith('.t_dark ') ||
  x.startsWith('.t_light ')
