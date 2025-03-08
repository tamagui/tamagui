import { createThemes, defaultComponentThemes } from '@tamagui/theme-builder'
import * as Colors from '@tamagui/colors'

const avocadoDark = [
  'hsla(120, 35%, 5%, 1)',
  'hsla(121, 36%, 10%, 1)',
  'hsla(123, 38%, 15%, 1)',
  'hsla(124, 39%, 20%, 1)',
  'hsla(125, 40%, 25%, 1)',
  'hsla(126, 41%, 30%, 1)',
  'hsla(127, 42%, 35%, 1)',
  'hsla(128, 43%, 40%, 1)',
  'hsla(129, 44%, 45%, 1)',
  'hsla(130, 45%, 50%, 1)',
  'hsla(135, 50%, 85%, 1)',
  'hsla(140, 55%, 95%, 1)',
]
const avocadoLight = [
  'hsla(120, 35%, 97%, 1)',
  'hsla(121, 36%, 93%, 1)',
  'hsla(123, 38%, 89%, 1)',
  'hsla(124, 39%, 84%, 1)',
  'hsla(125, 40%, 80%, 1)',
  'hsla(126, 41%, 74%, 1)',
  'hsla(127, 42%, 68%, 1)',
  'hsla(128, 43%, 62%, 1)',
  'hsla(129, 44%, 56%, 1)',
  'hsla(130, 45%, 50%, 1)',
  'hsla(135, 50%, 20%, 1)',
  'hsla(140, 55%, 5%, 1)',
]

const whaleDark = [
  'hsla(210, 25%, 5%, 1)',
  'hsla(211, 28%, 8%, 1)',
  'hsla(213, 30%, 10%, 1)',
  'hsla(214, 32%, 13%, 1)',
  'hsla(215, 35%, 15%, 1)',
  'hsla(216, 37%, 22%, 1)',
  'hsla(217, 39%, 29%, 1)',
  'hsla(218, 41%, 36%, 1)',
  'hsla(219, 43%, 43%, 1)',
  'hsla(220, 45%, 50%, 1)',
  'hsla(225, 50%, 85%, 1)',
  'hsla(230, 20%, 95%, 1)',
]
const whaleLight = [
  'hsla(210, 15%, 98%, 1)',
  'hsla(210, 18%, 95%, 1)',
  'hsla(210, 20%, 92%, 1)',
  'hsla(210, 23%, 88%, 1)',
  'hsla(210, 25%, 85%, 1)',
  'hsla(210, 27%, 78%, 1)',
  'hsla(210, 29%, 71%, 1)',
  'hsla(210, 31%, 64%, 1)',
  'hsla(210, 33%, 57%, 1)',
  'hsla(210, 35%, 50%, 1)',
  'hsla(210, 40%, 20%, 1)',
  'hsla(210, 10%, 5%, 1)',
]

const pigDark = [
  'hsla(330, 40%, 15%, 1)',
  'hsla(331, 43%, 19%, 1)',
  'hsla(333, 45%, 22%, 1)',
  'hsla(334, 48%, 26%, 1)',
  'hsla(335, 50%, 30%, 1)',
  'hsla(336, 52%, 34%, 1)',
  'hsla(337, 54%, 38%, 1)',
  'hsla(338, 56%, 42%, 1)',
  'hsla(339, 58%, 46%, 1)',
  'hsla(340, 60%, 50%, 1)',
  'hsla(345, 70%, 75%, 1)',
  'hsla(350, 80%, 90%, 1)',
]

const pigLight = [
  'hsla(330, 40%, 90%, 1)',
  'hsla(331, 43%, 86%, 1)',
  'hsla(333, 45%, 83%, 1)',
  'hsla(334, 48%, 79%, 1)',
  'hsla(335, 50%, 75%, 1)',
  'hsla(336, 52%, 71%, 1)',
  'hsla(337, 54%, 67%, 1)',
  'hsla(338, 56%, 63%, 1)',
  'hsla(339, 58%, 59%, 1)',
  'hsla(340, 60%, 55%, 1)',
  'hsla(345, 70%, 35%, 1)',
  'hsla(350, 80%, 15%, 1)',
]

