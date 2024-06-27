import type { MaskOptions } from '@tamagui/theme-builder'
import { createThemeBuilder } from '@tamagui/theme-builder'
import {
  blue,
  blueDark,
  gray,
  grayDark,
  green,
  greenDark,
  orange,
  orangeDark,
  pink,
  pinkDark,
  purple,
  purpleDark,
  red,
  redDark,
  yellow,
  yellowDark,
} from '@tamagui/colors'
import type { Variable } from '@tamagui/web'
import { createTokens } from '@tamagui/web'

import { masks } from './masks'

export { masks } from './masks'

const colorTokens = {
  light: {
    blue,
    gray,
    green,
    orange,
    pink,
    purple,
    red,
    yellow,
  },
  dark: {
    blue: blueDark,
    gray: grayDark,
    green: greenDark,
    orange: orangeDark,
    pink: pinkDark,
    purple: purpleDark,
    red: redDark,
    yellow: yellowDark,
  },
}

export const palettes = (() => {
  const lightTransparent = 'rgba(255,255,255,0)'
  const darkTransparent = 'rgba(10,10,10,0)'

  const transparent = (hsl: string, opacity = 0) =>
    hsl.replace(`%)`, `%, ${opacity})`).replace(`hsl(`, `hsla(`)

  const getColorPalette = (colors: Object, color = colors[0]): string[] => {
    const colorPalette = Object.values(colors)

    // were re-ordering these
    const [head, tail] = [
      colorPalette.slice(0, 6),
      colorPalette.slice(colorPalette.length - 5),
    ]

    // add our transparent colors first/last
    // and make sure the last (foreground) color is white/black rather than colorful
    // this is mostly for consistency with the older theme-base
    return [
      transparent(colorPalette[0]),
      ...head,
      ...tail,
      color,
      transparent(colorPalette[colorPalette.length - 1]),
    ]
  }

  const lightColor = 'hsl(0, 0%, 9.0%)'
  const lightPalette = [
    lightTransparent,
    '#fff',
    '#f8f8f8',
    'hsl(0, 0%, 96.3%)',
    'hsl(0, 0%, 94.1%)',
    'hsl(0, 0%, 92.0%)',
    'hsl(0, 0%, 90.0%)',
    'hsl(0, 0%, 88.5%)',
    'hsl(0, 0%, 81.0%)',
    'hsl(0, 0%, 56.1%)',
    'hsl(0, 0%, 50.3%)',
    'hsl(0, 0%, 42.5%)',
    lightColor,
    darkTransparent,
  ]

  const darkColor = '#fff'
  const darkPalette = [
    darkTransparent,
    '#050505',
    '#151515',
    '#191919',
    '#232323',
    '#282828',
    '#323232',
    '#424242',
    '#494949',
    '#545454',
    '#626262',
    '#a5a5a5',
    darkColor,
    lightTransparent,
  ]

  const lightPalettes = objectFromEntries(
    objectKeys(colorTokens.light).map(
      (key) =>
        [`light_${key}`, getColorPalette(colorTokens.light[key], lightColor)] as const
    )
  )

  const darkPalettes = objectFromEntries(
    objectKeys(colorTokens.dark).map(
      (key) => [`dark_${key}`, getColorPalette(colorTokens.dark[key], darkColor)] as const
    )
  )

  const colorPalettes = {
    ...lightPalettes,
    ...darkPalettes,
  }

  return {
    light: lightPalette,
    dark: darkPalette,
    ...colorPalettes,
  }
})()

const templateColorsSpecific = {
  color1: 1,
  color2: 2,
  color3: 3,
  color4: 4,
  color5: 5,
  color6: 6,
  color7: 7,
  color8: 8,
  color9: 9,
  color10: 10,
  color11: 11,
  color12: 12,
}

