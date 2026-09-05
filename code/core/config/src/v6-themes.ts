import {
  v6RemovedThemeNames,
  v6ThemeNameReplacements,
} from '@tamagui/style-grammar/v6-themes'

export type V6Theme<Theme> = {
  [Name in keyof Theme as Name extends (typeof v6RemovedThemeNames)[number]
    ? never
    : Name extends keyof typeof v6ThemeNameReplacements
      ? (typeof v6ThemeNameReplacements)[Name]
      : Name]: Theme[Name]
}

export type V6Themes<Themes extends Record<string, object>> = {
  [Name in keyof Themes]: V6Theme<Themes[Name]>
}

/** Apply the v6 theme-key grammar to any generated theme pack. */
export function toV6Themes<Themes extends Record<string, object>>(
  themes: Themes
): V6Themes<Themes> {
  const convertedThemes = new WeakMap<object, object>()

  return Object.fromEntries(
    Object.entries(themes).map(([themeName, theme]) => {
      let convertedTheme = convertedThemes.get(theme)

      if (!convertedTheme) {
        convertedTheme = Object.fromEntries(
          Object.entries(theme)
            .filter(
              ([name]) => !(v6RemovedThemeNames as readonly string[]).includes(name)
            )
            .map(([name, value]) => [
              v6ThemeNameReplacements[name as keyof typeof v6ThemeNameReplacements] ??
                name,
              value,
            ])
        )
        convertedThemes.set(theme, convertedTheme)
      }

      return [themeName, convertedTheme]
    })
  ) as V6Themes<Themes>
}
