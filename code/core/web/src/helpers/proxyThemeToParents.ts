import type { DedupedThemes, ThemeParsed } from '../types'
import { copyAuthoredThemeScheme } from './themes'

let themesRaw: Record<string, ThemeParsed> = {}

// this seems expensive but its necessary to do two loops unless we want to refactor a variety of things again
// not *too* much work but not a big cost doing the two loops
export function proxyThemesToParents(
  dedupedThemes: DedupedThemes,
  declarationOrder?: string[],
  lazy = false
): Record<string, ThemeParsed> {
  // each config keeps its own parent values even if another config is created
  // before one of its lazy themes is read.
  const raw: Record<string, ThemeParsed> = Object.defineProperties(
    {},
    Object.getOwnPropertyDescriptors(themesRaw)
  )
  themesRaw = raw
  // fill it in so we can look it up next
  for (const deduped of dedupedThemes) {
    for (const name of deduped.names) {
      Object.defineProperty(raw, name, {
        configurable: true,
        enumerable: true,
        get: () => deduped.theme,
      })
    }
  }

  const themes: Record<string, ThemeParsed> = {}
  // now go back and re-fill it in
  // we do have to call this once per non-duplicated theme!
  // because they could have different parent chains
  // despite being the same theme

  for (const deduped of dedupedThemes) {
    for (const themeName of deduped.names) {
      if (lazy) {
        Object.defineProperty(themes, themeName, {
          configurable: true,
          enumerable: true,
          get() {
            const value = proxyThemeToParents(themeName, deduped.theme, raw)
            Object.defineProperty(this, themeName, {
              configurable: true,
              enumerable: true,
              writable: true,
              value,
            })
            return value
          },
          set(value: ThemeParsed) {
            Object.defineProperty(this, themeName, {
              configurable: true,
              enumerable: true,
              writable: true,
              value,
            })
          },
        })
      } else {
        themes[themeName] = proxyThemeToParents(themeName, deduped.theme, raw)
      }
    }
  }

  // dedupedThemes is sorted for deterministic CSS cascade, but TamaguiProvider
  // falls back to Object.keys(themes)[0] — reorder to match config (#3764)
  if (declarationOrder) {
    const ordered: Record<string, ThemeParsed> = {}
    for (const k of declarationOrder) {
      if (k in themes)
        Object.defineProperty(ordered, k, Object.getOwnPropertyDescriptor(themes, k)!)
    }
    for (const k in themes) {
      if (!(k in ordered))
        Object.defineProperty(ordered, k, Object.getOwnPropertyDescriptor(themes, k)!)
    }
    return ordered
  }

  return themes
}

export function proxyThemeToParents(
  themeName: string,
  theme: ThemeParsed,
  raw = themesRaw
) {
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
    Object.assign(out, raw[parent])
  }
  Object.assign(out, theme)
  return copyAuthoredThemeScheme(out, theme)
}
