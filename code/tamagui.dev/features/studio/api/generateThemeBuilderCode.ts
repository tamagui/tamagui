import { createPalettes, PALETTE_BACKGROUND_OFFSET } from '@tamagui/theme-builder'
import type { BuildThemeSuiteProps } from '@tamagui/themes'

type GenerateThemeBuilderCodeProps = BuildThemeSuiteProps & {
  includeComponentThemes: boolean
  includeSizeTokens: boolean
}

export async function generateThemeBuilderCode({
  palettes,
  includeComponentThemes,
}: GenerateThemeBuilderCodeProps) {
  // side effect to getLastBuilder
  const palettesOut = createPalettes(palettes)

  function paletteToCreateThemes(pIn: string[]) {
    return pIn.slice(PALETTE_BACKGROUND_OFFSET, -PALETTE_BACKGROUND_OFFSET)
  }

  // Convert accent palette array to named color object
  function paletteToNamedColors(name: string, palette: string[]) {
    return palette.reduce(
      (acc, color, i) => {
        acc[`${name}${i + 1}`] = color
        return acc
      },
      {} as Record<string, string>
    )
  }

  const darkPalette = paletteToCreateThemes(palettesOut.dark)
  const lightPalette = paletteToCreateThemes(palettesOut.light)
  const darkAccent = paletteToCreateThemes(palettesOut.dark_accent)
  const lightAccent = paletteToCreateThemes(palettesOut.light_accent)

  const componentThemesProp = includeComponentThemes
    ? `\n  componentThemes: v5ComponentThemes,`
    : `\n  componentThemes: false,`

  return `import { createV5Theme, defaultChildrenThemes } from '@tamagui/config/v5'${includeComponentThemes ? `\nimport { v5ComponentThemes } from '@tamagui/themes/v5'` : ``}
import { yellow, yellowDark, red, redDark, green, greenDark } from '@tamagui/colors'

const darkPalette = ${arrayToJS(darkPalette)}
const lightPalette = ${arrayToJS(lightPalette)}

// Your custom accent color theme
const accentLight = ${JSON.stringify(paletteToNamedColors('accent', lightAccent), null, 2)}

const accentDark = ${JSON.stringify(paletteToNamedColors('accent', darkAccent), null, 2)}

const builtThemes = createV5Theme({
  darkPalette,
  lightPalette,${componentThemesProp}
  accent: {
    light: accentLight,
    dark: accentDark,
  },
  childrenThemes: {
    // Include default color themes (blue, red, green, yellow, etc.)
    ...defaultChildrenThemes,

    // Semantic color themes for warnings, errors, and success states
    warning: {
      light: yellow,
      dark: yellowDark,
    },
    error: {
      light: red,
      dark: redDark,
    },
    success: {
      light: green,
      dark: greenDark,
    },
  },
})

export type Themes = typeof builtThemes

// the process.env conditional here is optional but saves web client-side bundle
// size by leaving out themes JS. tamagui automatically hydrates themes from CSS
// back into JS for you, and the bundler plugins set TAMAGUI_ENVIRONMENT. so
// long as you are using the Vite, Next, Webpack plugins this should just work,
// but if not you can just export builtThemes directly as themes:
export const themes: Themes =
  process.env.TAMAGUI_ENVIRONMENT === 'client' &&
  process.env.NODE_ENV === 'production'
    ? ({} as any)
    : (builtThemes as any)
`
}

function arrayToJS(palette: string[]) {
  return `[${palette.map((val) => {
    return `'${val}'`
  })}]`
}
