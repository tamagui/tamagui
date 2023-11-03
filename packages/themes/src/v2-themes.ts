import { createThemeBuilder } from '@tamagui/theme-builder'

import { overlayThemeDefinitions } from './componentThemeDefinitions'
import { masks } from './masks'
import { palettes } from './palettes'
import { shadows } from './shadows'
import { maskOptions, templates } from './templates'
import { darkColors, lightColors } from './tokens'

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

const themesBuilder = createThemeBuilder()
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
  .addChildThemes(
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

const themesIn = themesBuilder.build()

// stupid typescript too deep types fix :/
type ThemesIn = typeof themesIn
type ThemesOut = Omit<ThemesIn, 'light' | 'dark'> & {
  light: ThemesIn['light'] & typeof nonInherited.light
  dark: ThemesIn['dark'] & typeof nonInherited.dark
}

export const themes = themesIn as ThemesOut
