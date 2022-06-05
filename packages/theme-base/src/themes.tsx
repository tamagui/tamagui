import { Variable, createVariable, getVariableValue } from '@tamagui/core'

import { setColorAlpha } from './colorUtils'
import { colorTokens, darkColors, lightColors, tokens } from './tokens'

const { color } = tokens

// spaghetti ahead

type ThemeCreatorProps = {
  shift?: number
  backgrounds: (string | Variable)[]
  backgroundStrong?: string | Variable
  borderColors?: (string | Variable)[]
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
const alts = [1, 2, 3] as const
type AltKeys = 1 | 2 | 3
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

  // generate alternates (for use in other themes), but keep just alts
  const altThemes: any[] = alternates.map((alt) => [
    `${name}_alt${alt}`,
    getTheme(alt + (props.isLight ? 1 : 0) + shift, props),
  ])
  const altThemes2: any[] = alternates.map((alt) => [
    `${name}_alt${alt}`,
    getTheme(alt + shift, props),
  ])
  const altButtonThemes: any[] = alternates.map((_, i) => {
    const [bName, bTheme] = [altThemes2[i][0], (altThemes2[i + 1] || altThemes2[i])[1]]
    return [`${bName}_Button` as any, bTheme]
  })
  // add these after alts since we rely on positioning
  const darkerTheme = getTheme(Math.max(0, shift + (props.isLight ? 1 : -1)), props)
  const activeTheme = makeActiveTheme(theme)

  const inverted = altThemes.map(([_name, theme]) => {
    return {
      ...theme,
      background: theme.color,
      backgroundHover: theme.colorHover,
      backgroundFocus: theme.colorFocus,
      backgroundPress: theme.colorPress,
      color: theme.background,
      colorHover: theme.backgroundHover,
      colorFocus: theme.backgroundFocus,
      colorPress: theme.backgroundPress,
    }
  })

  themeEntries = [
    ...themeEntries,
    // keep just alts
    ...altThemes.slice(0, alts.length),
    ...altButtonThemes.slice(0, alts.length),
    [`${name}_Button`, altThemes2[1][1]],
    [`${name}_DrawerFrame`, altThemes2[1][1]],
    [`${name}_SliderTrack`, altThemes[1][1]],
    [`${name}_SliderTrackActive`, altThemes[3][1]],
    [`${name}_SliderThumb`, inverted[2]],
    [`${name}_Progress`, altThemes[2][1]],
    [`${name}_ProgressIndicator`, inverted[2]],
    [`${name}_Switch`, altThemes[0][1]],
    [`${name}_SwitchThumb`, inverted[2]],
    [`${name}_TooltipArrow`, altThemes[1][1]],
    [`${name}_TooltipContent`, altThemes[1][1]],
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
    isBase = false,
    colors = [...backgrounds].reverse(),
    borderColors = isLight ? colors : backgrounds,
    backgroundStrong,
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
  const softerDir = -strongerDir
  const get = (arr: any[], index: number, name = 'background') => {
    return arr[Math.max(0, Math.min(index + (offsets[name][str] || 0), arr.length - 1))]
  }

  const colorTranslucent = setColorAlpha(getVariableValue(get(colors, 0 + str, 'color')), 0.5)

  let theme = {
    background: get(backgrounds, str),
    backgroundStrong: backgroundStrong || get(backgrounds, str + strongerDir * 2),
    backgroundSoft: get(backgrounds, str + softerDir * 2),
    backgroundHover: get(backgrounds, str + lighterDir),
    backgroundPress: get(backgrounds, str + darkerDir),
    backgroundFocus: get(backgrounds, str + darkerDir * 2),
    backgroundTransparent: color.grayA1,
    color: get(colors, 0 + str, 'color'),
    colorHover: get(colors, 1 + str, 'color'),
    colorPress: get(colors, 2 + str, 'color'),
    colorFocus: get(colors, 3 + str, 'color'),
    colorTranslucent,
    colorMid: (isLight ? colors : backgrounds)[Math.floor(colors.length / 2)],
    shadowColor: isLight ? color.grayA2 : color.grayA8,
    shadowColorHover: darkColors[!isLight ? 1 : 8],
    shadowColorPress: darkColors[!isLight ? 1 : 8],
    shadowColorFocus: darkColors[!isLight ? 1 : 8],
    borderColor: null as any as string | Variable,
    borderColorHover: null as any as string | Variable,
    borderColorPress: null as any as string | Variable,
    borderColorFocus: null as any as string | Variable,
  }

  if (isBase) {
    Object.assign(theme, {
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
    })
  } else {
    Object.assign(theme, {
      borderColor: get(borderColors, 1 + strongerDir, 'borderColor'),
      borderColorHover: get(borderColors, 2 + strongerDir, 'borderColor'),
      borderColorPress: get(borderColors, 3 + strongerDir, 'borderColor'),
      borderColorFocus: get(borderColors, 4 + strongerDir, 'borderColor'),
    })
  }

  return theme
}

export const colorSchemes = [
  { name: 'blue', colors: colorTokens.light.blue, darkColors: colorTokens.dark.blue },
  { name: 'gray', colors: colorTokens.light.gray, darkColors: colorTokens.dark.gray },
  { name: 'green', colors: colorTokens.light.green, darkColors: colorTokens.dark.green },
  { name: 'orange', colors: colorTokens.light.orange, darkColors: colorTokens.dark.orange },
  { name: 'pink', colors: colorTokens.light.pink, darkColors: colorTokens.dark.pink },
  { name: 'purple', colors: colorTokens.light.purple, darkColors: colorTokens.dark.purple },
  { name: 'red', colors: colorTokens.light.red, darkColors: colorTokens.dark.red },
  { name: 'violet', colors: colorTokens.light.violet, darkColors: colorTokens.dark.violet },
  { name: 'yellow', colors: colorTokens.light.yellow, darkColors: colorTokens.dark.yellow },
  { name: 'teal', colors: colorTokens.light.teal, darkColors: colorTokens.dark.teal },
] as const

export type ColorNames = typeof colorSchemes[number]['name']

const themeColors = {
  light: [
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
  ],
  dark: [
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
  ],
}

const lightThemes = createThemesFrom('light', createTheme, {
  backgrounds: themeColors.light,
  // isBase: true,
  backgroundStrong: '#fafafa',
  borderColors: themeColors.light.slice(2),
  isLight: true,
})

const darkThemes = createThemesFrom('dark', createTheme, {
  backgrounds: themeColors.dark,
  colors: themeColors.light.slice(2),
  backgroundStrong: '#111',
  isBase: true,
  isLight: false,
  shift: 1,
  offsets: {
    color: [0, 4, 5, 5, 5, 5],
  },
})

// nice and flat
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
  'teal',
] as const

