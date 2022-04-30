import * as Colors from '@tamagui/colors'
import { allDarkColors, allLightColors } from '@tamagui/colors'
import { Variable, getVariableValue } from '@tamagui/core'

import { setColorAlpha } from './colorUtils'
import { color } from './tokens'

type ThemeCreatorProps = {
  shift?: number
  backgrounds: (string | Variable)[]
  colors?: (string | Variable)[]
  offsets?: {
    color?: number[] | null
    background?: number[] | null
    borderColor?: number[] | null
  }
  isLight?: boolean
  isBase?: boolean
}

// helpers

const alternates = [1, 2, 3, 4] as const
type AltKeys = 1 | 2 | 3 | 4 // one less for dark_darker
type AltName<Name extends string, Keys extends string | number> = `${Name}_alt${Keys}`
type ThemeCreator<A = any> = (str: number, props: ThemeCreatorProps) => A

function createThemesFrom<Name extends string, GetTheme extends ThemeCreator = ThemeCreator>(
  name: Name,
  getTheme: GetTheme,
  props: ThemeCreatorProps
): {
  [key in `${Name}_alt${AltKeys}` | `${Name}` | `${Name}_darker`]: GetTheme extends ThemeCreator<
    infer Theme
  >
    ? Theme
    : never
} {
  const { shift = 0 } = props
  const theme = getTheme(0 + shift, props)
  let themeEntries: any[] = [[name, theme]]
  const altThemes: any[] = alternates.map((alt) => [
    `${name}_alt${alt}`,
    getTheme(alt + shift, props),
  ])
  const altButtonThemes: any[] = alternates.map((_, i) => {
    const [bName, bTheme] = [altThemes[i][0], (altThemes[i + 1] || altThemes[i])[1]]
    return [`${bName}_Button` as any, bTheme]
  })
  // add these after alts since we rely on positioning
  const darkerTheme = getTheme(Math.max(0, shift + (props.isLight ? 1 : -1)), props)
  const activeTheme = makeActiveTheme(theme)
  themeEntries = [
    ...themeEntries,
    ...altThemes,
    ...altButtonThemes,
    [`${name}_Button`, altThemes[0][1]],
    [`${name}_darker`, darkerTheme],
    [`${name}_active`, activeTheme],
  ]
  const themes = Object.fromEntries(themeEntries)
  // if (props.isLight) {
  //   console.log('themes', themes)
  // }
  return themes as any
}

