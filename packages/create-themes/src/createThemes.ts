import { Variable, createTheme, getVariableValue, isWeb } from '@tamagui/core'

import { setColorAlpha } from './colorUtils'

type ColorsByName = {
  [key: string]: Record<string, string>
}

type ColorsList = string[]

// can make configurable
type AltKeys = 1 | 2
type AltName<Name extends string, Keys extends string | number> = `${Name}_alt${Keys}`

type GeneratedTheme = {
  backgroundStrong: Variable<string>
  background: Variable<string>
  backgroundSoft: Variable<string>
  backgroundHover: Variable<string>
  backgroundPress: Variable<string>
  backgroundFocus: Variable<string>
  backgroundTransparent: Variable<string>
  color: Variable<string>
  colorHover: Variable<string>
  colorPress: Variable<string>
  colorFocus: Variable<string>
  colorTranslucent: Variable<string>
  colorMid: Variable<string>
  shadowColor: Variable<string>
  shadowColorHover: Variable<string>
  shadowColorPress: Variable<string>
  shadowColorFocus: Variable<string>
  borderColor: Variable<string>
  borderColorHover: Variable<string>
  borderColorPress: Variable<string>
  borderColorFocus: Variable<string>
  color1: Variable<string>
  color2: Variable<string>
  color3: Variable<string>
  color4: Variable<string>
  color5: Variable<string>
  color6: Variable<string>
  color7: Variable<string>
  color8: Variable<string>
  color9: Variable<string>
  color10: Variable<string>
  color11: Variable<string>
  color12: Variable<string>
}

type GetSubThemes<Name extends string> =
  | `${Name}`
  | `${Name}_alt${AltKeys}`
  | `${Name}_darker`
  | `${Name}_active`
  | `${Name}_Card`
  | `${Name}_SliderTrack`
  | `${Name}_SliderTrackActive`
  | `${Name}_Switch`
  | `${Name}_SwitchThumb`
  | `${Name}_DrawerFrame`
  | `${Name}_Button`
  | `${Name}_SliderThumb`
  | `${Name}_Progress`
  | `${Name}_ProgressIndicator`
  | `${Name}_TooltipArrow`
  | `${Name}_TooltipContent`

export const createThemes = <C extends string>({
  activeColor,
  light,
  dark,
  colorsLight,
  colorsDark,
}: {
  activeColor: string
  light: ColorsList
  dark: ColorsList
  colorsLight: ColorsByName
  colorsDark: ColorsByName
}): {
  [key in GetSubThemes<C> | GetSubThemes<`light`> | GetSubThemes<`dark`>]: GeneratedTheme
} => {
  function flatten(obj: ColorsByName) {
    const next = {}
    for (const key in obj) {
      Object.assign(next, obj[key])
    }
    return next
  }

  const darkColors = flatten(colorsDark)
  const lightColors = flatten(colorsLight)

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
    color1: Variable<any> | string
    color2: Variable<any> | string
    color3: Variable<any> | string
    color4: Variable<any> | string
    color5: Variable<any> | string
    color6: Variable<any> | string
    color7: Variable<any> | string
    color8: Variable<any> | string
    color9: Variable<any> | string
    color10: Variable<any> | string
    color11: Variable<any> | string
    color12: Variable<any> | string
  }

  function createThemesFrom<Name extends string, GetTheme extends ThemeCreator = ThemeCreator>(
    name: Name,
    getTheme: GetTheme,
    props: ThemeCreatorProps
  ): {
    [key in GetSubThemes<Name>]: GetTheme extends ThemeCreator<infer Theme> ? Theme : never
  } {
    const { shift = 0 } = props
    const theme = getTheme(0 + shift, props)
    let themeEntries: any[] = [[name, theme]]

    // generate alternates (for use in other themes), but keep just alts
    const altThemes: any[] = alternates.map((alt) => [
      `${name}_alt${alt}`,
      getTheme(alt + shift - 1, props),
    ])
    const altButtonThemes: any[] = alternates.map((_, i) => {
      const [bName, bTheme] = [altThemes[i][0], (altThemes[i + 1] || altThemes[i])[1]]
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
      [`${name}_Button`, altThemes[2][1]],
      [`${name}_DrawerFrame`, altThemes[2][1]],
      [`${name}_SliderTrack`, altThemes[1][1]],
      [`${name}_SliderTrackActive`, altThemes[2][1]],
      [`${name}_SliderThumb`, inverted[2]],
      [`${name}_Progress`, altThemes[2][1]],
      [`${name}_ProgressIndicator`, inverted[2]],
      [`${name}_Switch`, altThemes[1][1]],
      [`${name}_SwitchThumb`, inverted[2]],
      [`${name}_TooltipArrow`, altThemes[2][1]],
      [`${name}_TooltipContent`, altThemes[2][1]],
      [`${name}_darker`, darkerTheme],
      [`${name}_active`, activeTheme],
    ]
    const themes = Object.fromEntries(themeEntries)
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
      color1: backgrounds[0],
      color2: backgrounds[1],
      color3: backgrounds[2],
      color4: backgrounds[3],
      color5: backgrounds[4],
      color6: backgrounds[5],
      color7: backgrounds[6],
      color8: backgrounds[7],
      color9: backgrounds[8],
      color10: backgrounds[9],
      color11: backgrounds[10],
      color12: backgrounds[11],
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

  const lightThemes = createThemesFrom('light', themeCreator, {
    backgrounds: light,
    // for now web non-ios style native is...
    backgroundStrong: isWeb ? '#fefefe' : '#f2f2f2',
    borderColors: light.slice(2),
    isLight: true,
    offsets: {
      background: [2, 2, 2, 2, 2, 2],
    },
  })

  const darkThemes = createThemesFrom('dark', themeCreator, {
    backgrounds: dark,
    colors: light.slice(2),
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

  const lightTheme = createTheme({
    ...lightColors,
    ...lightThemes.light,
  }) as BaseTheme

  const darkTheme = createTheme({
    ...darkColors,
    ...darkThemes.dark,
  }) as BaseTheme

  const baseThemes = {
    // light
    ...lightThemes,
    light: lightTheme,
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
    dark: darkTheme,
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

  const darkEntries = Object.entries(darkTheme)
  const lightEntries = Object.entries(lightTheme)
  function findColors(prefix: string, dark = false): BaseTheme {
    return Object.fromEntries(
      (dark ? darkEntries : lightEntries).filter(([k]) => k.startsWith(prefix))
    ) as any
  }

  const colorSchemes: any[] = []

  for (const name in colorsLight) {
    colorSchemes.push({
      name,
      colors: findColors(name),
      darkColors: findColors(name, true),
    })
  }

  type ColorNames = typeof colorSchemes[number]['name']

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

  const colorThemes: {
    [key in ColorThemeNames]: TypedColorTheme
  } = Object.fromEntries(colorThemeEntries) as any

  // add in base _active themes
  baseThemes.dark_active = {
    ...colorThemes[`dark_${activeColor}_alt2`],
    background: darkColors[`${activeColor}10`],
    backgroundHover: darkColors[`${activeColor}11`],
    backgroundPress: darkColors[`${activeColor}9`],
    backgroundFocus: darkColors[`${activeColor}9`],
    color: darkColors[`${activeColor}12`],
    colorHover: darkColors[`${activeColor}12`],
    colorPress: darkColors[`${activeColor}12`],
    colorFocus: darkColors[`${activeColor}12`],
  }

  // light active uses light foregound, ios style
  baseThemes.light_active = baseThemes.dark_active

  const allThemes = {
    ...baseThemes,
    ...colorThemes,
  } as any

  return allThemes
}
