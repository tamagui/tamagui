import * as Colors from '@tamagui/colors'
import { Variable, getVariableValue } from '@tamagui/core'

import { allDarkColors, allLightColors } from './colors'
import { setColorAlpha } from './colorUtils'
import { tokens } from './tokens'

// helpers

const alternates = [1, 2, 3, 4] as const
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
    // isBase = false,
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

    const colorTranslucent = setColorAlpha(getVariableValue(get(colors, 0 + str, 'color')), 0.5)

    return {
      background: get(backgrounds, str),
      backgroundSoft: get(backgrounds, str + 3),
      backgroundHover: backgrounds[str + lighterDir * 1] ?? get(backgrounds, str + darkerDir * 1),
      backgroundPress: get(backgrounds, str + darkerDir * 1),
      backgroundFocus: get(backgrounds, str + darkerDir * 2),
      backgroundTransparent: tokens.color.grayA1,
      borderColor: isLight ? colors[8 - str] : backgrounds[2 + str],
      borderColorHover: isLight ? colors[7 - str] : backgrounds[3 + str],
      borderColorPress: isLight ? colors[6 - str] : backgrounds[1 + str],
      borderColorFocus: isLight ? colors[6 - str] : backgrounds[3 + str],
      color: get(colors, 0 + str, 'color'),
      colorHover: get(colors, 1 + str, 'color'),
      colorPress: get(colors, 2 + str, 'color'),
      colorFocus: get(colors, 3 + str, 'color'),
      colorTranslucent,
      colorMid: colors[Math.floor(colors.length / 2)],
      shadowColor: isLight ? tokens.color.grayA4 : tokens.color.grayA8,
      shadowColorHover: darkColors[!isLight ? 1 : 8],
      shadowColorPress: darkColors[!isLight ? 1 : 8],
      shadowColorFocus: darkColors[!isLight ? 1 : 8],
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

export type ColorNames = typeof colorSchemes[number]['name']

export const lightGradient = [
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

export const darkGradient = [
  '#0f0f0f',
  '#141414',
  '#191919',
  '#242424',
  '#292929',
  '#323232',
  '#383838',
  '#424242',
  '#494949',
  // tokens.color.gray12,
  // tokens.color.gray11,
  // tokens.color.gray10,
  // tokens.color.gray9,
  // tokens.color.gray8,
  // tokens.color.gray7,
  // tokens.color.gray6,
  // tokens.color.gray5,
  // tokens.color.gray4,
  // tokens.color.gray3,
  // tokens.color.gray2,
  // tokens.color.gray1,
]

const makeLightTheme = themeCreator({
  backgrounds: lightGradient,
  isLight: true,
})

const makeDarkTheme = themeCreator({
  backgrounds: darkGradient,
  colors: lightGradient,
  isLight: false,
  offsets: {
    color: [0, 7, 8, 9, 10],
  },
})

const lightThemes = createThemeWithAlts('light', makeLightTheme)
const darkThemes = createThemeWithAlts('dark', makeDarkTheme)

const baseThemes = {
  ...lightThemes,
  light_active: makeActiveTheme(darkThemes.dark),
  light_card: lightThemes.light_alt1,
  ...darkThemes,
  dark_active: makeActiveTheme(lightThemes.light),
  dark_card: darkThemes.dark_alt1,

  light: {
    ...lightThemes.light,
    ...allLightColors,
  },

  dark: {
    ...darkThemes.dark,
    ...allDarkColors,
  },
}

function makeActiveTheme(theme: any) {
  const res = { ...theme }
  res.backgroundHover = res.background
  res.colorHover = res.color
  res.backgroundPress = res.background
  res.colorPress = res.color
  return res
}

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

const transparent = {
  background: 'transparent',
  backgroundSoft: 'transparent',
  backgroundHover: 'transparent',
  backgroundPress: 'transparent',
  backgroundFocus: 'transparent',
  backgroundTransparent: 'transparent',
  shadowColor: 'transparent',
  shadowColorHover: 'transparent',
  shadowColorPress: 'transparent',
  shadowColorFocus: 'transparent',
}

type MyThemeBase = typeof baseThemes['light_alt1']

// @ts-ignore
const dark_outline: MyThemeBase = {
  ...baseThemes.dark,
  borderColor: '#fff',
  ...transparent,
}

// @ts-ignore
const light_outline: MyThemeBase = {
  ...baseThemes.light,
  borderColor: '#000',
  ...transparent,
}

const colorThemes: {
  [key in ColorThemeNames]: MyThemeBase
} = Object.fromEntries(colorThemeEntries) as any

export const themes = {
  ...baseThemes,
  ...colorThemes,
  dark_outline,
  light_outline,
} as const

export type MyThemes = typeof themes
