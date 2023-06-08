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
import { themes as themesOld } from './themes-old'
import { colorTokens } from './tokens'

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

const {
  templates,
  maskOptions,
  maskOptionsAlt,
  maskOptionsComponent,
  maskOptionsButton,
} = (() => {
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

  const templates = {
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

  const override = Object.fromEntries(Object.entries(toSkip).map(([k]) => [k, 0]))
  const overrideShadows = Object.fromEntries(
    Object.entries(templateShadows).map(([k]) => [k, 0])
  )
  const overrideWithColors = {
    ...override,
    color: 0,
    colorHover: 0,
    colorFocus: 0,
    colorPress: 0,
  }

  // default mask options for most uses
  const maskOptions: MaskOptions = {
    override,
    skip: toSkip,
    // avoids the transparent ends
    max: palettes.light.length - 2,
    min: 1,
  }

  // default mask options for most uses
  const maskOptionsComponent: MaskOptions = {
    ...maskOptions,
    override: overrideWithColors,
  }

  // default mask options for most uses
  const maskOptionsAlt: MaskOptions = {
    ...maskOptions,
    override: overrideShadows,
  }

  const maskOptionsButton: MaskOptions = {
    ...maskOptions,
    override: {
      ...overrideWithColors,
      borderColor: 'transparent',
      borderColorHover: 'transparent',
    },
  }

  return {
    templates,
    maskOptions,
    maskOptionsComponent,
    maskOptionsAlt,
    maskOptionsButton,
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
      ...maskOptionsAlt,
    },
    alt2: {
      mask: 'soften2',
      ...maskOptionsAlt,
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
          ...maskOptionsComponent,
        },
        {
          parent: 'dark',
          mask: 'identity',
          ...maskOptionsComponent,
        },
      ],

      Card: {
        mask: 'soften',
        ...maskOptionsComponent,
      },

      Button: {
        mask: 'soften2',
        ...maskOptionsButton,
      },

      Checkbox: {
        mask: 'soften2',
        ...maskOptionsComponent,
      },

      SliderTrackActive: {
        mask: 'soften2',
        ...maskOptionsComponent,
      },

      Switch: {
        mask: 'soften2',
        ...maskOptionsComponent,
      },

      TooltipContent: {
        mask: 'soften2',
        ...maskOptionsComponent,
      },

      DrawerFrame: {
        mask: 'soften',
        ...maskOptionsComponent,
      },

      Progress: {
        mask: 'soften',
        ...maskOptionsComponent,
      },

      TooltipArrow: {
        mask: 'soften',
        ...maskOptionsComponent,
      },

      SliderTrack: {
        mask: 'strengthen',
        ...maskOptionsComponent,
      },

      SliderThumb: {
        mask: 'inverseSoften',
        ...maskOptionsComponent,
      },

      Tooltip: {
        mask: 'inverse',
        ...maskOptionsComponent,
      },

      ProgressIndicator: {
        mask: 'inverse',
        ...maskOptionsComponent,
      },

      SwitchThumb: {
        mask: 'inverseSoften2',
        ...maskOptionsComponent,
      },

      SheetOverlay: overlayThemeDefinitions,
      DialogOverlay: overlayThemeDefinitions,
      ModalOverlay: overlayThemeDefinitions,

      Input: [
        {
          parent: 'light',
          mask: 'strengthenButSoftenBorder',
          ...maskOptionsComponent,
        },
        {
          parent: 'dark',
          mask: 'softenBorder',
          ...maskOptionsComponent,
        },
      ],

      TextArea: [
        {
          parent: 'light',
          mask: 'strengthenButSoftenBorder',
          ...maskOptionsComponent,
        },
        {
          parent: 'dark',
          mask: 'softenBorder',
          ...maskOptionsComponent,
        },
      ],
    },
    {
      avoidNestingWithin: ['alt1', 'alt2', 'active'],
    }
  )

export const themes = themesBuilder.build()

console.log('wtf is', themes.dark_Button, 'vs', themesOld.dark_Button)
