import type {
  MaskOptions,
  ThemeDefinitions,
  ThemeWithParent,
} from '@tamagui/theme-builder'

import type { ThemeSuiteItemData } from '../types'
import { defaultBaseTheme } from './defaultBaseTheme'
import { defaultPalettes } from './defaultPalettes'
import { defaultTemplates } from './defaultTemplates'
import { maskOptions } from './masks'

export const defaultSelectedSchemes = {
  dark: true,
  light: true,
}

export const defaultThemeSuiteItem = {
  name: '',
  baseTheme: defaultBaseTheme,
  subThemes: [],
  componentThemes: getComponentThemes(),
  palettes: defaultPalettes,
  templates: defaultTemplates,
  schemes: defaultSelectedSchemes,
} satisfies ThemeSuiteItemData

function getComponentThemes() {
  const max = 13
  const min = 1

  const componentMask = {
    ...maskOptions.component,
    max,
    min,
    overrideSwap: {
      accentBackground: 0,
      accentColor: -0,
    },
    overrideShift: {
      ...maskOptions.component.override,
    },
    skip: {
      ...maskOptions.component.skip,
    },
  } satisfies MaskOptions

  const customMaskOptions = {
    alt: {
      ...maskOptions.alt,
      max,
      min,
      overrideSwap: {
        accentBackground: 0,
        accentColor: -0,
      },
      overrideShift: {
        ...maskOptions.alt.override,
      },
      skip: {
        ...maskOptions.alt.skip,
      },
    },
    component: componentMask,
  } satisfies Record<string, MaskOptions>

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
  ] satisfies ThemeWithParent[]

  const surfaceTheme = [
    {
      parent: 'light_accent',
      template: 'surface',
      palette: 'light_accent',
    },

    {
      parent: 'dark_accent',
      template: 'surface',
      palette: 'dark_accent',
    },

    {
      parent: 'light',
      mask: 'soften2',
      ...customMaskOptions.component,
    },

    {
      parent: 'dark',
      mask: 'soften2',
      ...customMaskOptions.component,
    },
  ] satisfies ThemeWithParent[]

  return {
    Card: {
      mask: 'soften',
      ...customMaskOptions.component,
    },

    Button: surfaceTheme,

    Checkbox: {
      mask: 'softenBorder2',
      ...customMaskOptions.component,
    },

    Switch: surfaceTheme,

    SwitchThumb: {
      mask: 'inverse',
      ...customMaskOptions.component,
    },

    TooltipContent: {
      mask: 'soften2',
      ...customMaskOptions.component,
    },

    DrawerFrame: {
      mask: 'soften',
      ...customMaskOptions.component,
    },

    Progress: {
      mask: 'soften',
      ...customMaskOptions.component,
    },

    RadioGroupItem: {
      mask: 'softenBorder2',
      ...customMaskOptions.component,
    },

    TooltipArrow: {
      mask: 'soften',
      ...customMaskOptions.component,
    },

    SliderTrackActive: {
      mask: 'inverseSoften',
      ...customMaskOptions.component,
    },

    SliderTrack: {
      mask: 'soften2',
      ...customMaskOptions.component,
    },

    SliderThumb: {
      mask: 'inverse',
      ...customMaskOptions.component,
    },

    Tooltip: {
      mask: 'inverse',
      ...customMaskOptions.component,
    },

    ProgressIndicator: {
      mask: 'inverse',
      ...customMaskOptions.component,
    },

    SheetOverlay: overlayThemeDefinitions,
    DialogOverlay: overlayThemeDefinitions,
    ModalOverlay: overlayThemeDefinitions,

    Input: {
      mask: 'softenBorder2',
      ...customMaskOptions.component,
    },

    TextArea: {
      mask: 'softenBorder2',
      ...customMaskOptions.component,
    },
  } satisfies ThemeDefinitions<any>
}
