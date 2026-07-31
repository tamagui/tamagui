type KebabCase<Name extends string> = Name extends `${infer First}${infer Rest}`
  ? First extends Lowercase<First>
    ? `${First}${KebabCase<Rest>}`
    : `-${Lowercase<First>}${KebabCase<Rest>}`
  : Name

// style-grammar cannot import the theme package without reversing the dependency
// graph. This tuple is the zero-dependency vocabulary; the config test compares it
// exhaustively with every actual v5 theme key so a new camel-case built-in fails.
const v6RenamedThemeNames = [
  'accentBackground',
  'accentColor',
  'colorHover',
  'colorPress',
  'colorFocus',
  'backgroundHover',
  'backgroundPress',
  'backgroundFocus',
  'borderColor',
  'borderColorHover',
  'borderColorFocus',
  'borderColorPress',
  'outlineColor',
  'placeholderColor',
  'colorTransparent',
  'shadowColor',
] as const

export const v6ThemeNameReplacements = Object.freeze(
  Object.fromEntries(
    v6RenamedThemeNames.map((name) => [
      name,
      name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`),
    ])
  )
) as {
  readonly [Name in (typeof v6RenamedThemeNames)[number]]: KebabCase<Name>
}

export const v6RemovedThemeNames = ['backgroundActive'] as const
