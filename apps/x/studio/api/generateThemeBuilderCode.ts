import type { ThemeBuilder, ThemeDefinitions } from '@tamagui/theme-builder'
import * as prettier from 'prettier'
import tsParser from 'prettier/parser-typescript'

import type { BuildThemeSuiteProps } from '../theme-builder/types'
import { getThemeSuiteBuilder } from './buildThemeSuite'

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
  const themeBuilder = getThemeSuiteBuilder({
    templates,
    baseTheme,
    componentThemes,
    selectedSchemes,
    palettes,
    subThemes,
  })
  const code = stringify(themeBuilder)

  const prettyCode = await prettier.format(code, {
    semi: false,
    parser: 'typescript',
    plugins: [tsParser],
  })

  return prettyCode
}

function stringify(themeBuilder: ThemeBuilder) {
  let maskVersion = 0

  // maps key of stringified options to the mask name
  const maskKeyToName: Record<string, string> = {}

  const addChildThemes = themeBuilder._addedThemes
    .map((addedSection) => {
      const callFunction =
        addedSection.type === 'childThemes' ? 'addChildThemes' : 'addThemes'

      const [themes, options] = addedSection.args as [ThemeDefinitions, any]

      let themesArg = `{`

      // first loop find common mask options:
      for (const [themeName, themeDefinitions] of Object.entries(themes)) {
        let children: string[] = []

        for (const themeDefinition of Array.isArray(themeDefinitions)
          ? themeDefinitions
          : [themeDefinitions]) {
          const { parent, mask, template, palette, ...maskOptions } =
            themeDefinition as any

          let maskOptionsSpread = ``

          if (Object.keys(maskOptions).length) {
            const maskVariableName = (() => {
              const maskOptionsKey = JSON.stringify(maskOptions)
              if (!maskKeyToName[maskOptionsKey]) {
                maskKeyToName[maskOptionsKey] = `maskOptions${maskVersion++}`
              }
              return maskKeyToName[maskOptionsKey]!
            })()
            maskOptionsSpread += `...maskOptions.${maskVariableName}`
          }

          children.push(
            `{ ${stringifyArgs({
              parent,
              mask,
              template,
              palette,
            })} ${maskOptionsSpread} },`
          )
        }

        themesArg += `  "${themeName}": `
        if (children.length === 1) {
          themesArg += children[0]
        } else {
          themesArg += `[ ${children.join('\n')} ],`
        }
        themesArg += '\n'
      }

      themesArg += `}`

      return `.${callFunction}(
        ${themesArg}
        ${options ? `, ${JSON.stringify(options)}` : ''}
      )`
    })
    .join('\n')

  const maskOptions = `
  // for now adding this type here to avoid TS issues inferring, will fix better soon
  let maskOptions: Record<string, any> = {
    ${Object.entries(maskKeyToName)
      .map(([stringified, name]) => {
        return `${name}: ${stringified},`
      })
      .join('\n')}
  }`

  return `
  import { masks } from '@tamagui/themes'
  import { createThemeBuilder } from '@tamagui/theme-builder'

  ${maskOptions}

  const palettes = ${stringifyPalettes(themeBuilder)}

  const templates = ${stringifyTemplates(themeBuilder)}

  export const themes = createThemeBuilder()
    .addPalettes(palettes)
    .addTemplates(templates)
    .addMasks(masks)
    ${addChildThemes}
    .build()
  `
}

function stringifyArgs(args: Record<string, any>) {
  let res = ``
  for (const key in args) {
    if (args[key] != null) {
      res += `"${key}": ${JSON.stringify(args[key])},`
    }
  }
  return res
}

function stringifyPalettes(themeBuilder: ThemeBuilder) {
  if (!themeBuilder.state.palettes) return `{}`
  return `{
    ${Object.entries(themeBuilder.state.palettes).map(([key, val]) => {
      return `
        "${key}": [${val.map((color) => `'${color}'`)}]
      `
    })}
  }`
}

function stringifyTemplates(themeBuilder: ThemeBuilder) {
  if (!themeBuilder.state.templates) return `{}`
  return `{
    ${Object.entries(themeBuilder.state.templates).map(([key, val]) => {
      return `
        "${key}": ${JSON.stringify(val)}
      `
    })}
  }`
}
