import { simpleHash } from '@tamagui/helpers'
import { getSetting } from '../config'
import { THEME_CLASSNAME_PREFIX } from '../constants/constants'
import { variableToString } from '../createVariable'
import type { CreateTamaguiProps, ThemeParsed, Variable } from '../types'
import { getOrCreateVariable, getOrCreateMutatedVariable } from './registerCSSVariable'
import { sortString } from './sortString'

const darkLight = ['dark', 'light']
const lightDark = ['light', 'dark']

export function getThemeCSSRules(props: {
  config: CreateTamaguiProps
  themeName: string
  theme: ThemeParsed
  names: string[]
  hasDarkLight?: boolean
  // Use mutated variable prefix (mt) instead of regular (t) - for dynamic theme mutation
  useMutatedVariables?: boolean
}): string[] {
  if (process.env.TAMAGUI_DID_OUTPUT_CSS) {
    // empty - CSS already extracted at build time
  } else if (process.env.TAMAGUI_TARGET === 'native') {
    // no CSS on native
  } else if (
    !process.env.TAMAGUI_DOES_SSR_CSS ||
    process.env.TAMAGUI_DOES_SSR_CSS === 'mutates-themes' ||
    process.env.TAMAGUI_DOES_SSR_CSS === 'false'
  ) {
    const cssRuleSets: string[] = []
    const { config, themeName, theme, names } = props

    // special case for SSR
    const hasDarkLight =
      props.hasDarkLight ??
      (config.themes && ('light' in config.themes || 'dark' in config.themes))

    const CNP = `.${THEME_CLASSNAME_PREFIX}`
    let vars = ''

    const variableCreator = props.useMutatedVariables
      ? getOrCreateMutatedVariable
      : getOrCreateVariable

    for (const themeKey in theme) {
      const variable = theme[themeKey] as Variable
      // needsPx values (px() config variables, "Npx" theme strings) must keep
      // their unit in CSS while staying numeric for native
      const value = variableCreator(
        variable.needsPx ? `${variable.val}px` : variable.val
      ).variable
      // Hash themeKey in case it has invalid chars too
      vars += `--${process.env.TAMAGUI_CSS_VARIABLE_PREFIX || ''}${simpleHash(
        themeKey,
        40
      )}:${value};`
    }

    const isDarkBase = themeName === 'dark'
    const isLightBase = themeName === 'light'
    const baseSelectors = names.map((name) => `${CNP}${name}`)
    const selectorsSet = new Set(isDarkBase || isLightBase ? baseSelectors : [])
    const selectorScheme = new Map<string, 'light' | 'dark'>()

    // The full resolved name is authoritative. `:not(#t_theme_full_name)` is
    // an always-matching specificity anchor: a bounded relative selector for
    // another scheme can also match through intervening Theme scopes, but it
    // must never override this exact name. The relative family below remains
    // only for markup emitted by older runtimes/extractors that lacks the full
    // class. It can go once mixed-version and previously extracted markup no
    // longer need that class-shape compatibility.
    for (const name of names) {
      selectorsSet.add(`${CNP}${name}:not(#t_theme_full_name)`)
    }

    // since we dont specify dark/light in classnames we have to do an awkward specificity war
    // hardcoded to support 2 levels of nesting (e.g. light > dark or dark > light)
    if (hasDarkLight) {
      const maxDepth = 2

      for (const subName of names) {
        // identical themes dedupe into one canonical name, and an alias can carry
        // the opposite scheme to the name it deduped into: light_inverse IS dark,
        // so it arrives here under themeName "dark". its own prefix therefore
        // decides its scheme, and the base only answers for an unprefixed name.
        // reading the base first pointed every cross-scheme alias at the wrong
        // parent, which silently made <Theme name="inverse"> a no-op.
        const hasDarkPrefix = subName === 'dark' || subName.startsWith('dark_')
        const hasLightPrefix = subName === 'light' || subName.startsWith('light_')
        const isDark = hasDarkPrefix || (!hasLightPrefix && isDarkBase)
        const isLight = hasLightPrefix || (!hasDarkPrefix && isLightBase)

        if (!(isDark || isLight)) {
          // neither light nor dark subtheme, just generate one selector with :root:root which
          // will override all :root light/dark selectors generated below
          selectorsSet.add(`${CNP}${subName}`)
          continue
        }

        const childSelector = `${CNP}${subName.replace(/^(dark|light)_/, '')}`
        const order = isDark ? darkLight : lightDark
        const [stronger, weaker] = order
        const numSelectors = Math.round(maxDepth * 1.5)

        for (let depth = 0; depth < numSelectors; depth++) {
          const isOdd = depth % 2 === 1

          if (isOdd && depth < 3) {
            continue
          }

          const parents = new Array(depth + 1).fill(0).map((_, idx) => {
            return `${CNP}${idx % 2 === 0 ? stronger : weaker}`
          })

          let parentSelectors = parents.length > 1 ? parents.slice(1) : parents

          if (isOdd) {
            const [_first, second, ...rest] = parentSelectors
            parentSelectors = [second, ...rest, second]
          }

          const lastParentSelector = parentSelectors[parentSelectors.length - 1]
          const nextChildSelector =
            childSelector === lastParentSelector ? '' : childSelector

          // for light/dark/light:
          const parentSelectorString = parentSelectors.join(' ')
          const selector = `${parentSelectorString} ${nextChildSelector}`
          selectorsSet.add(selector)
          // remember which scheme's root this selector was built for, so the
          // prefers-color-scheme pass below can route it. a theme carrying
          // aliases from both schemes has to reach both media blocks.
          selectorScheme.set(selector, isDark ? 'dark' : 'light')
        }
      }
    }

    const selectors = [...selectorsSet].sort(sortString)

    // only do our :root attach if it's not light/dark - not support sub themes on root saves a lot of effort/size
    const selectorsString =
      selectors
        .map((x) => {
          const addTo = getSetting('addThemeClassName')
          const isOnRoot = isBaseTheme(x) && (addTo === 'html' || addTo === 'body')
          if (!isOnRoot) return `:root ${x}`
          return `${addTo === 'body' ? 'body' : ':root'}${x}`
        })
        .join(', ') + `, .tm_xxt`

    const css = `${selectorsString} {${vars}}`
    cssRuleSets.push(css)

    if (getSetting('shouldAddPrefersColorThemes')) {
      // inside a media block the root carries no theme class, so the leading
      // `.t_light `/`.t_dark ` is stripped and the block itself stands in for it.
      // a theme reached under BOTH roots therefore has to emit into both blocks:
      // light_inverse dedupes into dark, so the dark values it holds are what an
      // implicitly-light root must serve, while dark's own values serve the dark
      // one. keying the whole set off themeName dropped one of the two.
      const schemeOf = (x: string) => {
        if (x === darkSelector) return 'dark'
        if (x === lightSelector) return 'light'
        if (x.startsWith(`${darkSelector} `)) return 'dark'
        if (x.startsWith(`${lightSelector} `)) return 'light'
        return selectorScheme.get(x)
      }

      for (const baseName of lightDark) {
        const lessSpecificSelectors = selectors
          .map((x) => {
            if (x === darkSelector || x === lightSelector) {
              return schemeOf(x) === baseName ? ':root' : undefined
            }
            // a selector rooted in the other scheme is unreachable here: that
            // root would have to carry an explicit class, which the non-media
            // rules above already cover at higher specificity.
            const scheme = schemeOf(x)
            if (scheme && scheme !== baseName) return
            return x.replace(/^\.t_(dark|light) /, '').trim()
          })
          .filter(Boolean)
          .join(', ')

        if (!lessSpecificSelectors) continue

        // only emit body background/color for base themes, not every sub-theme,
        // and only for the scheme this theme actually grounds
        const isBase = !themeName.includes('_')
        let bodyRulesString = ''
        if (isBase && themeName === baseName) {
          const bgString = theme.background
            ? `background:${variableToString(theme.background)};`
            : ''
          const fgString = theme.color ? `color:${variableToString(theme.color)}` : ''
          bodyRulesString =
            bgString || fgString ? `body{${bgString}${fgString}}\n    ` : ''
        }

        cssRuleSets.push(`@media(prefers-color-scheme:${baseName}){
    ${bodyRulesString}${lessSpecificSelectors} {${vars}}
  }`)
      }
    }

    const selectionStyles = getSetting('selectionStyles')
    if (selectionStyles) {
      const rules = selectionStyles(theme as any)
      if (rules) {
        const selectionSelectors = baseSelectors.map((s) => `${s} ::selection`).join(', ')
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

    return cssRuleSets
  }

  return []
}

const darkSelector = '.t_dark'
const lightSelector = '.t_light'
const isBaseTheme = (x: string) =>
  x === darkSelector ||
  x === lightSelector ||
  x.startsWith('.t_dark ') ||
  x.startsWith('.t_light ')
