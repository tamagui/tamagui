import type { DedupedThemes, ThemeParsed } from '../types'

const themesRaw: Record<string, ThemeParsed> = {}

// this seems expensive but its necessary to do two loops unless we want to refactor a variety of things again
// not *too* much work but not a big cost doing the two loops
export function proxyThemesToParents(
  dedupedThemes: DedupedThemes,
  // the order the config declared its themes in. dedupedThemes is sorted, because the
  // CSS built from it has a load-bearing cascade, but TamaguiProvider falls back to
  // Object.keys(config.themes)[0] when given no defaultTheme — so the object returned
  // here has to keep declaration order or `dark` becomes everyone's default (#3764)
  declarationOrder?: string[]
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

  const add = (themeName: string, theme: ThemeParsed) => {
    if (themeName in themes) return
    themes[themeName] = proxyThemeToParents(themeName, theme)
  }

  if (declarationOrder) {
    const themeByName = new Map<string, ThemeParsed>()
    for (const { names, theme } of dedupedThemes) {
      for (const name of names) {
        themeByName.set(name, theme)
      }
    }
    for (const themeName of declarationOrder) {
      const theme = themeByName.get(themeName)
      if (theme) {
        add(themeName, theme)
      }
    }
  }

  // anything the declaration order didn't cover (or every theme, when not given)
  for (const { names, theme } of dedupedThemes) {
    for (const themeName of names) {
      add(themeName, theme)
    }
  }

  return themes
}

export function proxyThemeToParents(themeName: string, theme: ThemeParsed) {
  const out = {}
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

  for (const parent of parents) {
    Object.assign(out, themesRaw[parent])
  }
  Object.assign(out, theme)
  return out
}
