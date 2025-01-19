import { createPalettes, type ThemeBuilder } from '@tamagui/theme-builder'
import type { BuildThemeSuiteProps } from '@tamagui/themes'

type GenerateThemeBuilderCodeProps = BuildThemeSuiteProps & {
  includeComponentThemes: boolean
  includeSizeTokens: boolean
}

export async function generateThemeBuilderCode({
  palettes,
  schemes,
  includeComponentThemes,
  includeSizeTokens,
}: GenerateThemeBuilderCodeProps) {
  // side effect to getLastBuilder
  const palettesOut = createPalettes(palettes)

  return `import { createThemeSuite } from '@tamagui/theme-builder'
import * as Colors from '@tamagui/colors'

const lightShadows = {
  shadow1: 'rgba(0,0,0,0.04)',
  shadow2: 'rgba(0,0,0,0.08)',
  shadow3: 'rgba(0,0,0,0.16)',
  shadow4: 'rgba(0,0,0,0.24)',
  shadow5: 'rgba(0,0,0,0.32)',
  shadow6: 'rgba(0,0,0,0.4)',
}

const darkShadows = {
  shadow1: 'rgba(0,0,0,0.2)',
  shadow2: 'rgba(0,0,0,0.3)',
  shadow3: 'rgba(0,0,0,0.4)',
  shadow4: 'rgba(0,0,0,0.5)',
  shadow5: 'rgba(0,0,0,0.6)',
  shadow6: 'rgba(0,0,0,0.7)',
}

// we're adding some example sub-themes for you to show how they are done, "success" "warning", "error":

const builtThemes = createThemeSuite({
  ${includeComponentThemes === false ? `componentThemes: false,` : ``}

  base: {
    palettes: {
      dark: ${objectToJS(palettesOut.dark)},
      light: ${objectToJS(palettesOut.light)},
    },

    extra: {
      light: {
        ...Colors.green,
        ...Colors.red,
        ...Colors.yellow,
        ...lightShadows,
        shadowColor: lightShadows.shadow1,
        accent1: darkPalette[0],
        accent2: darkPalette[1],
        accent3: darkPalette[2],
        accent4: darkPalette[3],
        accent5: darkPalette[4],
        accent6: darkPalette[5],
        accent7: darkPalette[6],
        accent8: darkPalette[7],
        accent9: darkPalette[8],
        accent10: darkPalette[9],
        accent11: darkPalette[10],
        accent12: darkPalette[11],
      },
      dark: {
        ...Colors.greenDark,
        ...Colors.redDark,
        ...Colors.yellowDark,
        ...darkShadows,
        shadowColor: darkShadows.shadow1,
        accent1: lightPalette[0],
        accent2: lightPalette[1],
        accent3: lightPalette[2],
        accent4: lightPalette[3],
        accent5: lightPalette[4],
        accent6: lightPalette[5],
        accent7: lightPalette[6],
        accent8: lightPalette[7],
        accent9: lightPalette[8],
        accent10: lightPalette[9],
        accent11: lightPalette[10],
        accent12: lightPalette[11],
      },
    },
  },

  accent: {
    palettes: {
      dark: ${objectToJS(palettesOut.dark_accent)},
      light: ${objectToJS(palettesOut.light_accent)},
    },
  },

  childrenThemes: {
    warning: {
      palette: {
        dark: Object.values(Colors.yellowDark),
        light: Object.values(Colors.yellow),
      },
    },

    error: {
      palette: {
        dark: Object.values(Colors.redDark),
        light: Object.values(Colors.red),
      },
    },

    success: {
      palette: {
        dark: Object.values(Colors.greenDark),
        light: Object.values(Colors.green),
      },
    },
  },
})

export type Themes = typeof builtThemes

// this is optional, but saves client-side JS bundle size by leaving out themes on client.
// tamagui automatically hydrates themes from css back into JS for you and the tamagui
// bundler plugins automate setting TAMAGUI_IS_SERVER.

export const themes: Themes =
  process.env.TAMAGUI_IS_SERVER ||
  process.env.NODE_ENV === 'development'
    ? (builtThemes as any)
    : ({} as any)
`
}

function objectToJS(palettes: Record<string, any>) {
  return `{
    ${Object.entries(palettes).map(([key, val]) => {
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
