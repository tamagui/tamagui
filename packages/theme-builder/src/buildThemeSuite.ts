import {
  MaskOptions,
  ThemeDefinitions,
  createMask,
  createSoftenMask,
} from '@tamagui/create-theme'
import { masks as defaultMasks, maskOptions } from '@tamagui/themes'

import { buildMask } from './buildMask'
import { getThemeSuitePalettes } from './buildThemeSuitePalettes'
import { createThemeBuilder } from './ThemeBuilder'
import { BuildThemeMask, BuildThemeSuiteProps } from './types'

export function buildThemeSuite({ baseTheme, subThemes }: BuildThemeSuiteProps) {
  const theme = baseTheme

  const maskThemes = (subThemes || []).filter(
    (x) => x.type === 'mask'
  ) as BuildThemeMask[]

  const customMasks = Object.fromEntries(
    maskThemes.map((maskTheme) => {
      return [maskTheme.name, buildMask(maskTheme.masks)]
    })
  )

  // base palletes need to add in sub theme palettes if customized
  const palettes = getThemeSuitePalettes(theme as any)

  const max = palettes.dark.length - 1
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
    componentInverse: {
      ...componentMask,
    },
  } satisfies Record<string, MaskOptions>

  const baseTemplate = {
    accentBackground: 0,
    accentColor: -0,

    background0: 1,
    background025: 2,
    background05: 3,
    background075: 4,

    color0: -4,
    color025: -3,
    color05: -2,
    color075: -1,

    background: 5,
    backgroundHover: 6,
    backgroundPress: 7,
    backgroundFocus: 8,

    color: -5,
    colorHover: -6,
    colorPress: -5,
    colorFocus: -6,

    placeholderColor: -6,

    borderColor: 7,
    borderColorHover: 8,
    borderColorFocus: 9,
    borderColorPress: 8,
  }

  function createTemplates() {
    const template = {
      color1: 5,
      color2: 6,
      color3: 7,
      color4: 8,
      color5: 9,
      color6: 10,
      color7: 11,
      color8: 12,
      color9: 13,
      color10: 14,
      color11: 15,
      color12: 16,
      ...baseTemplate,
    }

    // const accentTemplateLight = {
    //   background: 0,
    //   backgroundHover: 1,
    //   backgroundPress: baseTemplate.backgroundPress + 4,
    //   backgroundFocus: baseTemplate.backgroundFocus + 4,
    //   borderColor: baseTemplate.borderColor + 2,
    //   borderColorHover: baseTemplate.borderColorHover + 2,
    //   borderColorFocus: baseTemplate.borderColorFocus + 2,
    //   borderColorPress: baseTemplate.borderColorPress + 2,
    //   color: -5,
    //   colorHover: -6,
    //   colorPress: -7,
    //   colorFocus: -5,
    // }

    // const accentTemplateDark = {
    //   background: baseTemplate.background + 4,
    //   backgroundHover: baseTemplate.backgroundHover + 5,
    //   backgroundPress: baseTemplate.backgroundPress + 3,
    //   backgroundFocus: baseTemplate.backgroundFocus + 5,
    //   borderColor: baseTemplate.borderColor + 2,
    //   borderColorHover: baseTemplate.borderColorHover + 2,
    //   borderColorFocus: baseTemplate.borderColorFocus + 2,
    //   borderColorPress: baseTemplate.borderColorPress + 2,
    //   color: -5,
    //   colorHover: -6,
    //   colorPress: -7,
    //   colorFocus: -5,
    // }

    return {
      base: template,
      accentLight: template,
      accentDark: template,
    }
  }

  const templates = createTemplates()

  function getComponentThemeDefinitions() {
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

    const componentTheme = [
      {
        parent: 'light_accent',
        template: 'accentLight',
        palette: 'lightAccent',
      },

      {
        parent: 'dark_accent',
        template: 'accentDark',
        palette: 'darkAccent',
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
    ]

    const componentThemeDefinitions = {
      Card: {
        mask: 'soften',
        ...customMaskOptions.component,
      },

      Button: componentTheme,

      Checkbox: {
        mask: 'softenBorder2',
        ...customMaskOptions.component,
      },

      Switch: componentTheme,

      SwitchThumb: {
        mask: 'inverse',
        ...customMaskOptions.componentInverse,
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
        ...customMaskOptions.componentInverse,
      },

      Tooltip: {
        mask: 'inverse',
        ...customMaskOptions.component,
      },

      ProgressIndicator: {
        mask: 'inverse',
        ...customMaskOptions.componentInverse,
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
    } satisfies ThemeDefinitions<keyof typeof defaultMasks>

    return componentThemeDefinitions
  }

  const builder = createThemeBuilder()
    .addPalettes(palettes)
    .addMasks({
      ...defaultMasks,
      soften3Border2: createMask((template, options) => {
        const softer2 = createSoftenMask({ strength: 3 }).mask(template, options)
        const softer1 = createSoftenMask({ strength: 2 }).mask(template, options)
        return {
          ...softer2,
          borderColor: softer1.borderColor,
          borderColorHover: softer1.borderColorHover,
          borderColorPress: softer1.borderColorPress,
          borderColorFocus: softer1.borderColorFocus,
        }
      }),
      ...customMasks,
    })
    .addTemplates(templates)
    .addThemes({
      light: {
        template: 'base',
        palette: 'light',
      },
      dark: {
        template: 'base',
        palette: 'dark',
      },
    })
    .addChildThemes(
      Object.fromEntries(
        maskThemes.map((theme) => {
          return [
            theme.name,
            {
              mask: theme.name,
            },
          ]
        })
      )
    )
    .addChildThemes({
      // disabling as we don't need to preview these
      alt1: {
        mask: 'soften2Border1',
        ...maskOptions.alt,
      },
      alt2: {
        mask: 'soften3Border2',
        ...maskOptions.alt,
      },
    })
    .addChildThemes(
      palettes.lightAccent
        ? {
            accent: [
              {
                parent: 'light',
                template: 'base',
                palette: 'lightAccent',
              },
              {
                parent: 'dark',
                template: 'base',
                palette: 'darkAccent',
              },
            ],
          }
        : {}
    )
    .addChildThemes(getComponentThemeDefinitions())

  const built = builder.build()

  console.log('built themes', built)

  return {
    built,
    palettes,
  }
}

export type BuildBaseThemesResult = ReturnType<typeof buildThemeSuite>
