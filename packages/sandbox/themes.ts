import * as Colors from '@tamagui/colors'
import { getVariableValue } from '@tamagui/core'

import { tokens } from './tokens'

// helpers

const alternates = [1, 2, 3, 4, 5, 6] as const
type AltKeys = typeof alternates[number]
type AltThemeGetter<A = any> = (str: number) => A
type AltName<Name extends string, Keys extends string | number> = `${Name}-alt${Keys}`

function createThemeWithAlts<Name extends string, GetTheme extends AltThemeGetter>(
  name: Name,
  getTheme: GetTheme
): {
  [key in `${Name}-alt${AltKeys}` | `${Name}`]: GetTheme extends AltThemeGetter<infer Theme>
    ? Theme
    : never
} {
  const altNames = alternates.map((str) => `${name}-alt${str}`) as AltName<Name, AltKeys>[]
  const names = [name, ...altNames] as const
  const themes = Object.fromEntries(
    names.map((name, str) => {
      return [name, getTheme(str)] as const
    })
  )
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
    return {
      background: backgrounds[str],
      backgroundHover: backgrounds[str - 1],
      backgroundPress: backgrounds[2 + str],
      backgroundFocus: backgrounds[3 + str],
      backgroundTransparent: tokens.color.grayA1,
      borderColor: isLight ? colors[7] : backgrounds[2],
      borderColorHover: isLight ? colors[8] : backgrounds[3],
      borderColorPress: isLight ? colors[8] : backgrounds[3],
      borderColorFocus: isLight ? colors[8] : backgrounds[3],
      color: colors[0 + str],
      colorHover: colors[1 + str],
      colorPress: colors[2 + str],
      colorFocus: colors[3 + str],
      shadowColor: darkColors[!isLight ? 0 : 7],
      shadowColorHover: darkColors[!isLight ? 1 : 8],
      shadowColorPress: darkColors[!isLight ? 1 : 8],
      shadowColorFocus: darkColors[!isLight ? 1 : 8],
      ...(isBase && (isLight ? LIGHT_COLORS : DARK_COLORS)),
    }
  }

const colorNames = [
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

const baseThemes = {
  ...createThemeWithAlts('light', themeCreator(grays, true, true)),
  ...createThemeWithAlts('dark', themeCreator([...grays].reverse(), false, true)),
}

export type MyTheme = typeof baseThemes['light']

const colorThemes: {
  [key in
    | ColorNames
    | AltName<`light-${ColorNames}`, AltKeys>
    | AltName<`dark-${ColorNames}`, AltKeys>]: MyTheme
} = Object.fromEntries(
  colorGradients.flatMap(({ name, gradient }) => {
    return ['light', 'dark'].flatMap((scheme) => {
      const isLight = scheme === 'light'
      const getter = themeCreator(isLight ? gradient : [...gradient].reverse(), isLight, false)
      const themeWithAlts = createThemeWithAlts(name, getter)
      return Object.entries(themeWithAlts).map(([k, v]) => [`${scheme}-${k}`, v])
    })
  })
) as any

export const themes = {
  ...baseThemes,
  ...colorThemes,
} as const

console.log('themes', themes)

export type MyThemes = typeof themes
