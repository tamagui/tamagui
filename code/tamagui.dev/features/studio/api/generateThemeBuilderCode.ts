import type { ThemeBuilder, ThemeDefinitions } from '@tamagui/theme-builder'
// import * as prettier from 'prettier'
// import tsParser from 'prettier/parser-typescript'

import type { BuildThemeSuiteProps } from '../theme/types'
import { buildThemeSuite } from './buildThemeSuite'

type GenerateThemeBuilderCodeProps = BuildThemeSuiteProps & {
  includeComponentThemes: boolean
  includeSizeTokens: boolean
}

export async function generateThemeBuilderCode({
  palettes,
  subThemes,
  baseTheme,
  componentThemes,
  selectedSchemes,
  templates,
  includeComponentThemes,
  includeSizeTokens,
}: GenerateThemeBuilderCodeProps) {
  const { themeBuilder } = buildThemeSuite({
    templates,
    baseTheme,
    componentThemes,
    selectedSchemes,
    palettes,
    subThemes,
  })
  return `
  import { defaultSubThemes, defaultComponentThemes } from '@tamagui/themes/v3-themes'
  import { createThemeBuilder } from '@tamagui/theme-builder'

  const palettes = ${stringifyPalettes(themeBuilder)}
  const templates = ${stringifyTemplates(themeBuilder)}

  export const themes = createThemeBuilder()
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
    ${
      includeComponentThemes
        ? `.addChildThemes(defaultComponentThemes, {
      avoidNestingWithin: [
        'alt1',
        'alt2',
        'surface1',
        'surface2',
        'surface3',
        'surface4',
        'active',
      ],
    })\n`
        : ``
    }
    .build()
`
}

function stringifyPalettes(themeBuilder: ThemeBuilder<any>) {
  if (!themeBuilder.state.palettes) return `{}`
  return `{
    ${Object.entries(themeBuilder.state.palettes).map(([key, val]) => {
      return `
        "${key}": [${(val as any[]).map((color) => `'${color}'`)}]
      `
    })}
  }`
}

function stringifyTemplates(themeBuilder: ThemeBuilder<any>) {
  if (!themeBuilder.state.templates) return `{}`
  return `{
    ${Object.entries(themeBuilder.state.templates).map(([key, val]) => {
      return `
        "${key}": ${JSON.stringify(val)}
      `
    })}
  }`
}

// for accepting dynamic child themes

// const addChildThemes = themeBuilder._addedThemes
//   .map((addedSection) => {
//     const callFunction =
//       addedSection.type === 'childThemes' ? 'addChildThemes' : 'addThemes'

//     const [themes, options] = addedSection.args as [ThemeDefinitions, any]

//     let themesArg = `{`

//     // first loop find common mask options:
//     for (const [themeName, themeDefinitions] of Object.entries(themes)) {
//       let children: string[] = []

//       for (const themeDefinition of Array.isArray(themeDefinitions)
//         ? themeDefinitions
//         : [themeDefinitions]) {
//         const { parent, mask, template, palette, ...maskOptions } =
//           themeDefinition as any

//         let maskOptionsSpread = ``

//         if (Object.keys(maskOptions).length) {
//           const maskVariableName = (() => {
//             const maskOptionsKey = JSON.stringify(maskOptions)
//             if (!maskKeyToName[maskOptionsKey]) {
//               maskKeyToName[maskOptionsKey] = `maskOptions${maskVersion++}`
//             }
//             return maskKeyToName[maskOptionsKey]!
//           })()
//           maskOptionsSpread += `...maskOptions.${maskVariableName}`
//         }

//         children.push(
//           `{ ${stringifyArgs({
//             parent,
//             mask,
//             template,
//             palette,
//           })} ${maskOptionsSpread} },`
//         )
//       }

//       themesArg += `  "${themeName}": `
//       if (children.length === 1) {
//         themesArg += children[0]
//       } else {
//         themesArg += `[ ${children.join('\n')} ],`
//       }
//       themesArg += '\n'
//     }

//     themesArg += `}`

//     return `.${callFunction}(
//       ${themesArg}
//       ${options ? `, ${JSON.stringify(options)}` : ''}
//     )`
//   })
//   .join('\n')