const baseThemes = {
  // light
  ...lightThemes,
  light: {
    ...lightColors,
    ...lightThemes.light,
  },
  light_active: makeActiveTheme(lightThemes.light),
  light_Card: lightThemes.light,
  light_Button: lightThemes.light,
  light_SliderTrack: lightThemes.light_alt1,
  light_SliderTrackActive: lightThemes.light_alt2,
  light_Switch: lightThemes.light,
  light_SwitchThumb: lightThemes.light_alt1,
  light_DrawerFrame: lightThemes.light_alt1,

  // dark
  ...darkThemes,
  dark: {
    ...darkColors,
    ...darkThemes.dark,
  },
  dark_active: makeActiveTheme(darkThemes.dark),
  dark_Card: darkThemes.dark,
  dark_DrawerFrame: darkThemes.dark_alt1,
  dark_SliderTrack: darkThemes.dark_darker,
  dark_SliderTrackActive: darkThemes.dark_alt1,
  dark_Switch: darkThemes.dark_darker,
  dark_SwitchThumb: darkThemes.dark_alt1,
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
      Object.values(props.colors).slice(isLight ? 2 : 2),
    ] as const

    const scheme = isLight ? 'light' : 'dark'
    const shift = isLight ? 0 : 1

    if (!isLight) {
      const [_, h, sp, lp] = backgrounds[0].val.match(
        /hsl\(([0-9\.]+), ([0-9\.]+)\%, ([0-9\.]+)\%\)/
      )!
      const key = backgrounds[0].key.replace('1', '0')
      backgrounds.unshift(
        createVariable({
          key,
          name: key,
          val: `hsl(${h}, ${sp}%, ${parseFloat(lp) / 2}%)`,
        })
      )
    }

    const themeWithAlts = createThemesFrom(name, createTheme, {
      colors,
      backgrounds,
      borderColors: backgrounds,
      isLight,
      shift,
      isBase: false,
      offsets: {
        background: isLight ? [1, 1, 1, 1, 1, 1] : null,
        borderColor: isLight ? [2, 2, 2, 3, 2] : null,
        color: isLight ? [0, 0, -1, -2, -3, -3, -4] : [-1, -1, -1, -1, -1, -1],
      },
    })

    return Object.entries(themeWithAlts).map(([k, v]) => [`${scheme}_${k}`, v])
  })
  return [...altLightThemes, ...altDarkThemes]
})

type MyThemeBase = typeof baseThemes['light_alt1']

const colorThemes: {
  [key in ColorThemeNames]: MyThemeBase
} = Object.fromEntries(colorThemeEntries) as any

const allThemes = {
  ...baseThemes,
  ...colorThemes,
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
