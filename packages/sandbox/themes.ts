import * as Colors from '@tamagui/colors'

import { tokens } from './tokens'

// helpers

const alternates = [1, 2, 3, 4, 5] as const
type AltKeys = typeof alternates[number]
type AltThemeGetter<A = any> = (str: number) => A
type AltName<Name extends string, Keys extends string | number> = `${Name}_alt${Keys}`

function createThemeWithAlts<Name extends string, GetTheme extends AltThemeGetter>(
  name: Name,
  getTheme: GetTheme
): {
  [key in `${Name}_alt${AltKeys}` | `${Name}`]: GetTheme extends AltThemeGetter<infer Theme>
    ? Theme
    : never
} {
  const altNames = alternates.map((str) => `${name}_alt${str}`) as AltName<Name, AltKeys>[]
  const names = [name, ...altNames] as const
  const themeEntries = names.map((name, str) => {
    return [name, getTheme(str)] as const
  })
  // add button theme
  const [btnThemeName, btnTheme] = themeEntries[themeEntries.length - alternates.length + 1]
  themeEntries.push([`${btnThemeName}_button` as any, btnTheme])
  const themes = Object.fromEntries(themeEntries)
  return themes as any
}

const LIGHT_COLORS = Object.fromEntries(
  Object.entries(tokens.color).filter(([k]) => !k.endsWith('Dark'))
)
const DARK_COLORS = Object.fromEntries(
  Object.entries(tokens.color)
    .filter(([k]) => k.endsWith('Dark'))
    .map(([k, v]) => [k.replace('Dark', ''), v])
)

const grays = [
  '#fff',
  '#f2f2f2',
  tokens.color.gray1,
  tokens.color.gray2,
  tokens.color.gray3,
  tokens.color.gray4,
  tokens.color.gray5,
  tokens.color.gray6,
  tokens.color.gray7,
  tokens.color.gray8,
  tokens.color.gray9,
  tokens.color.gray10,
  tokens.color.gray11,
  tokens.color.gray12,
  '#222',
  '#010101',
  '#000',
]

// isLight could be auto-calculated with a library
const themeCreator =
  (backgrounds: any[], isLight = true, isBase = false) =>
  (str = 1) => {
    const colors = [...backgrounds].reverse()
    const darkColors = isLight ? colors : backgrounds
    const lighterDir = isLight ? -1 : 1
    const darkerDir = -lighterDir
    return {
      background: backgrounds[str],
      backgroundHover: backgrounds[str + lighterDir * 1],
      backgroundPress: backgrounds[2 + darkerDir * 2],
      backgroundFocus: backgrounds[3 + darkerDir * 1],
      backgroundTransparent: tokens.color.grayA1,
      borderColor: isLight ? colors[10 - str] : backgrounds[2 + str],
      borderColorHover: isLight ? colors[7 - str] : backgrounds[3 + str],
      borderColorPress: isLight ? colors[6 - str] : backgrounds[3 + str],
      borderColorFocus: isLight ? colors[6 - str] : backgrounds[3 + str],
      color: colors[0 + str],
      colorHover: colors[1 + str],
      colorPress: colors[2 + str],
      colorFocus: colors[3 + str],
      shadowColor: isLight ? tokens.color.grayA6 : tokens.color.grayA9,
      shadowColorHover: darkColors[!isLight ? 1 : 8],
      shadowColorPress: darkColors[!isLight ? 1 : 8],
      shadowColorFocus: darkColors[!isLight ? 1 : 8],
      ...(isBase && (isLight ? LIGHT_COLORS : DARK_COLORS)),
    }
  }

export const colorNames = [
  'blue',
  'gray',
  'green',
  'indigo',
  'orange',
  'pink',
  'purple',
  'red',
  'violet',
  'yellow',
] as const

const colorGradients = colorNames.map((name) => {
  return { name, gradient: Object.values(Colors[name]) }
})

type ColorNames = typeof colorNames[number]

const makeLightTheme = themeCreator(grays, true, true)
const makeDarkTheme = themeCreator([...grays].reverse(), false, true)
const baseThemes = {
  ...createThemeWithAlts('light', makeLightTheme),
  ...createThemeWithAlts('dark', makeDarkTheme),
}

export type MyTheme = typeof baseThemes['light']

type ColorThemeNames =
  | ColorNames
  | AltName<`light_${ColorNames}`, AltKeys>
  | AltName<`dark_${ColorNames}`, AltKeys>

const colorThemeEntries = colorGradients.flatMap(({ name, gradient }) => {
  const [altLightThemes, altDarkThemes] = ['light', 'dark'].map((scheme) => {
    const isLight = scheme === 'light'
    const getter = themeCreator(isLight ? gradient : [...gradient].reverse(), isLight, false)
    const themeWithAlts = createThemeWithAlts(name, getter)
    return Object.entries(themeWithAlts).map(([k, v]) => [`${scheme}_${k}`, v])
  })
  const lightButtonTheme = altLightThemes[2]
  const darkButtonTheme = altDarkThemes[2]
  return [
    ...altLightThemes,
    [`${lightButtonTheme[0]}_button`, darkButtonTheme[1]],
    ...altDarkThemes,
    [`${darkButtonTheme[0]}_button`, lightButtonTheme[1]],
  ]
})

const colorThemes: {
  [key in ColorThemeNames]: MyTheme
} = Object.fromEntries(colorThemeEntries) as any

export const themes = {
  ...baseThemes,
  ...colorThemes,
} as const

export type MyThemes = typeof themes