export const templates = (() => {
  // templates use the palette and specify index
  // negative goes backwards from end so -1 is the last item
  const template = {
    ...templateColorsSpecific,
    // the background, color, etc keys here work like generics - they make it so you
    // can publish components for others to use without mandating a specific color scale
    // the @tamagui/button Button component looks for `$background`, so you set the
    // dark_red_Button theme to have a stronger background than the dark_red theme.
    background: 2,
    backgroundHover: 3,
    backgroundPress: 4,
    backgroundFocus: 5,
    backgroundStrong: 1,
    backgroundTransparent: 0,
    color: -1,
    colorHover: -2,
    colorPress: -1,
    colorFocus: -2,
    colorTransparent: -0,
    borderColor: 5,
    borderColorHover: 6,
    borderColorFocus: 4,
    borderColorPress: 5,
    placeholderColor: -4,
    // in the future this should be partially transparent
    outlineColor: 5,
  }

  return {
    base: template,
    colorLight: {
      ...template,
      // light color themes are a bit less sensitive
      borderColor: 4,
      borderColorHover: 5,
      borderColorFocus: 4,
      borderColorPress: 4,
    },
  }
})()

export const maskOptions = (() => {
  const shadows = {
    shadowColor: 0,
    shadowColorHover: 0,
    shadowColorPress: 0,
    shadowColorFocus: 0,
  }

  const colors = {
    ...shadows,
    color: 0,
    colorHover: 0,
    colorFocus: 0,
    colorPress: 0,
  }

  const baseMaskOptions: MaskOptions = {
    override: shadows,
    skip: shadows,
    // avoids the transparent ends
    max: palettes.light.length - 2,
    min: 1,
  }

  const skipShadowsAndSpecificColors = {
    ...shadows,
    ...templateColorsSpecific,
  }

  return {
    component: {
      ...baseMaskOptions,
      override: colors,
      skip: skipShadowsAndSpecificColors,
    },
    alt: {
      ...baseMaskOptions,
    },
    button: {
      ...baseMaskOptions,
      override: {
        ...colors,
        borderColor: 'transparent',
        borderColorHover: 'transparent',
      },
      skip: skipShadowsAndSpecificColors,
    },
  } satisfies Record<string, MaskOptions>
})()

const lightShadowColor = 'rgba(0,0,0,0.04)'
const lightShadowColorStrong = 'rgba(0,0,0,0.085)'
const darkShadowColor = 'rgba(0,0,0,0.2)'
const darkShadowColorStrong = 'rgba(0,0,0,0.3)'

// should roughly map to button/input etc height at each level
// fonts should match that height/lineHeight at each stop
// so these are really non-linear on purpose
// why?
//   - at sizes <1, used for fine grained things (borders, smallest paddingY)
//     - so smallest padY should be roughly 1-4px so it can join with lineHeight
//   - at sizes >=1, have to consider "pressability" (jumps up)
//   - after that it should go upwards somewhat naturally
//   - H1 / headings top out at 10 naturally, so after 10 we can go upwards faster
//  but also one more wrinkle...
//  space is used in conjunction with size
//  i'm setting space to generally just a fixed fraction of size (~1/3-2/3 still fine tuning)
const size = {
  $0: 0,
  '$0.25': 2,
  '$0.5': 4,
  '$0.75': 8,
  $1: 20,
  '$1.5': 24,
  $2: 28,
  '$2.5': 32,
  $3: 36,
  '$3.5': 40,
  $4: 44,
  $true: 44,
  '$4.5': 48,
  $5: 52,
  $6: 64,
  $7: 74,
  $8: 84,
  $9: 94,
  $10: 104,
  $11: 124,
  $12: 144,
  $13: 164,
  $14: 184,
  $15: 204,
  $16: 224,
  $17: 224,
  $18: 244,
  $19: 264,
  $20: 284,
}

type SizeKeysIn = keyof typeof size
type Sizes = {
  [Key in SizeKeysIn extends `$${infer Key}` ? Key : SizeKeysIn]: number
}
type SizeKeys = `${keyof Sizes extends `${infer K}` ? K : never}`

const spaces = Object.entries(size).map(([k, v]) => {
  return [k, sizeToSpace(v)] as const
})

const spacesNegative = spaces.slice(1).map(([k, v]) => [`-${k.slice(1)}`, -v])

type SizeKeysWithNegatives =
  | Exclude<`-${SizeKeys extends `$${infer Key}` ? Key : SizeKeys}`, '-0'>
  | SizeKeys

const space: {
  [Key in SizeKeysWithNegatives]: Key extends keyof Sizes ? Sizes[Key] : number
} = {
  ...Object.fromEntries(spaces),
  ...Object.fromEntries(spacesNegative),
} as any

const zIndex = {
  0: 0,
  1: 100,
  2: 200,
  3: 300,
  4: 400,
  5: 500,
}

