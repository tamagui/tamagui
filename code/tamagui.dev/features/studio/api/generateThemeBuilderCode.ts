import type { ThemeBuilder } from '@tamagui/theme-builder'
import type { BuildThemeSuiteProps } from '@tamagui/themes'

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