const sunFlowerDark = [
  'hsla(54, 95%, 5%, 1)',
  'hsla(54, 94%, 8%, 1)',
  'hsla(54, 93%, 10%, 1)',
  'hsla(54, 91%, 13%, 1)',
  'hsla(54, 90%, 15%, 1)',
  'hsla(54, 89%, 22%, 1)',
  'hsla(54, 88%, 29%, 1)',
  'hsla(54, 87%, 36%, 1)',
  'hsla(54, 86%, 43%, 1)',
  'hsla(54, 85%, 50%, 1)',
  'hsla(54, 80%, 85%, 1)',
  'hsla(54, 75%, 95%, 1)',
]
const sunFlowerLight = [
  'hsla(54, 95%, 99%, 1)',
  'hsla(54, 94%, 96%, 1)',
  'hsla(54, 93%, 92%, 1)',
  'hsla(54, 91%, 89%, 1)',
  'hsla(54, 90%, 85%, 1)',
  'hsla(54, 89%, 78%, 1)',
  'hsla(54, 88%, 71%, 1)',
  'hsla(54, 87%, 64%, 1)',
  'hsla(54, 86%, 57%, 1)',
  'hsla(54, 85%, 50%, 1)',
  'hsla(54, 80%, 20%, 1)',
  'hsla(54, 75%, 10%, 1)',
]

const squidDark = [
  'hsla(0, 85%, 5%, 1)',
  'hsla(0, 84%, 10%, 1)',
  'hsla(0, 83%, 15%, 1)',
  'hsla(0, 81%, 20%, 1)',
  'hsla(0, 80%, 25%, 1)',
  'hsla(0, 79%, 30%, 1)',
  'hsla(0, 78%, 35%, 1)',
  'hsla(0, 77%, 40%, 1)',
  'hsla(0, 76%, 45%, 1)',
  'hsla(0, 75%, 50%, 1)',
  'hsla(340, 70%, 85%, 1)',
  'hsla(340, 75%, 95%, 1)',
]
const squidLight = [
  'hsla(0, 85%, 97%, 1)',
  'hsla(0, 84%, 93%, 1)',
  'hsla(0, 83%, 89%, 1)',
  'hsla(0, 81%, 84%, 1)',
  'hsla(0, 80%, 80%, 1)',
  'hsla(0, 79%, 74%, 1)',
  'hsla(0, 78%, 68%, 1)',
  'hsla(0, 77%, 62%, 1)',
  'hsla(0, 76%, 56%, 1)',
  'hsla(0, 75%, 50%, 1)',
  'hsla(340, 70%, 25%, 1)',
  'hsla(340, 75%, 15%, 1)',
]

const darkPalette = [
  'hsla(0, 5%, 2%, 1)',
  'hsla(0, 6%, 4%, 1)',
  'hsla(0, 8%, 6%, 1)',
  'hsla(0, 9%, 8%, 1)',
  'hsla(0, 10%, 10%, 1)',
  'hsla(0, 11%, 14%, 1)',
  'hsla(0, 12%, 18%, 1)',
  'hsla(0, 13%, 22%, 1)',
  'hsla(0, 14%, 26%, 1)',
  'hsla(0, 15%, 30%, 1)',
  'hsla(0, 20%, 60%, 1)',
  'hsla(0, 25%, 90%, 1)',
]
const lightPalette = [
  'hsla(0, 5%, 98%, 1)',
  'hsla(0, 6%, 96%, 1)',
  'hsla(0, 8%, 94%, 1)',
  'hsla(0, 9%, 92%, 1)',
  'hsla(0, 10%, 90%, 1)',
  'hsla(0, 11%, 86%, 1)',
  'hsla(0, 12%, 82%, 1)',
  'hsla(0, 13%, 78%, 1)',
  'hsla(0, 14%, 74%, 1)',
  'hsla(0, 15%, 70%, 1)',
  'hsla(0, 20%, 40%, 1)',
  'hsla(0, 25%, 10%, 1)',
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
      dark: darkPalette,
      light: lightPalette,
    },
  },

  childrenThemes: {
    //
    avocado: {
      palette: {
        dark: avocadoDark,
        light: avocadoLight,
      },
    },

    whale: {
      palette: {
        dark: whaleDark,
        light: whaleLight,
      },
    },

    pig: {
      palette: {
        dark: pigDark,
        light: pigLight,
      },
    },

    sunFlower: {
      palette: {
        dark: sunFlowerDark,
        light: sunFlowerLight,
      },
    },

    squid: {
      palette: {
        dark: squidDark,
        light: squidLight,
      },
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
  process.env.TAMAGUI_ENVIRONMENT === 'client' && process.env.NODE_ENV === 'production'
    ? ({} as any)
    : (builtThemes as any)