const darkColors = {
  ...colorTokens.dark.blue,
  ...colorTokens.dark.gray,
  ...colorTokens.dark.green,
  ...colorTokens.dark.orange,
  ...colorTokens.dark.pink,
  ...colorTokens.dark.purple,
  ...colorTokens.dark.red,
  ...colorTokens.dark.yellow,
}

const lightColors = {
  ...colorTokens.light.blue,
  ...colorTokens.light.gray,
  ...colorTokens.light.green,
  ...colorTokens.light.orange,
  ...colorTokens.light.pink,
  ...colorTokens.light.purple,
  ...colorTokens.light.red,
  ...colorTokens.light.yellow,
}

const color = {
  ...postfixObjKeys(lightColors, 'Light'),
  ...postfixObjKeys(darkColors, 'Dark'),
}

const radius = {
  0: 0,
  1: 3,
  2: 5,
  3: 7,
  4: 9,
  true: 9,
  5: 10,
  6: 16,
  7: 19,
  8: 22,
  9: 26,
  10: 34,
  11: 42,
  12: 50,
}

export const tokens = createTokens({
  color,
  radius,
  zIndex,
  space,
  size,
})

const shadows = {
  light: {
    shadowColor: lightShadowColorStrong,
    shadowColorHover: lightShadowColorStrong,
    shadowColorPress: lightShadowColor,
    shadowColorFocus: lightShadowColor,
  },
  dark: {
    shadowColor: darkShadowColorStrong,
    shadowColorHover: darkShadowColorStrong,
    shadowColorPress: darkShadowColor,
    shadowColorFocus: darkShadowColor,
  },
}

const colorThemeDefinition = (colorName: string) => [
  {
    parent: 'light',
    palette: colorName,
    template: 'colorLight',
  },
  {
    parent: 'dark',
    palette: colorName,
    template: 'base',
  },
]

const nonInherited = {
  light: {
    ...lightColors,
    ...shadows.light,
  },
  dark: {
    ...darkColors,
    ...shadows.dark,
  },
}

const overlayThemeDefinitions = [
  {
    parent: 'light',
    theme: {
      background: 'rgba(0,0,0,0.5)',
    },
  },
  {
    parent: 'dark',
    theme: {
      background: 'rgba(0,0,0,0.9)',
    },
  },
]

// --- themeBuilder ---

const themeBuilder = createThemeBuilder()
  .addPalettes(palettes)
  .addTemplates(templates)
  .addMasks(masks)
  .addThemes({
    light: {
      template: 'base',
      palette: 'light',
      nonInheritedValues: nonInherited.light,
    },
    dark: {
      template: 'base',
      palette: 'dark',
      nonInheritedValues: nonInherited.dark,
    },
  })
  .addChildThemes({
    orange: colorThemeDefinition('orange'),
    yellow: colorThemeDefinition('yellow'),
    green: colorThemeDefinition('green'),
    blue: colorThemeDefinition('blue'),
    purple: colorThemeDefinition('purple'),
    pink: colorThemeDefinition('pink'),
    red: colorThemeDefinition('red'),
    gray: colorThemeDefinition('gray'),
  })
  .addChildThemes({
    alt1: {
      mask: 'soften',
      ...maskOptions.alt,
    },
    alt2: {
      mask: 'soften2Border1',
      ...maskOptions.alt,
    },
    active: {
      mask: 'soften3FlatBorder',
      skip: {
        color: 1,
      },
    },
  })
  .addComponentThemes(
    {
      ListItem: [
        {
          parent: 'light',
          avoidNestingWithin: ['active'],
          mask: 'identity',
          ...maskOptions.component,
        },
        {
          parent: 'dark',
          avoidNestingWithin: ['active'],
          mask: 'identity',
          ...maskOptions.component,
        },
      ],

      Card: {
        mask: 'soften',
        avoidNestingWithin: ['active'],
        ...maskOptions.component,
      },

      Button: {
        mask: 'soften2Border1',
        ...maskOptions.component,
      },

      Checkbox: {
        mask: 'softenBorder2',
        ...maskOptions.component,
      },

      Switch: {
        mask: 'soften2Border1',
        ...maskOptions.component,
      },

      SwitchThumb: {
        mask: 'inverseStrengthen2',
        avoidNestingWithin: ['active'],
        ...maskOptions.component,
      },

      TooltipContent: {
        mask: 'soften2Border1',
        avoidNestingWithin: ['active'],
        ...maskOptions.component,
      },

      DrawerFrame: {
        mask: 'soften',
        avoidNestingWithin: ['active'],
        ...maskOptions.component,
      },

      Progress: {
        mask: 'soften',
        avoidNestingWithin: ['active'],
        ...maskOptions.component,
      },

      RadioGroupItem: {
        mask: 'softenBorder2',
        avoidNestingWithin: ['active'],
        ...maskOptions.component,
      },

      TooltipArrow: {
        mask: 'soften',
        avoidNestingWithin: ['active'],
        ...maskOptions.component,
      },

      SliderTrackActive: {
        mask: 'inverseSoften',
        ...maskOptions.component,
      },

      SliderTrack: {
        mask: 'soften2Border1',
        avoidNestingWithin: ['active'],
        ...maskOptions.component,
      },

      SliderThumb: {
        mask: 'inverse',
        avoidNestingWithin: ['active'],
        ...maskOptions.component,
      },

      Tooltip: {
        mask: 'inverse',
        avoidNestingWithin: ['active'],
        ...maskOptions.component,
      },

      ProgressIndicator: {
        mask: 'inverse',
        avoidNestingWithin: ['active'],
        ...maskOptions.component,
      },

      SheetOverlay: overlayThemeDefinitions,
      DialogOverlay: overlayThemeDefinitions,
      ModalOverlay: overlayThemeDefinitions,

      Input: {
        mask: 'softenBorder2',
        ...maskOptions.component,
      },

      TextArea: {
        mask: 'softenBorder2',
        ...maskOptions.component,
      },
    },
    {
      // to save bundle size but make alt themes not work on components
      // avoidNestingWithin: ['alt1', 'alt2'],
    }
  )

