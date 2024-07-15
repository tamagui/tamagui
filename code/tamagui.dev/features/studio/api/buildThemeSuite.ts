import { createThemeBuilder } from '@tamagui/theme-builder'
import { defaultPalettes, defaultSubThemes } from '@tamagui/themes/v3-themes'

import { getFinalPalettes } from '../theme/helpers/getFinalPalettes'
import type { BuildThemeSuiteProps } from '../theme/types'

export function buildThemeSuite(props: BuildThemeSuiteProps) {
  const { templates, componentThemes } = props
  const palettes = getFinalPalettes(props.palettes)

  if (palettes.light.length !== defaultPalettes.light.length) {
    console.error({ palettes, defaultPalettes })
    throw new Error(`Error - generated palette doesn't match length`)
  }

  // start theme-builder

  const themeBuilder = createThemeBuilder()
    .addPalettes(palettes)
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
      palettes.light_accent
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
    .addChildThemes(defaultSubThemes)
    .addChildThemes(componentThemes, {
      avoidNestingWithin: [
        'alt1',
        'alt2',
        'surface1',
        'surface2',
        'surface3',
        'surface4',
        'active',
      ],
    })

  const themes = themeBuilder.build()

  // end theme-builder

  console.info(`buildThemeSuite`, themes, {
    palettes,
    templates,
    defaultSubThemes,
    componentThemes,
  })

  return {
    themes,
    themeBuilder,
  }
}

// for user-customized we had:
// Object.fromEntries([
//   ...subThemes.flatMap((theme) => {
//     return [
//       [
//         theme.name,
//         [
//           {
//             parent: 'dark',
//             template: theme.template,
//             palette: theme.palette,
//           },
//           {
//             parent: 'light',
//             template: theme.template,
//             palette: theme.palette,
//           },
//         ],
//       ],
//     ]
//   }),
// ])

export type BuildBaseThemesResult = ReturnType<typeof buildThemeSuite>
