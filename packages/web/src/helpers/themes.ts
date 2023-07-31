import { getConfig } from '../config'
import { createVariable, isVariable } from '../createVariable'
import { GetThemeUnwrapped } from '../hooks/getThemeUnwrapped'
import {
  CreateTamaguiProps,
  DedupedThemes,
  ThemeParsed,
  Tokens,
  TokensParsed,
} from '../types'

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

const themesRaw: Record<string, ThemeParsed> = {}

// this seems expensive but its necessary to do two loops unless we want to refactor a variety of things again
// not *too* much work but not a big cost doing the two loops
export function proxyThemesToParents(
  dedupedThemes: DedupedThemes,
  tokens: Tokens
): Record<string, ThemeParsed> {
  // fill it in so we can look it up next
  for (const { names, theme } of dedupedThemes) {
    for (const name of names) {
      themesRaw[name] = theme
    }
  }

  const themes: Record<string, ThemeParsed> = {}
  // now go back and re-fill it in
  // we do have to call this once per non-duplicated theme!
  // because they could have different parent chains
  // despite being the same theme

  for (const { names, theme } of dedupedThemes) {
    for (const themeName of names) {
      const proxiedTheme = proxyThemeToParents(themeName, theme, tokens)
      themes[themeName] = proxiedTheme
    }
  }

  return themes
}

export function proxyThemeToParents(
  themeName: string,
  theme: ThemeParsed,
  tokens: TokensParsed = getConfig().tokensParsed
) {
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

  const numParents = parents.length

  // TODO maybe faster to just object spread? needs profiling on native + web
  // proxy fallback values to parent theme values
  return new Proxy(theme, {
    get(target, key) {
      if (key === GetThemeUnwrapped) return theme
      if (Reflect.has(target, key)) return Reflect.get(target, key)
      // check parents
      for (let i = numParents - 1; i >= 0; i--) {
        const parent = themesRaw[parents[i]]
        if (!parent) continue
        if (Reflect.has(parent, key)) {
          return Reflect.get(parent, key)
        }
      }
      return Reflect.get(tokens, key)
    },
  })
}
