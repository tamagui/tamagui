import * as Colors from '@tamagui/colors'
import { Variable } from 'tamagui'

import { allDarkColors, allLightColors } from './colors'
import { tokens } from './tokens'

// helpers

const alternates = [1, 2, 3] as const
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

// isLight could be auto-calculated with a library
const themeCreator =
  ({
    backgrounds,
    isLight = true,
    isBase = false,
    colors = [...backgrounds].reverse(),
    offsets: offsetsProp,
  }: {
    backgrounds: (string | Variable)[]
    colors?: (string | Variable)[]
    offsets?: {
      color?: number[] | null
      background?: number[] | null
      borderColor?: number[] | null
    }
    isLight?: boolean
    isBase?: boolean
  }) =>
  (str = 1) => {
    const offsets = {
      borderColor: offsetsProp?.borderColor ?? offsetsProp?.background ?? [0, 0, 0, 0],
      background: offsetsProp?.background ?? [0, 0, 0, 0],
      color: offsetsProp?.color ?? [0, 0, 0, 0],
    }
    const darkColors = isLight ? colors : backgrounds
    const lighterDir = isLight ? -1 : 1
    const darkerDir = -lighterDir
    const get = (arr: any[], index: number, name = 'background') => {
      return arr[Math.max(0, Math.min(index + (offsets[name][str] || 0), arr.length - 1))]
    }
    return {
      background: get(backgrounds, str),
      backgroundHover: backgrounds[str + lighterDir * 1] ?? get(backgrounds, str + darkerDir * 1),
      backgroundPress: get(backgrounds, str + darkerDir * 1),
      backgroundFocus: get(backgrounds, str + darkerDir * 2),
      backgroundTransparent: tokens.color.grayA1,
      borderColor: isLight ? colors[8 - str] : backgrounds[2 + str],
      borderColorHover: isLight ? colors[7 - str] : backgrounds[1 + str],
      borderColorPress: isLight ? colors[6 - str] : backgrounds[3 + str],
      borderColorFocus: isLight ? colors[6 - str] : backgrounds[4 + str],
      color: get(colors, 0 + str, 'color'),
      colorHover: get(colors, 1 + str, 'color'),
      colorPress: get(colors, 2 + str, 'color'),
      colorFocus: get(colors, 3 + str, 'color'),
      shadowColor: isLight ? tokens.color.grayA4 : tokens.color.grayA8,
      shadowColorHover: darkColors[!isLight ? 1 : 8],
      shadowColorPress: darkColors[!isLight ? 1 : 8],
      shadowColorFocus: darkColors[!isLight ? 1 : 8],
      ...(isBase && (isLight ? allLightColors : allDarkColors)),
    }
  }

export const colorSchemes = [
  { name: 'blue', colors: Colors.blue, darkColors: Colors.blueDark },
  { name: 'gray', colors: Colors.gray, darkColors: Colors.grayDark },
  { name: 'green', colors: Colors.green, darkColors: Colors.greenDark },
  { name: 'indigo', colors: Colors.indigo, darkColors: Colors.indigoDark },
  { name: 'orange', colors: Colors.orange, darkColors: Colors.orangeDark },
  { name: 'pink', colors: Colors.pink, darkColors: Colors.pinkDark },
  { name: 'purple', colors: Colors.purple, darkColors: Colors.purpleDark },
  { name: 'red', colors: Colors.red, darkColors: Colors.redDark },
  { name: 'violet', colors: Colors.violet, darkColors: Colors.violetDark },
  { name: 'yellow', colors: Colors.yellow, darkColors: Colors.yellowDark },
] as const

type ColorNames = typeof colorSchemes[number]['name']

const lightGradient = [
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
]

const darkGradient = [
  '#151515',
  '#222',
  '#272727',
  tokens.color.gray11,
  tokens.color.gray10,
  tokens.color.gray9,
  tokens.color.gray8,
  tokens.color.gray7,
  tokens.color.gray6,
  tokens.color.gray5,
  tokens.color.gray4,
  tokens.color.gray3,
  tokens.color.gray2,
  tokens.color.gray1,
]

const makeLightTheme = themeCreator({
  backgrounds: lightGradient,
  isLight: true,
  isBase: true,
})

const makeDarkTheme = themeCreator({
  backgrounds: darkGradient,
  colors: lightGradient,
  isLight: false,
  isBase: true,
  offsets: {
    color: [0, 7, 8, 9],
  },
})

const lightThemes = createThemeWithAlts('light', makeLightTheme)
const darkThemes = createThemeWithAlts('dark', makeDarkTheme)

const baseThemes = {
  ...lightThemes,
  light_active: makeActiveTheme(darkThemes.dark),
  ...darkThemes,
  dark_active: makeActiveTheme(lightThemes.light),
}

function makeActiveTheme(theme: any) {
  const res = { ...theme }
  res.backgroundHover = res.background
  res.colorHover = res.color
  res.backgroundPress = res.background
  res.colorPress = res.color
  return res
}

export type MyTheme = typeof baseThemes['light']

type ColorThemeNames =
  | ColorNames
  | AltName<`light_${ColorNames}`, AltKeys>
  | AltName<`dark_${ColorNames}`, AltKeys>

const colorThemeEntries = colorSchemes.flatMap(({ name, colors, darkColors }) => {
  const [altLightThemes, altDarkThemes] = [colors, darkColors].map((colors, i) => {
    const isLight = i === 0
    const scheme = isLight ? 'light' : 'dark'
    const getter = themeCreator({
      backgrounds: Object.values(colors),
      isLight,
      isBase: false,
      offsets: {
        background: isLight ? [1, 1, 1, 1] : null,
        color: isLight ? [0, -1, -1, -1] : null,
      },
    })
    const themeWithAlts = createThemeWithAlts(name, getter)
    return Object.entries(themeWithAlts).map(([k, v]) => [`${scheme}_${k}`, v])
  })
  const lightButtonTheme = altLightThemes[0]
  const darkButtonTheme = altDarkThemes[0]
  return [
    ...altLightThemes,
    [`${lightButtonTheme[0]}_button`, altLightThemes[2][1]],
    ...altDarkThemes,
    [`${darkButtonTheme[0]}_button`, altDarkThemes[2][1]],
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
