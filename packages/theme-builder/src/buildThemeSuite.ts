import { MaskOptions, ThemeDefinitions } from '@tamagui/create-theme'

import { buildMask } from './buildMask'
import { masks as defaultMasks, maskOptions } from './masks'
import { createThemeBuilder } from './ThemeBuilder'
import { BuildTheme, BuildThemeMask, BuildThemeSuiteProps, Templates } from './types'

export function buildThemeSuite(props: BuildThemeSuiteProps) {
  return getThemeSuiteBuilder(props).build()
}

export function getThemeSuiteBuilder({
  subThemes,
  templates = getDefaultTemplates(),
  palettes,
}: BuildThemeSuiteProps) {
  const maskThemes = (subThemes || []).filter(
    (x) => x.type === 'mask'
  ) as BuildThemeMask[]

  const nonMaskSubThemes = (subThemes || []).filter(
    (x) => x.type !== 'mask'
  ) as BuildTheme[]

  const customMasks = Object.fromEntries(
    maskThemes.map((maskTheme) => {
      return [maskTheme.name, buildMask(maskTheme.masks)]
    })
  )

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
  } satisfies Record<string, MaskOptions>

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
        template: 'active',
        palette: 'lightAccent',
      },

      {
        parent: 'dark_accent',
        template: 'active',
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
    } satisfies ThemeDefinitions<keyof typeof defaultMasks>

    return componentThemeDefinitions
  }

  return createThemeBuilder()
    .addPalettes(palettes)
    .addMasks({
      ...defaultMasks,
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
      Object.fromEntries([
        ...maskThemes.map((theme) => {
          return [
            theme.name,
            {
              mask: theme.name,
            },
          ]
        }),
        ...nonMaskSubThemes.flatMap((theme) => {
          return [
            [
              theme.name,
              [
                {
                  parent: 'dark',
                  template: 'base',
                  palette: `${theme.name}PaletteDark`,
                },
                {
                  parent: 'light',
                  template: 'base',
                  palette: `${theme.name}PaletteLight`,
                },
              ],
            ],
          ]
        }),
      ])
    )
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
    .addChildThemes(getComponentThemeDefinitions()) as any
}

export type BuildBaseThemesResult = ReturnType<typeof buildThemeSuite>

function getDefaultTemplates() {
  // its offset by some transparent values etc
  const basePaletteOffset = 5
  const namedTemplateSlots = {
    background: basePaletteOffset,
    subtleBackground: basePaletteOffset + 1,
    uiBackground: basePaletteOffset + 2,
    hoverUIBackround: basePaletteOffset + 3,
    activeUIBackround: basePaletteOffset + 4,
    subtleBorder: basePaletteOffset + 5,
    strongBorder: basePaletteOffset + 6,
    hoverBorder: basePaletteOffset + 7,
    strongBackground: basePaletteOffset + 8,
    hoverStrongBackground: basePaletteOffset + 9,
  }

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

  return {
    base: template,
    active: {
      ...template,
      background: namedTemplateSlots.strongBackground,
      backgroundHover: namedTemplateSlots.hoverStrongBackground,
      backgroundPress: namedTemplateSlots.hoverBorder,
      backgroundFocus: namedTemplateSlots.strongBackground,
    },
  } satisfies Templates
}
