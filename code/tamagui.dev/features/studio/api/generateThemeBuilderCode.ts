import type { ThemeBuilder } from '@tamagui/theme-builder'
import type { BuildThemeSuiteProps } from '../theme/types'
import { createThemeSuite, getLastBuilder } from '@tamagui/theme-builder'

type GenerateThemeBuilderCodeProps = BuildThemeSuiteProps & {
  includeComponentThemes: boolean
  includeSizeTokens: boolean
}

export async function generateThemeBuilderCode({
  palettes,
  subThemes,
  baseTheme,
  componentThemes,
  schemes,
  templates,
  includeComponentThemes,
  includeSizeTokens,
}: GenerateThemeBuilderCodeProps) {
  console.log('WTF', palettes)

  // side effect to getLastBuilder
  // createThemeSuite({
  //   palettes,
  //   baseTheme,
  //   subThemes,
  //   schemes,
  // })

  // const themeBuilder = getLastBuilder()

  return `import { createThemeSuite } from '@tamagui/theme-builder'

const builtThemes = createThemeSuite({

})

export type Themes = typeof builtThemes

// this is optional but saves client-side JS bundle size by leaving out
// themes on client. tamagui automatically hydrates themes from css back
// into JS for you and the tamagui bundler plugins set TAMAGUI_IS_SERVER

export const themes: Themes =
  process.env.TAMAGUI_IS_SERVER ||
  process.env.NODE_ENV === 'development'
    ? (themes as any)
    : ({} as any)
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
