import {
  MaskOptions,
  combineMasks,
  createIdentityMask,
  createInverseMask,
  createMask,
  createSoftenMask,
  createStrengthenMask,
  createThemeBuilder,
} from '@tamagui/theme-builder'

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

const palettes = {
  light: [
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
    'hsl(0, 0%, 9.0%)',
  ],
  dark: [
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
    '#fff',
  ],
}

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

  const template = {
    ...templateColors,
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
  }

  const overrideShadows = {
    shadowColor: 0,
    shadowColorHover: 0,
    shadowColorPress: 0,
    shadowColorFocus: 0,
  }

  const baseMaskOptions: MaskOptions = {
    override: overrideShadows,
    skip: overrideShadows,
  }

  const skipShadowsAndColors = {
    ...overrideShadows,
    ...templateColors,
  }

  const maskOptions = {
    component: {
      ...baseMaskOptions,
      skip: skipShadowsAndColors,
    },
    alt: {
      ...baseMaskOptions,
    },
    button: {
      ...baseMaskOptions,
      override: {
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

const masks = {
  identity: createIdentityMask(),
  soften: createSoftenMask(),
  soften2: createSoftenMask({ strength: 2 }),
  strengthen: createStrengthenMask(),
  inverse: createInverseMask(),
  inverseSoften: combineMasks(createInverseMask(), createSoftenMask()),
  inverseStrengthen2: combineMasks(
    createInverseMask(),
    createStrengthenMask({ strength: 2 })
  ),
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
}

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

const componentThemeDefinitions = {
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

  SwitchThumb: {
    mask: 'inverseStrengthen2',
    ...maskOptions.component,
    debug: true,
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
    mask: 'soften',
    ...maskOptions.component,
  },

  SliderThumb: {
    mask: 'inverse',
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
        // add some extra colors here
      },
    },
    dark: {
      template: 'base',
      palette: 'dark',
      nonInheritedValues: {
        // add some extra colors here
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
  .addChildThemes(componentThemeDefinitions, {
    avoidNestingWithin: ['alt1', 'alt2', 'active'],
  })

export const themes = themesBuilder.build()
