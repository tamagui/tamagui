import {
  ThemeBuilder,
  combineMasks,
  createIdentityMask,
  createInverseMask,
  createSoftenMask,
  createStrengthenMask,
  skipMask,
} from '@tamagui/create-theme'
import { colorTokens } from '@tamagui/themes'

import { objectFromEntries, objectKeys } from './helpers'

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
    '#f9f9f9',
    'hsl(0, 0%, 97.3%)',
    'hsl(0, 0%, 95.1%)',
    'hsl(0, 0%, 94.0%)',
    'hsl(0, 0%, 92.0%)',
    'hsl(0, 0%, 89.5%)',
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

export const templates = (() => {
  const templateColors = {
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

  const templateShadows = {
    shadowColor: 1,
    shadowColorHover: 1,
    shadowColorPress: 2,
    shadowColorFocus: 2,
  }

  // we can use subset of our template as a "override" so it doesn't get adjusted with masks
  // we want to skip over templateColor + templateShadows
  const toSkip = {
    ...templateShadows,
  }

  // templates use the palette and specify index
  // negative goes backwards from end so -1 is the last item
  const template = {
    ...templateColors,
    ...toSkip,
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
    borderColor: 4,
    borderColorHover: 5,
    borderColorPress: 3,
    borderColorFocus: 4,
    placeholderColor: -4,
  }

  const baseTemplate = {
    ...template,
    // our light color palette is... a bit unique
    borderColor: 6,
    borderColorHover: 7,
    borderColorFocus: 5,
    borderColorPress: 6,
  }

  return {
    base: baseTemplate,
    colorLight: {
      ...baseTemplate,
      // light color themes are a bit less sensitive
      borderColor: 4,
      borderColorHover: 5,
      borderColorFocus: 4,
      borderColorPress: 4,
    },
  }
})()

const lightShadowColor = 'rgba(0,0,0,0.02)'
const lightShadowColorStrong = 'rgba(0,0,0,0.066)'
const darkShadowColor = 'rgba(0,0,0,0.2)'
const darkShadowColorStrong = 'rgba(0,0,0,0.3)'

const lightShadows = {
  shadowColor: lightShadowColorStrong,
  shadowColorHover: lightShadowColorStrong,
  shadowColorPress: lightShadowColor,
  shadowColorFocus: lightShadowColor,
}

const darkShadows = {
  shadowColor: darkShadowColorStrong,
  shadowColorHover: darkShadowColorStrong,
  shadowColorPress: darkShadowColor,
  shadowColorFocus: darkShadowColor,
}

const colorThemeDefinition = [
  {
    parent: 'light',
    palette: 'blue',
    template: 'colorLight',
  },
  {
    parent: 'dark',
    palette: 'blue',
    template: 'base',
  },
]

const overlayThemes = {
  light: {
    background: 'rgba(0,0,0,0.5)',
  },
  dark: {
    background: 'rgba(0,0,0,0.9)',
  },
}

const overlayThemeDefinitions = [
  {
    parent: 'light',
    theme: overlayThemes.light,
  },
  {
    parent: 'dark',
    theme: overlayThemes.dark,
  },
]

const inputThemeDefinitions = [
  {
    parent: 'light',
    mask: 'strengthenButSoftenBorder',
  },
  {
    parent: 'dark',
    mask: 'softenBorder',
  },
]

const themesBuilder = new ThemeBuilder()
  .addPalettes(palettes)
  .addTemplates(templates)
  .addMasks({
    identity: createIdentityMask(),
    soften: createSoftenMask(),
    soften2: createSoftenMask({ strength: 2 }),
    soften3: createSoftenMask({ strength: 3 }),
    strengthen: createStrengthenMask(),
    inverse: createInverseMask(),
    inverseSoften: combineMasks(createInverseMask(), createSoftenMask()),
    inverseSoften2: combineMasks(createInverseMask(), createSoftenMask({ strength: 2 })),
    strengthenButSoftenBorder: (template, options) => {
      const stronger = createStrengthenMask()(template, options)
      const softer = createSoftenMask()(template, options)
      return {
        ...stronger,
        borderColor: softer.borderColor,
        borderColorHover: softer.borderColorHover,
        borderColorPress: softer.borderColorPress,
        borderColorFocus: softer.borderColorFocus,
      }
    },
    softenBorder: (template, options) => {
      const plain = skipMask(template, options)
      const softer = createSoftenMask()(template, options)
      return {
        ...plain,
        borderColor: softer.borderColor,
        borderColorHover: softer.borderColorHover,
        borderColorPress: softer.borderColorPress,
        borderColorFocus: softer.borderColorFocus,
      }
    },
  })
  .addThemes({
    dark: {
      template: 'base',
      palette: 'dark',
    },
    light: {
      template: 'base',
      palette: 'light',
    },
  })
  .addChildThemes({
    orange: colorThemeDefinition,
    yellow: colorThemeDefinition,
    green: colorThemeDefinition,
    blue: colorThemeDefinition,
    purple: colorThemeDefinition,
    pink: colorThemeDefinition,
    red: colorThemeDefinition,
  })
  .addChildThemes({
    alt1: {
      mask: 'soften',
    },
    alt2: {
      mask: 'soften2',
    },
    active: {
      mask: 'soften3',
      skip: {
        color: 1,
      },
    },
  })
  .addChildThemes(
    {
      ListItem: [
        {
          parent: 'light',
          mask: 'strengthen',
        },
        {
          parent: 'dark',
          mask: 'identity',
        },
      ],

      Card: {
        mask: 'soften',
      },

      Button: {
        mask: 'soften2',
        override: {
          borderColor: 'transparent',
          borderColorHover: 'transparent',
        },
      },

      Checkbox: {
        mask: 'soften2',
      },

      SliderTrackActive: {
        mask: 'soften2',
      },

      Switch: {
        mask: 'soften2',
      },

      TooltipContent: {
        mask: 'soften2',
      },

      DrawerFrame: {
        mask: 'soften',
      },

      Progress: {
        mask: 'soften',
      },

      TooltipArrow: {
        mask: 'soften',
      },

      SliderTrack: {
        mask: 'strengthen',
      },

      SliderThumb: {
        mask: 'inverseSoften',
      },

      Tooltip: {
        mask: 'inverse',
      },

      ProgressIndicator: {
        mask: 'inverse',
      },

      SwitchThumb: {
        mask: 'inverseSoften2',
      },

      SheetOverlay: overlayThemeDefinitions,
      DialogOverlay: overlayThemeDefinitions,
      ModalOverlay: overlayThemeDefinitions,

      Input: inputThemeDefinitions,
      TextArea: inputThemeDefinitions,
    },
    {
      // we dont actually do this right now but api to figure out
      avoidNestingWithin: ['alt1'],
    }
  )

// rome-ignore lint/nursery/noConsoleLog: <explanation>
console.log(1, themesBuilder)

// rome-ignore lint/nursery/noConsoleLog: <explanation>
console.log(2, themesBuilder.build())

export const themes = themesBuilder.build()

export default () => <div />
