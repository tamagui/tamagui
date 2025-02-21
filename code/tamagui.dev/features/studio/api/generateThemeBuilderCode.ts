import { createPalettes, PALETTE_BACKGROUND_OFFSET } from '@tamagui/theme-builder'
import type { BuildThemeSuiteProps } from '@tamagui/themes'

type GenerateThemeBuilderCodeProps = BuildThemeSuiteProps & {
  includeComponentThemes: boolean
  includeSizeTokens: boolean
}

export async function generateThemeBuilderCode({
  palettes,
  includeComponentThemes,
  templateStrategy,
}: GenerateThemeBuilderCodeProps) {
  // side effect to getLastBuilder
  const palettesOut = createPalettes(palettes)

  function paletteToCreateThemes(pIn: string[]) {
    return pIn.slice(PALETTE_BACKGROUND_OFFSET, -PALETTE_BACKGROUND_OFFSET)
  }

  const templatesIdentifier = !templateStrategy
    ? ''
    : templateStrategy === 'stronger'
      ? 'defaultTemplatesStronger'
      : 'defaultTemplatesStrongest'
  const importTemplates = templatesIdentifier ? `, ${templatesIdentifier}` : ''

  const templatesProp = templatesIdentifier
    ? `\n  templates: ${templatesIdentifier},\n`
    : ''
  const componentsProp =
    includeComponentThemes === false
      ? `\n  componentThemes: defaultComponentThemes,\n`
      : ``

  return `import { createThemes${includeComponentThemes ? `, defaultComponentThemes` : ``}${importTemplates} } from '@tamagui/theme-builder'
import * as Colors from '@tamagui/colors'

const darkPalette = ${arrayToJS(paletteToCreateThemes(palettesOut.dark))}
const lightPalette = ${arrayToJS(paletteToCreateThemes(palettesOut.light))}

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

const builtThemes = createThemes({${templatesProp}${componentsProp}
  base: {
    palette: {
      dark: darkPalette,
      light: lightPalette,
    },

    extra: {
      light: {
        ...Colors.green,
        ...Colors.red,
        ...Colors.yellow,
        ...lightShadows,
        shadowColor: lightShadows.shadow1,
      },
      dark: {
        ...Colors.greenDark,
        ...Colors.redDark,
        ...Colors.yellowDark,
        ...darkShadows,
        shadowColor: darkShadows.shadow1,
      },
    },
  },

  accent: {
    palette: {
      dark: ${arrayToJS(paletteToCreateThemes(palettesOut.dark_accent))},
      light: ${arrayToJS(paletteToCreateThemes(palettesOut.light_accent))},
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

  // optionally add more, can pass palette or template

  // grandChildrenThemes: {
  //   alt1: {
  //     template: 'alt1',
  //   },
  //   alt2: {
  //     template: 'alt2',
  //   },
  //   surface1: {
  //     template: 'surface1',
  //   },
  //   surface2: {
  //     template: 'surface2',
  //   },
  //   surface3: {
  //     template: 'surface3',
  //   },
  // },
})

export type Themes = typeof builtThemes

// this is optional, but saves client-side JS bundle size by leaving out themes on client.
// tamagui automatically hydrates themes from css back into JS for you and the tamagui
// bundler plugins automate setting TAMAGUI_ENVIRONMENT.

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