const createTheme = (
  str = 1,
  {
    backgrounds,
    isLight = true,
    // isBase = false,
    colors = [...backgrounds].reverse(),
    offsets: offsetsProp,
  }: ThemeCreatorProps
) => {
  const offsets = {
    borderColor: offsetsProp?.borderColor ?? offsetsProp?.background ?? [0, 0, 0, 0],
    background: offsetsProp?.background ?? [0, 0, 0, 0],
    color: offsetsProp?.color ?? [0, 0, 0, 0],
  }
  const darkColors = isLight ? colors : backgrounds
  const lighterDir = isLight ? -1 : 1
  const darkerDir = -lighterDir
  const strongerDir = isLight ? darkerDir : lighterDir
  const get = (arr: any[], index: number, name = 'background') => {
    return arr[Math.max(0, Math.min(index + (offsets[name][str] || 0), arr.length - 1))]
  }

  const colorTranslucent = setColorAlpha(getVariableValue(get(colors, 0 + str, 'color')), 0.5)

  return {
    background: get(backgrounds, str),
    backgroundStronger: get(backgrounds, str + strongerDir),
    backgroundSoft: get(backgrounds, str + 3),
    backgroundHover: get(backgrounds, str + lighterDir),
    backgroundPress: get(backgrounds, str + darkerDir * 1),
    backgroundFocus: get(backgrounds, str + darkerDir * 2),
    backgroundTransparent: color.grayA1,
    borderColor: isLight
      ? get(colors, 8 - str, 'borderColor')
      : get(backgrounds, 2 + str, 'borderColor'),
    borderColorHover: isLight
      ? get(colors, 6 - str, 'borderColor')
      : get(backgrounds, 3 + str, 'borderColor'),
    borderColorPress: isLight
      ? get(colors, 5 - str, 'borderColor')
      : get(backgrounds, 1 + str, 'borderColor'),
    borderColorFocus: isLight
      ? get(colors, 4 - str, 'borderColor')
      : get(backgrounds, 3 + str, 'borderColor'),
    // colorStronger: get(colors, str + strongerDir),
    color: get(colors, 0 + str, 'color'),
    colorHover: get(colors, 1 + str, 'color'),
    colorPress: get(colors, 2 + str, 'color'),
    colorFocus: get(colors, 3 + str, 'color'),
    colorTranslucent,
    colorMid: colors[Math.floor(colors.length / 2)],
    shadowColor: isLight ? color.grayA3 : color.grayA8,
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
  { name: 'teal', colors: Colors.teal, darkColors: Colors.tealDark },
  { name: 'lime', colors: Colors.lime, darkColors: Colors.limeDark },
  { name: 'brown', colors: Colors.brown, darkColors: Colors.brownDark },
] as const

export type ColorNames = typeof colorSchemes[number]['name']

export const lightGradient = [
  '#fff',
  '#f4f4f4',
  color.gray1,
  color.gray2,
  color.gray3,
  color.gray4,
  color.gray5,
  color.gray6,
  color.gray7,
  color.gray8,
  color.gray9,
  color.gray10,
  color.gray11,
  color.gray12,
]

export const darkGradient = [
  '#111111',
  '#151515',
  '#191919',
  '#232323',
  '#282828',
  '#323232',
  '#383838',
  '#424242',
  '#494949',
  '#545454',
  '#626262',
  '#777777',
]

const lightThemes = createThemesFrom('light', createTheme, {
  backgrounds: lightGradient,
  isLight: true,
})

const darkThemes = createThemesFrom('dark', createTheme, {
  backgrounds: darkGradient,
  colors: lightGradient.slice(1),
  isLight: false,
  shift: 1,
  offsets: {
    color: [0, 4, 5, 5, 5, 5],
  },
})

const baseThemes = {
  // light
  ...lightThemes,
  light: {
    ...allLightColors,
    ...lightThemes.light,
  },
  light_active: makeActiveTheme(lightThemes.light),
  light_Card: lightThemes.light,
  light_Drawer: lightThemes.light_alt1,
  light_Button: lightThemes.light_alt1,

  // dark
  ...darkThemes,
  dark: {
    ...allDarkColors,
    ...darkThemes.dark,
  },
  dark_active: makeActiveTheme(darkThemes.dark),
  dark_Card: darkThemes.dark_alt1,
  dark_Drawer: darkThemes.dark_alt2,
  dark_Button: darkThemes.dark_alt1,
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
  const [altLightThemes, altDarkThemes] = [
    { colors: darkColors, backgrounds: colors },
    { colors, backgrounds: darkColors },
  ].map((props, i) => {
    const isLight = i === 0
    const [backgrounds, colors] = [
      Object.values(props.backgrounds),
      Object.values(props.colors).slice(isLight ? 0 : 2),
    ] as const

    console.log('wut', i, name, backgrounds, colors)

    const scheme = isLight ? 'light' : 'dark'
    const shift = isLight ? 0 : 1

    if (!isLight) {
      const [_, h, sp, lp] = backgrounds[0].match(/hsl\(([0-9\.]+), ([0-9\.]+)\%, ([0-9\.]+)\%\)/)!
      backgrounds.unshift(`hsl(${h}, ${sp}%, ${parseFloat(lp) / 2}%)`)
    }

    const themeWithAlts = createThemesFrom(name, createTheme, {
      colors,
      backgrounds,
      isLight,
      shift,
      isBase: false,
      offsets: {
        background: isLight ? [1, 1, 1, 0, 0, 0] : null,
        borderColor: isLight ? [0, 1, 1, 2, 2, -2] : null,
        color: isLight ? [0, 0, -1, -2, -3, -3, -4] : [-1, -1, -1, -1, -1, -1],
      },
    })
    return Object.entries(themeWithAlts).map(([k, v]) => [`${scheme}_${k}`, v])
  })
  const lightButtonTheme = altLightThemes[0]
  const darkButtonTheme = altDarkThemes[0]
  return [
    ...altLightThemes,
    [`${lightButtonTheme[0]}_Button`, altLightThemes[2][1]],
    [`${lightButtonTheme[0]}_Card`, altLightThemes[2][1]],
    [`${lightButtonTheme[0]}_Drawer`, altLightThemes[2][1]],
    ...altDarkThemes,
    [`${darkButtonTheme[0]}_Button`, altDarkThemes[2][1]],
    [`${darkButtonTheme[0]}_Card`, altDarkThemes[2][1]],
    [`${darkButtonTheme[0]}_Drawer`, altDarkThemes[2][1]],
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

const allThemes = {
  ...baseThemes,
  ...colorThemes,
  dark_outline,
  light_outline,
} as const

export const themes: {
  [key in keyof typeof allThemes]: typeof baseThemes['light']
} = allThemes as any

// TODO
// export function createThemes(props: {
//   colors?:
//     | 'amber'
//     | 'blue'
//     | 'bronze'
//     | 'brown'
//     | 'crimson'
//     | 'cyan'
//     | 'gold'
//     | 'grass'
//     | 'gray'
//     | 'green'
//     | 'indigo'
//     | 'lime'
//     | 'mint'
//     | 'olive'
//     | 'orange'
//     | 'pink'
//     | 'plum'
//     | 'purple'
//     | 'mauve'
//     | 'red'
//     | 'sage'
//     | 'sand'
//     | 'sky'
//     | 'slate'
//     | 'teal'
//     | 'tomato'
//     | 'violet'
//     | 'yellow'
//   alternates?: number
// }) {}
