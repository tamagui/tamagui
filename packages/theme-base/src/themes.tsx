import { Variable, createTheme, getVariableValue, isWeb } from '@tamagui/core'

import { setColorAlpha } from './colorUtils'
import { darkColors, lightColors } from './tokens'

// spaghetti ahead

type ThemeCreatorProps = {
  shift?: number
  backgrounds: (string | Variable)[]
  backgroundStrong?: string | Variable
  borderColors?: (string | Variable)[]
  colors?: (string | Variable)[]
  activeTheme?: any
  offsets?: {
    color?: number[] | null
    background?: number[] | null
    borderColor?: number[] | null
  }
  isLight?: boolean
  isBase?: boolean
}

// helpers

const alternates = [1, 2, 3] as const
const alts = [1, 2] as const
type AltKeys = 1 | 2
type AltName<Name extends string, Keys extends string | number> = `${Name}_alt${Keys}`
type ThemeCreator<A = any> = (str: number, props: ThemeCreatorProps) => A

interface SubTheme {
  background: Variable<any> | string
  backgroundStrong: Variable<any> | string
  backgroundSoft: Variable<any> | string
  backgroundHover: Variable<any> | string
  backgroundPress: Variable<any> | string
  backgroundFocus: Variable<any> | string
  backgroundTransparent: Variable<any> | string
  color: Variable<any> | string
  colorHover: Variable<any> | string
  colorPress: Variable<any> | string
  colorFocus: Variable<any> | string
  colorTranslucent: Variable<any> | string
  colorMid: Variable<any> | string
  shadowColor: Variable<any> | string
  shadowColorHover: Variable<any> | string
  shadowColorPress: Variable<any> | string
  shadowColorFocus: Variable<any> | string
  borderColor: Variable<any> | string
  borderColorHover: Variable<any> | string
  borderColorPress: Variable<any> | string
  borderColorFocus: Variable<any> | string
}

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
    getTheme(alt * 1 + shift, props),
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
  const activeTheme = props.activeTheme || {
    ...theme,
    borderColor: props.backgrounds[7],
    background: props.backgrounds[6],
    backgroundHover: props.backgrounds[6],
    backgroundPress: props.backgrounds[6],
  }

  // TODO can be de-duped
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
    [`${name}_SliderTrack`, altThemes[0][1]],
    [`${name}_SliderTrackActive`, altThemes[2][1]],
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

