// cSpell:words hsla

import * as Colors from '@tamagui/colors'
import { createThemes, defaultComponentThemes } from '@tamagui/theme-builder'

const darkPalette = [
  'hsl(0, 0%, 1%)', // Background
  'rgba(191, 22, 22, 0.2)', // Subtle background
  'hsla(0, 0%, 12%, 1)', // UI background
  'hsla(0, 0%, 17%, 1)', // Hover UI background
  'hsla(0, 0%, 23%, 1)', // Active UI background
  'hsla(0, 0%, 28%, 1)', // Subtle border
  'hsla(0, 0%, 34%, 1)', // Strong border
  'hsla(0, 0%, 39%, 1)', // Hover border
  'hsla(0, 0%, 45%, 1)', // Primary
  'hsla(0, 0%, 50%, 1)', // Hover primary
  'hsla(0, 0%, 93%, 1)', // Subtle text
  'hsla(0, 0%, 99%, 1)', // Text
]
const lightPalette = [
  'hsla(0, 0%, 100%, 1)', // Background
  'hsla(0, 70.10%, 38.00%, 0.1)', // Subtle background
  'hsla(0, 0%, 94%, 1)', // UI background
  'hsla(0, 0%, 91%, 1)', // Hover UI background
  'hsla(0, 0%, 88%, 1)', // Active UI background
  'hsla(0, 0%, 86%, 1)', // Subtle border
  'hsla(0, 0%, 83%, 1)', // Strong border
  'hsla(0, 0%, 80%, 1)', // Hover border
  'hsla(0, 0%, 77%, 1)', // Primary
  'hsla(0, 0%, 74%, 1)', // Hover primary
  'hsla(0, 0%, 33%, 1)', // Subtle text
  'hsla(0, 0%, 11%, 1)', // Text
]

const orangePaletteLight = [
  'hsl(33, 100%, 97%)', // Background
  'hsl(33, 100%, 92%)', // Subtle background
  'hsl(31, 98%, 84%)', // UI background
  'hsl(29, 97%, 73%)', // Hover UI background
  'hsl(28, 96%, 61%)', // Active UI background
  'hsl(24, 94%, 52%)', // Subtle border
  'hsl(20, 87%, 49%)', // Strong border
  'hsl(17, 85%, 41%)', // Hover border
  'hsl(16, 76%, 34%)', // Primary
  'hsl(15, 71%, 28%)', // Hover primary
  'hsl(14, 80%, 15%)', // Subtle text
  'hsl(14, 80%, 15%)', // Text
]

const greenPaletteLight = [
  'hsl(141, 78%, 97%)', // Background
  'hsl(141, 78%, 94%)', // Subtle background
  'hsl(141, 76%, 86%)', // UI background
  'hsl(142, 69%, 75%)', // Hover UI background
  'hsl(142, 64%, 61%)', // Active UI background
  'hsl(142, 71%, 45%)', // Subtle border
  'hsl(142, 76%, 36%)', // Strong border
  'hsl(143, 72%, 29%)', // Hover border
  'hsl(144, 64%, 24%)', // Primary
  'hsl(146, 59%, 20%)', // Hover primary
  'hsl(152, 90%, 10%)', // Subtle text
  'hsl(152, 90%, 10%)', // Text
]

const redPaletteLight = [
  'hsl(0, 86%, 96%)', // Background
  'hsl(0, 88%, 92%)', // Subtle background
  'hsl(0, 94%, 86%)', // UI background
  'hsl(0, 92%, 80%)', // Hover UI background
  'hsl(0, 91%, 72%)', // Active UI background
  'hsl(0, 85%, 60%)', // Subtle border
  'hsl(0, 72%, 51%)', // Strong border
  'hsl(0, 74%, 42%)', // Hover border
  'hsl(0, 70%, 35%)', // Primary
  'hsl(0, 61%, 30%)', // Hover primary
  'hsl(0, 73%, 16%)', // Subtle text
  'hsl(0, 73%, 16%)', // Text
]

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

const builtThemes = createThemes({
  componentThemes: defaultComponentThemes,

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
      dark: [
        'hsla(234, 18%, 40%, 1)', // Background
        'hsla(234, 18%, 42%, 1)', // Subtle background
        'hsla(234, 18%, 44%, 1)', // UI background
        'hsla(234, 18%, 47%, 1)', // Hover UI background
        'hsla(234, 18%, 49%, 1)', // Active UI background
        'hsla(234, 18%, 51%, 1)', // Subtle border
        'hsla(234, 18%, 53%, 1)', // Strong border
        'hsla(234, 18%, 56%, 1)', // Hover border
        'hsla(234, 18%, 58%, 1)', // Primary
        'hsla(234, 18%, 60%, 1)', // Hover primary
        'hsla(250, 50%, 90%, 1)', // Subtle text
        'hsla(250, 50%, 95%, 1)', // Text
      ],
      light: [
        'hsla(234, 18%, 40%, 1)', // Background
        'hsla(234, 18%, 46%, 1)', // Subtle background
        'hsla(234, 18%, 52%, 1)', // UI background
        'hsla(234, 18%, 58%, 1)', // Hover UI background
        'hsla(234, 18%, 64%, 1)', // Active UI background
        'hsla(234, 18%, 71%, 1)', // Subtle border
        'hsla(234, 18%, 77%, 1)', // Strong border
        'hsla(234, 18%, 83%, 1)', // Hover border
        'hsla(234, 18%, 89%, 1)', // Primary
        'hsla(234, 18%, 95%, 1)', // Hover primary
        'hsla(250, 50%, 95%, 1)', // Subtle text
        'hsla(250, 50%, 95%, 1)', // Text
      ],
    },
  },

  childrenThemes: {
    warning: {
      palette: {
        dark: Object.values(Colors.yellowDark),
        light: orangePaletteLight,
      },
    },

    error: {
      palette: {
        dark: Object.values(Colors.redDark),
        light: redPaletteLight,
      },
    },

    success: {
      palette: {
        dark: Object.values(Colors.greenDark),
        light: greenPaletteLight,
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

// the process.env conditional here is optional but saves web client-side bundle
// size by leaving out themes JS. tamagui automatically hydrates themes from CSS
// back into JS for you, and the bundler plugins set TAMAGUI_ENVIRONMENT. so
// long as you are using the Vite, Next, Webpack plugins this should just work,
// but if not you can just export builtThemes directly as themes:
export const themes: Themes =
  process.env.TAMAGUI_ENVIRONMENT === 'client' && process.env.NODE_ENV === 'production'
    ? ({} as any)
    : (builtThemes as any)
