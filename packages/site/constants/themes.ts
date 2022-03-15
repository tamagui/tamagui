import * as Colors from '@tamagui/colors'

import { tokens } from './tokens'

// helpers

const alternates = [1, 2, 3] as const
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
    const lighterDir = isLight ? -1 : 1
    return {
      background: backgrounds[str],
      backgroundHover: backgrounds[str + lighterDir],
      backgroundPress: backgrounds[2 + str],
      backgroundFocus: backgrounds[3 + str],
      backgroundTransparent: tokens.color.grayA1,
      borderColor: isLight ? colors[8 - str] : backgrounds[2 + str],
      borderColorHover: isLight ? colors[7 - str] : backgrounds[3 + str],
      borderColorPress: isLight ? colors[6 - str] : backgrounds[3 + str],
      borderColorFocus: isLight ? colors[6 - str] : backgrounds[3 + str],
      color: colors[0 + str],
      colorHover: colors[1 + str],
      colorPress: colors[2 + str],
      colorFocus: colors[3 + str],
      shadowColor: darkColors[!isLight ? 0 - str : 7],
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

const baseThemes = {
  ...createThemeWithAlts('light', themeCreator(grays, true, true)),
  ...createThemeWithAlts('dark', themeCreator([...grays].reverse(), false, true)),
}

export type MyTheme = typeof baseThemes['light']

type ColorThemeNames =
  | ColorNames
  | AltName<`light-${ColorNames}`, AltKeys>
  | AltName<`dark-${ColorNames}`, AltKeys>

const colorThemeEntries = colorGradients.flatMap(({ name, gradient }) => {
  const [lightTheme, darkTheme] = ['light', 'dark'].flatMap((scheme) => {
    const isLight = scheme === 'light'
    const getter = themeCreator(isLight ? gradient : [...gradient].reverse(), isLight, false)
    const themeWithAlts = createThemeWithAlts(name, getter)
    return Object.entries(themeWithAlts).map(([k, v]) => [`${scheme}-${k}`, v])
  })
  return [
    lightTheme,
    [`${lightTheme[0]}-button`, darkTheme[1]],
    darkTheme,
    [`${darkTheme[0]}-button`, lightTheme[1]],
  ]
})

const colorThemes: {
  [key in ColorThemeNames]: MyTheme
} = Object.fromEntries(colorThemeEntries) as any

console.log('colorThemes', colorThemeEntries, colorThemes)

export const themes = {
  ...baseThemes,
  ...colorThemes,
} as const

export type MyThemes = typeof themes

// import * as RadixColors from '@tamagui/colors'

// import { colorNames } from './colors'
// import { tokens } from './tokens'

// export type MyTheme = typeof light
// export type MyThemes = typeof themes

// const lightColors = Object.fromEntries(
//   Object.entries(tokens.color).filter(([k]) => !k.endsWith('Dark'))
// )
// const darkColors = Object.fromEntries(
//   Object.entries(tokens.color)
//     .filter(([k]) => k.endsWith('Dark'))
//     .map(([k, v]) => [k.replace('Dark', ''), v])
// )

// const light = {
//   background: '#fff',
//   backgroundHover: tokens.color.gray2,
//   backgroundPress: tokens.color.gray4,
//   backgroundFocus: tokens.color.gray6,
//   backgroundTransparent: tokens.color.grayA1,
//   borderColor: tokens.color.gray4,
//   borderColor2: tokens.color.gray6,
//   colorBright: '#000',
//   color: tokens.color.gray12,
//   colorHover: tokens.color.gray11,
//   colorPress: tokens.color.gray10,
//   colorFocus: tokens.color.gray6,
//   shadowColor: tokens.color.grayA5,
//   shadowColor2: tokens.color.grayA8,
//   ...lightColors,
// }

// const dark = {
//   background: '#171717',
//   backgroundHover: tokens.color.gray4Dark,
//   backgroundPress: tokens.color.gray7Dark,
//   backgroundFocus: tokens.color.gray9Dark,
//   backgroundTransparent: tokens.color.grayA1Dark,
//   borderColor: tokens.color.gray3Dark,
//   borderColor2: tokens.color.gray4Dark,
//   color: '#fff',
//   colorBright: '#fff',
//   colorHover: '#f2f2f2',
//   colorPress: tokens.color.gray10Dark,
//   colorFocus: tokens.color.gray6Dark,
//   shadowColor: tokens.color.grayA7,
//   shadowColor2: tokens.color.grayA9,
//   ...darkColors,
// }

// const colorThemes: Record<typeof colorNames[number], typeof light> = {} as any
// for (const key of colorNames) {
//   for (const scheme of ['light', 'dark']) {
//     const isDark = scheme === 'dark'
//     const colorKey = isDark ? `${key}Dark` : key
//     const colorValues = RadixColors[colorKey]
//     // console.log(key, scheme, colorValues)
//     const offset = isDark ? -1 : 0
//     colorThemes[`${scheme}-${key}`] = {
//       color: colorValues[`${key}12`],
//       colorHover: isDark ? dark.colorHover : light.colorHover,
//       colorPress: colorValues[`${key}11`],
//       colorFocus: colorValues[`${key}10`],
//       background: colorValues[`${key}${2 + offset}`],
//       backgroundHover: colorValues[`${key}${3 + offset}`],
//       backgroundPress: colorValues[`${key}${4 + offset}`],
//       backgroundFocus: colorValues[`${key}${5 + offset}`],
//       backgroundTransparent: colorValues[`${key}${1 + offset}`],
//       borderColor: colorValues[`${key}${4 + offset}`],
//       borderColor2: colorValues[`${key}${5 + offset}`],
//       shadowColor: isDark ? dark.shadowColor : light.shadowColor,
//     }
//   }
// }

// export const themes = {
//   dark,
//   light,
//   ...colorThemes,
//   'active-light': {
//     ...colorThemes['dark-blue'],
//     background: tokens.color.blue1,
//     backgroundHover: tokens.color.blue3,
//     backgroundPress: tokens.color.blue3,
//     backgroundFocus: tokens.color.blue5,
//     color: tokens.color.blue10,
//     colorHover: tokens.color.blue11,
//   },
//   'active-dark': {
//     ...colorThemes['light-blue'],
//     background: tokens.color.blue12,
//     backgroundHover: tokens.color.blue12,
//     backgroundPress: tokens.color.blue12,
//     backgroundFocus: tokens.color.blue10,
//     color: tokens.color.blue1,
//     colorHover: tokens.color.blue2,
//   },
// } as const