const themeCreator = (
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

  const theme: SubTheme = {
    background: get(backgrounds, str),
    backgroundStrong: backgroundStrong || get(backgrounds, str + strongerDir * 2),
    backgroundSoft: get(backgrounds, str + softerDir * 2),
    backgroundHover: get(backgrounds, str + lighterDir),
    backgroundPress: get(backgrounds, str + darkerDir),
    backgroundFocus: get(backgrounds, str + darkerDir * 2),
    backgroundTransparent: 'hsla(0, 0%, 0%, 0.012)',
    color: get(colors, 0 + str, 'color'),
    colorHover: get(colors, 1 + str, 'color'),
    colorPress: get(colors, 2 + str, 'color'),
    colorFocus: get(colors, 3 + str, 'color'),
    colorTranslucent,
    colorMid: (isLight ? colors : backgrounds)[Math.floor(colors.length / 2)],
    shadowColor: isLight ? 'hsla(0, 0%, 0%, 0.03)' : 'hsla(0, 0%, 0%, 0.2)',
    shadowColorHover: darkColors[!isLight ? 1 : 8],
    shadowColorPress: darkColors[!isLight ? 1 : 8],
    shadowColorFocus: darkColors[!isLight ? 1 : 8],
    borderColor: null as any as string | Variable,
    borderColorHover: null as any as string | Variable,
    borderColorPress: null as any as string | Variable,
    borderColorFocus: null as any as string | Variable,
  }

  if (process.env.ENABLE_STEPS) {
    Object.assign(theme, {
      step1: backgrounds[0],
      step2: backgrounds[1],
      step3: backgrounds[2],
      step4: backgrounds[3],
      step5: backgrounds[4],
      step6: backgrounds[5],
      step7: backgrounds[6],
      step8: backgrounds[7],
      step9: backgrounds[8],
      step10: backgrounds[9],
      step11: backgrounds[10],
      step12: backgrounds[11],
    })
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

const themeColors = {
  light: [
    '#fff',
    '#f4f4f4',
    'hsl(0, 0%, 99.0%)',
    'hsl(0, 0%, 97.3%)',
    'hsl(0, 0%, 95.1%)',
    'hsl(0, 0%, 93.0%)',
    'hsl(0, 0%, 90.9%)',
    'hsl(0, 0%, 88.7%)',
    'hsl(0, 0%, 85.8%)',
    'hsl(0, 0%, 78.0%)',
    'hsl(0, 0%, 56.1%)',
    'hsl(0, 0%, 52.3%)',
    'hsl(0, 0%, 43.5%)',
    'hsl(0, 0%, 9.0%)',
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

const lightThemes = createThemesFrom('light', themeCreator, {
  backgrounds: themeColors.light,
  // for now web non-ios style native is...
  backgroundStrong: isWeb ? '#fefefe' : '#f2f2f2',
  borderColors: themeColors.light.slice(2),
  isLight: true,
  offsets: {
    background: [2, 2, 2, 2, 2, 2],
  },
})

const darkThemes = createThemesFrom('dark', themeCreator, {
  backgrounds: themeColors.dark,
  colors: themeColors.light.slice(2),
  backgroundStrong: '#070707',
  isBase: true,
  isLight: false,
  shift: 1,
  offsets: {
    color: [0, 4, 5, 5, 5, 5],
  },
})

darkThemes.dark_darker.background = '#030303'
darkThemes.dark_darker.backgroundStrong = '#000'

type BaseTheme = {
  [key in keyof typeof lightColors | keyof SubTheme]: Variable<string>
}

const light = createTheme({
  ...lightColors,
  ...lightThemes.light,
}) as BaseTheme

const dark = createTheme({
  ...darkColors,
  ...darkThemes.dark,
}) as BaseTheme

const baseThemes = {
  // light
  ...lightThemes,
  light,
  // reserving in types, updating later
  light_active: lightThemes.light,
  light_Card: lightThemes.light,
  light_SliderTrack: lightThemes.light_alt1,
  light_SliderTrackActive: lightThemes.light_alt2,
  light_Switch: lightThemes.light_alt2,
  light_SwitchThumb: lightThemes.light,
  light_DrawerFrame: lightThemes.light_alt1,

  // dark
  ...darkThemes,
  dark,
  // reserving in types, updating later
  dark_active: darkThemes.dark,
  dark_Card: darkThemes.dark,
  dark_DrawerFrame: darkThemes.dark_alt1,
  dark_SliderTrack: darkThemes.dark_darker,
  dark_SliderTrackActive: darkThemes.dark_alt2,
  dark_Switch: darkThemes.dark_alt2,
  dark_SwitchThumb: darkThemes.dark_darker,
  dark_Button: darkThemes.dark_alt1,
}

const darkEntries = Object.entries(dark)
const lightEntries = Object.entries(light)
function findColors(prefix: string, dark = false): BaseTheme {
  return Object.fromEntries(
    (dark ? darkEntries : lightEntries).filter(([k]) => k.startsWith(prefix))
  ) as any
}

export const colorSchemes = [
  { name: 'blue', colors: findColors('blue'), darkColors: findColors('blue', true) },
  { name: 'gray', colors: findColors('gray'), darkColors: findColors('gray', true) },
  { name: 'green', colors: findColors('green'), darkColors: findColors('green', true) },
  { name: 'orange', colors: findColors('orange'), darkColors: findColors('orange', true) },
  { name: 'pink', colors: findColors('pink'), darkColors: findColors('pink', true) },
  { name: 'purple', colors: findColors('purple'), darkColors: findColors('purple', true) },
  { name: 'red', colors: findColors('red'), darkColors: findColors('red', true) },
  { name: 'yellow', colors: findColors('yellow'), darkColors: findColors('yellow', true) },
] as const

export type ColorNames = typeof colorSchemes[number]['name']

// nice and flat
export const colorNames: ColorNames[] = [
  'blue',
  'green',
  'orange',
  'pink',
  'purple',
  'red',
  'yellow',
  'gray',
]

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
    const colorsBase = Object.values(props.colors).slice(2)
    const [backgrounds, colors] = [
      Object.values(props.backgrounds),
      isLight ? colorsBase : [colorsBase[0], '#ccc', ...colorsBase.slice(1)],
    ] as const

    const scheme = isLight ? 'light' : 'dark'
    const shift = isLight ? 0 : 1

    // if (!isLight) {
    //   const [_, h, sp, lp] = backgrounds[0].match(/hsl\(([0-9\.]+), ([0-9\.]+)\%, ([0-9\.]+)\%\)/)!
    //   backgrounds.unshift(`hsl(${h}, ${sp}%, ${parseFloat(lp) / 2}%)`)
    // }

    const themeWithAlts = createThemesFrom(name, themeCreator, {
      // @ts-ignore
      colors,
      // @ts-ignore
      backgrounds,
      // @ts-ignore
      borderColors: backgrounds,
      isLight,
      shift,
      isBase: false,
      offsets: {
        background: isLight ? [2, 2, 2, 2, 2, 2] : null,
        borderColor: isLight ? [2, 2, 2, 3, 2] : null,
        color: isLight ? [0, 0, -1, -2, -3, -3, -4] : [-1, -1, -1, -1, -1, -1],
      },
    })

    return Object.entries(themeWithAlts).map(([k, v]) => [`${scheme}_${k}`, v])
  })
  return [...altLightThemes, ...altDarkThemes]
})

type TypedColorTheme = typeof lightThemes.light_alt1
type TypedTheme = typeof light
type TypedThemes = {
  [key in keyof typeof allThemes]: TypedTheme
}

const colorThemes: {
  [key in ColorThemeNames]: TypedColorTheme
} = Object.fromEntries(colorThemeEntries) as any

// add in base _active themes
baseThemes.dark_active = {
  ...colorThemes.dark_blue_alt2,
  background: darkColors.blue10,
  backgroundHover: darkColors.blue11,
  backgroundPress: darkColors.blue9,
  backgroundFocus: darkColors.blue9,
  color: darkColors.blue12,
  colorHover: darkColors.blue12,
  colorPress: darkColors.blue12,
  colorFocus: darkColors.blue12,
}

// light active uses light foregound, ios style
baseThemes.light_active = baseThemes.dark_active

const allThemes = {
  ...baseThemes,
  ...colorThemes,
} as const

export const themes: TypedThemes = allThemes as any
