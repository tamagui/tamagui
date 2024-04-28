import type {
  CreateMask} from '@tamagui/create-theme';
import {
  combineMasks,
  createInverseMask,
  createMask,
  createSoftenMask,
  createStrengthenMask,
  skipMask,
} from '@tamagui/create-theme'
import type { ThemeBuilder} from '@tamagui/theme-builder';
import { createThemeBuilder } from '@tamagui/theme-builder'

import { defaultTemplates } from '../theme-builder/constants/defaultTemplates'
import { masks } from '../theme-builder/constants/masks'
import { getFinalPalettes } from '../theme-builder/helpers/getFinalPalettes'
import type {
  BuildMask,
  BuildTheme,
  BuildThemeMask,
  BuildThemeSuiteProps,
} from '../theme-builder/types'

export function buildThemeSuite(props: BuildThemeSuiteProps) {
  const builder = getThemeSuiteBuilder(props)
  return builder.build()
}

export function getThemeSuiteBuilder({
  subThemes,
  templates = defaultTemplates,
  palettes,
  componentThemes,
}: BuildThemeSuiteProps) {
  const subThemeMaskThemes = (subThemes || []).filter(
    (x) => x.type === 'mask'
  ) as BuildThemeMask[]

  // const componentThemeMaskThemes = (componentThemes || []).filter(
  //   (x) => x.type === 'mask'
  // ) as BuildThemeMask[]

  const nonMaskSubThemes = (subThemes || []).filter(
    (x) => x.type !== 'mask'
  ) as BuildTheme[]

  const createdMasks = Object.fromEntries(
    [
      // ...componentThemeMaskThemes
      ...subThemeMaskThemes,
    ].map((maskTheme) => {
      return [maskTheme.name, buildMask(maskTheme.masks)]
    })
  )

  const palettesFinal = getFinalPalettes(palettes)

  return createThemeBuilder()
    .addPalettes(palettesFinal)
    .addMasks({
      ...masks,
      ...createdMasks,
    })
    .addTemplates(templates)
    .addThemes({
      light: {
        template: 'base',
        palette: 'light_base',
      },
      dark: {
        template: 'base',
        palette: 'dark_base',
      },
    })
    .addChildThemes(
      Object.fromEntries([
        ...subThemeMaskThemes.map((theme) => {
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
                  template: theme.template,
                  palette: theme.palette,
                },
                {
                  parent: 'light',
                  template: theme.template,
                  palette: theme.palette,
                },
              ],
            ],
          ]
        }),
      ])
    )
    .addChildThemes(
      palettesFinal.light_accent
        ? {
            accent: [
              {
                parent: 'light',
                template: 'base',
                palette: 'light_accent',
              },
              {
                parent: 'dark',
                template: 'base',
                palette: 'dark_accent',
              },
            ],
          }
        : {}
    )
    .addChildThemes(componentThemes) as ThemeBuilder<any>
}

export type BuildBaseThemesResult = ReturnType<typeof buildThemeSuite>

// helper function for generating a custom mask given an object
// pulled out from studio, not really a "user facing" API yet

function buildMask(masks: BuildMask[]) {
  return combineMasks(
    ...masks.map((mask) => {
      if (mask.type === 'override') {
        return skipMask
      }
      if (mask.type === 'inverse') {
        return createInverseMask()
      }
      if (mask.type === 'soften') {
        return createSoftenMask({ strength: mask.strength || 0 })
      }
      if (mask.type === 'strengthen') {
        return createStrengthenMask({ strength: mask.strength || 0 })
      }
      if (mask.type === 'softenBorder') {
        return createMask((template, options) => {
          const plain = skipMask.mask(template, options)
          const softer = createSoftenMask({ strength: mask.strength }).mask(
            template,
            options
          )
          return {
            ...plain,
            borderColor: softer.borderColor,
            borderColorHover: softer.borderColorHover,
            borderColorPress: softer.borderColorPress,
            borderColorFocus: softer.borderColorFocus,
          }
        })
      }
      if (mask.type === 'strengthenBorder') {
        return createMask((template, options) => {
          const plain = skipMask.mask(template, options)
          const softer = createSoftenMask({ strength: mask.strength }).mask(
            template,
            options
          )
          return {
            ...plain,
            borderColor: softer.borderColor,
            borderColorHover: softer.borderColorHover,
            borderColorPress: softer.borderColorPress,
            borderColorFocus: softer.borderColorFocus,
          }
        })
      }
      return {} as CreateMask
    })
  )
}
