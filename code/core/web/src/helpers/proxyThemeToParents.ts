import type { DedupedThemes, ThemeParsed } from '../types'

const themesRaw: Record<string, ThemeParsed> = {}

// this seems expensive but its necessary to do two loops unless we want to refactor a variety of things again
// not *too* much work but not a big cost doing the two loops
export function proxyThemesToParents(
  dedupedThemes: DedupedThemes,
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

  for (const { names, theme } of dedupedThemes) {
    for (const themeName of names) {
      const proxiedTheme = proxyThemeToParents(themeName, theme)
      themes[themeName] = proxiedTheme
    }
  }

  // dedupedThemes is sorted for deterministic CSS cascade, but TamaguiProvider
  // falls back to Object.keys(themes)[0] — reorder to match config (#3764)
  if (declarationOrder) {
    const ordered: Record<string, ThemeParsed> = {}
    for (const k of declarationOrder) if (k in themes) ordered[k] = themes[k]
    for (const k in themes) if (!(k in ordered)) ordered[k] = themes[k]
    return ordered
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
