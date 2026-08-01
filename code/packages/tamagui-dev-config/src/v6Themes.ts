import { v6RemovedThemeNames, v6ThemeNameReplacements } from '@tamagui/config/v6'

type V6Theme<Theme> = {
  [Name in keyof Theme as Name extends (typeof v6RemovedThemeNames)[number]
    ? never
    : Name extends keyof typeof v6ThemeNameReplacements
      ? (typeof v6ThemeNameReplacements)[Name]
      : Name]: Theme[Name]
}

export type V6Themes<Themes> = {
  [ThemeName in keyof Themes]: V6Theme<Themes[ThemeName]>
}

/** Emit the custom dev theme corpus in the sole V6 built-in namespace. */
export function toV6Themes<Themes extends Record<string, Record<string, unknown>>>(
  themes: Themes
): V6Themes<Themes> {
  return Object.fromEntries(
    Object.entries(themes).map(([themeName, theme]) => [
      themeName,
      Object.fromEntries(
        Object.entries(theme)
          .filter(([name]) => !(v6RemovedThemeNames as readonly string[]).includes(name))
          .map(([name, value]) => [
            v6ThemeNameReplacements[name as keyof typeof v6ThemeNameReplacements] ?? name,
            value,
          ])
      ),
    ])
  ) as V6Themes<Themes>
}