// --- main export ---

const themesIn = themeBuilder.build()

type ThemesIn = typeof themesIn
// add non-inherited back to typs
type ThemesOut = Omit<ThemesIn, 'light' | 'dark'> & {
  light: ThemesIn['light'] & typeof nonInherited.light
  dark: ThemesIn['dark'] & typeof nonInherited.dark
}
export const themes = themesIn as ThemesOut

// --- utils ---

function postfixObjKeys<
  A extends { [key: string]: Variable<string> | string },
  B extends string,
>(
  obj: A,
  postfix: B
): {
  [Key in `${keyof A extends string ? keyof A : never}${B}`]: Variable<string> | string
} {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [`${k}${postfix}`, v])
  ) as any
}

// a bit odd but keeping backward compat for values >8 while fixing below
function sizeToSpace(v: number) {
  if (v === 0) return 0
  if (v === 2) return 0.5
  if (v === 4) return 1
  if (v === 8) return 1.5
  if (v <= 16) return Math.round(v * 0.333)
  return Math.floor(v * 0.7 - 12)
}

function objectFromEntries<ARR_T extends EntriesType>(
  arr: ARR_T
): EntriesToObject<ARR_T> {
  return Object.fromEntries(arr) as EntriesToObject<ARR_T>
}

type EntriesType =
  | [PropertyKey, unknown][]
  | ReadonlyArray<readonly [PropertyKey, unknown]>

type DeepWritable<OBJ_T> = { -readonly [P in keyof OBJ_T]: DeepWritable<OBJ_T[P]> }
type UnionToIntersection<UNION_T> = // From https://stackoverflow.com/a/50375286
  (UNION_T extends any ? (k: UNION_T) => void : never) extends (k: infer I) => void
    ? I
    : never

type UnionObjectFromArrayOfPairs<ARR_T extends EntriesType> =
  DeepWritable<ARR_T> extends (infer R)[]
    ? R extends [infer key, infer val]
      ? { [prop in key & PropertyKey]: val }
      : never
    : never
type MergeIntersectingObjects<ObjT> = { [key in keyof ObjT]: ObjT[key] }
type EntriesToObject<ARR_T extends EntriesType> = MergeIntersectingObjects<
  UnionToIntersection<UnionObjectFromArrayOfPairs<ARR_T>>
>

function objectKeys<O extends Object>(obj: O) {
  return Object.keys(obj) as Array<keyof O>
}
