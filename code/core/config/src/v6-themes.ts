import {
  v6RemovedThemeNames,
  v6ThemeNameReplacements,
} from '@tamagui/style-grammar/v6-themes'

type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'

type AllDigits<Name extends string> = Name extends ''
  ? true
  : Name extends `${infer Head}${infer Rest}`
    ? Head extends Digit
      ? AllDigits<Rest>
      : false
    : false

/** `color5` -> `color-5`, `black04` -> `black-04`, leaving hyphenated and digitless keys alone */
type HyphenateRamp<Name extends string, Prefix extends string = ''> = string extends Name
  ? Name
  : Name extends `${infer Head}${infer Rest}`
    ? Head extends Digit
      ? AllDigits<Rest> extends true
        ? Prefix extends '' | `${string}-`
          ? `${Prefix}${Name}`
          : `${Prefix}-${Name}`
        : HyphenateRamp<Rest, `${Prefix}${Head}`>
      : HyphenateRamp<Rest, `${Prefix}${Head}`>
    : Prefix

export type V6ThemeKey<Name> = Name extends keyof typeof v6ThemeNameReplacements
  ? (typeof v6ThemeNameReplacements)[Name]
  : Name extends string
    ? HyphenateRamp<Name>
    : Name

export type V6Theme<Theme> = {
  [Name in keyof Theme as Name extends (typeof v6RemovedThemeNames)[number]
    ? never
    : V6ThemeKey<Name>]: Theme[Name]
}

export type V6Themes<Themes extends Record<string, object>> = {
  [Name in keyof Themes]: V6Theme<Themes[Name]>
}

// the digit run only splits off when a non-hyphen, non-digit character precedes
// it, so `shadow-1` and `2xl` are already in the v6 grammar and pass through
const trailingRamp = /^(.*[^-\d])(\d+)$/

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
                name.replace(trailingRamp, '$1-$2'),
              value,
            ])
        )
        convertedThemes.set(theme, convertedTheme)
      }

      return [themeName, convertedTheme]
    })
  ) as V6Themes<Themes>
}
