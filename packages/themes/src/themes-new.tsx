import {
  MaskOptions,
  combineMasks,
  createIdentityMask,
  createInverseMask,
  createMask,
  createSoftenMask,
  createStrengthenMask,
  createThemeBuilder,
  skipMask,
} from '@tamagui/create-theme'

import { objectFromEntries, objectKeys } from './helpers'
import { colorTokens, darkColors, lightColors } from './tokens'

const palettes = (() => {
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

const { templates, maskOptions } = (() => {
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

  // templates use the palette and specify index
  // negative goes backwards from end so -1 is the last item
  const template = {
    ...templateColors,
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
  }

  const templates = {
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

  const overrideShadows = {
    shadowColor: 0,
    shadowColorHover: 0,
    shadowColorPress: 0,
    shadowColorFocus: 0,
  }

  const overrideWithColors = {
    ...overrideShadows,
    color: 0,
    colorHover: 0,
    colorFocus: 0,
    colorPress: 0,
  }

  const baseMaskOptions: MaskOptions = {
    override: overrideShadows,
    skip: overrideShadows,
    // avoids the transparent ends
    max: palettes.light.length - 2,
    min: 1,
  }

  const skipShadowsAndColors = {
    ...overrideShadows,
    ...templateColors,
  }

  const maskOptions = {
    component: {
      ...baseMaskOptions,
      override: overrideWithColors,
      skip: skipShadowsAndColors,
    },
    alt: {
      ...baseMaskOptions,
    },
    button: {
      ...baseMaskOptions,
      override: {
        ...overrideWithColors,
        borderColor: 'transparent',
        borderColorHover: 'transparent',
      },
      skip: skipShadowsAndColors,
    },
  } satisfies Record<string, MaskOptions>

  return {
    templates,
    maskOptions,
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

const masks = {
  identity: createIdentityMask(),
  soften: createSoftenMask(),
  soften2: createSoftenMask({ strength: 2 }),
  soften3: createSoftenMask({ strength: 3 }),
  strengthen: createStrengthenMask(),
  inverse: createInverseMask(),
  inverseSoften: combineMasks(createInverseMask(), createSoftenMask()),
  inverseSoften2: combineMasks(createInverseMask(), createSoftenMask({ strength: 2 })),
  strengthenButSoftenBorder: createMask((template, options) => {
    const stronger = createStrengthenMask().mask(template, options)
    const softer = createSoftenMask().mask(template, options)
    return {
      ...stronger,
      borderColor: softer.borderColor,
      borderColorHover: softer.borderColorHover,
      borderColorPress: softer.borderColorPress,
      borderColorFocus: softer.borderColorFocus,
    }
  }),
  softenBorder: createMask((template, options) => {
    const plain = skipMask.mask(template, options)
    const softer = createSoftenMask().mask(template, options)
    return {
      ...plain,
      borderColor: softer.borderColor,
      borderColorHover: softer.borderColorHover,
      borderColorPress: softer.borderColorPress,
      borderColorFocus: softer.borderColorFocus,
    }
  }),
}

const themesBuilder = createThemeBuilder()
  .addPalettes(palettes)
  .addTemplates(templates)
  .addMasks(masks)
  .addThemes({
    light: {
      template: 'base',
      palette: 'light',
      nonInheritedValues: {
        ...lightColors,
        ...lightShadows,
      },
    },
    dark: {
      template: 'base',
      palette: 'dark',
      nonInheritedValues: {
        ...darkColors,
        ...darkShadows,
      },
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
  })
  .addChildThemes({
    alt1: {
      mask: 'soften',
      ...maskOptions.alt,
    },
    alt2: {
      mask: 'soften2',
      ...maskOptions.alt,
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
          ...maskOptions.component,
        },
        {
          parent: 'dark',
          mask: 'identity',
          ...maskOptions.component,
        },
      ],

      Card: {
        mask: 'soften',
        ...maskOptions.component,
      },

      Button: {
        mask: 'soften2',
        ...maskOptions.button,
      },

      Checkbox: {
        mask: 'soften2',
        ...maskOptions.component,
      },

      SliderTrackActive: {
        mask: 'soften2',
        ...maskOptions.component,
      },

      Switch: {
        mask: 'soften2',
        ...maskOptions.component,
      },

      TooltipContent: {
        mask: 'soften2',
        ...maskOptions.component,
      },

      DrawerFrame: {
        mask: 'soften',
        ...maskOptions.component,
      },

      Progress: {
        mask: 'soften',
        ...maskOptions.component,
      },

      TooltipArrow: {
        mask: 'soften',
        ...maskOptions.component,
      },

      SliderTrack: {
        mask: 'strengthen',
        ...maskOptions.component,
      },

      SliderThumb: {
        mask: 'inverseSoften',
        ...maskOptions.component,
      },

      Tooltip: {
        mask: 'inverse',
        ...maskOptions.component,
      },

      ProgressIndicator: {
        mask: 'inverse',
        ...maskOptions.component,
      },

      SwitchThumb: {
        mask: 'inverseSoften2',
        ...maskOptions.component,
      },

      SheetOverlay: overlayThemeDefinitions,
      DialogOverlay: overlayThemeDefinitions,
      ModalOverlay: overlayThemeDefinitions,

      Input: [
        {
          parent: 'light',
          mask: 'strengthenButSoftenBorder',
          ...maskOptions.component,
        },
        {
          parent: 'dark',
          mask: 'softenBorder',
          ...maskOptions.component,
        },
      ],

      TextArea: [
        {
          parent: 'light',
          mask: 'strengthenButSoftenBorder',
          ...maskOptions.component,
        },
        {
          parent: 'dark',
          mask: 'softenBorder',
          ...maskOptions.component,
        },
      ],
    },
    {
      // TODO types should then avoid generating these types!
      avoidNestingWithin: ['alt1', 'alt2', 'active'],
    }
  )

export const themes = themesBuilder.build()
