import { createThemes, defaultComponentThemes } from '@tamagui/theme-builder'
import * as Colors from '@tamagui/colors'

const jadeDark = [
  'hsla(165, 100%, 4%, 1)',
  'hsla(165, 100%, 8%, 1)',
  'hsla(165, 100%, 12%, 1)',
  'hsla(165, 100%, 18%, 1)',
  'hsla(165, 100%, 25%, 1)',
  'hsla(165, 100%, 35%, 1)',
  'hsla(165, 100%, 45%, 1)',
  'hsla(165, 100%, 55%, 1)',
  'hsla(165, 100%, 65%, 1)',
  'hsla(165, 100%, 75%, 1)',
  'hsla(165, 100%, 85%, 1)',
  'hsla(165, 100%, 90%, 1)',
]

const jadeLight = [
  'hsla(165, 100%, 90%, 1)',
  'hsla(165, 100%, 85%, 1)',
  'hsla(165, 100%, 75%, 1)',
  'hsla(165, 100%, 65%, 1)',
  'hsla(165, 100%, 55%, 1)',
  'hsla(165, 100%, 45%, 1)',
  'hsla(165, 100%, 35%, 1)',
  'hsla(165, 100%, 25%, 1)',
  'hsla(165, 100%, 18%, 1)',
  'hsla(165, 100%, 12%, 1)',
  'hsla(165, 100%, 8%, 1)',
  'hsla(165, 100%, 4%, 1)',
]

const supremeDark = [
  'hsla(358, 100%, 35%, 1)',
  'hsla(358, 100%, 38%, 1)',
  'hsla(358, 100%, 40%, 1)',
  'hsla(358, 100%, 43%, 1)',
  'hsla(358, 100%, 45%, 1)',
  'hsla(358, 100%, 48%, 1)',
  'hsla(358, 100%, 50%, 1)',
  'hsla(358, 100%, 53%, 1)',
  'hsla(358, 100%, 55%, 1)',
  'hsla(358, 100%, 65%, 1)',
  'hsla(358, 100%, 75%, 1)',
  'hsla(358, 100%, 95%, 1)',
]
const supremeLight = [
  'hsla(358, 100%, 50%, 1)',
  'hsla(358, 100%, 49%, 1)',
  'hsla(358, 100%, 48%, 1)',
  'hsla(358, 100%, 46%, 1)',
  'hsla(358, 100%, 45%, 1)',
  'hsla(358, 100%, 44%, 1)',
  'hsla(358, 100%, 43%, 1)',
  'hsla(358, 100%, 41%, 1)',
  'hsla(358, 100%, 40%, 1)',
  'hsla(358, 100%, 35%, 1)',
  'hsla(358, 100%, 100%, 1)',
  'hsla(358, 100%, 100%, 1)',
]

const neonBlueDark = [
  'hsla(180, 80%, 10%, 1)',
  'hsla(181, 81%, 14%, 1)',
  'hsla(183, 83%, 18%, 1)',
  'hsla(184, 84%, 21%, 1)',
  'hsla(185, 85%, 25%, 1)',
  'hsla(186, 86%, 30%, 1)',
  'hsla(187, 87%, 35%, 1)',
  'hsla(188, 88%, 40%, 1)',
  'hsla(189, 89%, 45%, 1)',
  'hsla(190, 90%, 50%, 1)',
  'hsla(195, 85%, 80%, 1)',
  'hsla(200, 80%, 90%, 1)',
]
const neonBlueLight = [
  'hsla(180, 80%, 90%, 1)',
  'hsla(181, 81%, 86%, 1)',
  'hsla(183, 83%, 83%, 1)',
  'hsla(184, 84%, 79%, 1)',
  'hsla(185, 85%, 75%, 1)',
  'hsla(186, 86%, 70%, 1)',
  'hsla(187, 87%, 65%, 1)',
  'hsla(188, 88%, 60%, 1)',
  'hsla(189, 89%, 55%, 1)',
  'hsla(190, 90%, 50%, 1)',
  'hsla(195, 85%, 25%, 1)',
  'hsla(200, 80%, 15%, 1)',
]

const orangeRedDark = [
  'hsla(17, 100%, 5%, 1)', // Gần như đen
  'hsla(17, 100%, 10%, 1)', // Rất tối
  'hsla(17, 100%, 15%, 1)', // Tối
  'hsla(17, 100%, 20%, 1)', // Tối vừa
  'hsla(17, 100%, 25%, 1)', // Tối nhẹ
  'hsla(17, 100%, 38%, 1)', // Màu C14600
  'hsla(17, 100%, 45%, 1)', // Sáng vừa
  'hsla(17, 100%, 50%, 1)', // Sáng
  'hsla(17, 100%, 55%, 1)', // Rất sáng
  'hsla(17, 100%, 60%, 1)', // Cực sáng
  'hsla(17, 100%, 65%, 1)', // Sáng nhất
  'hsla(17, 100%, 70%, 1)', // Highlight
]

const orangeRedLight = [
  'hsla(17, 100%, 70%, 1)', // Highlight
  'hsla(17, 100%, 65%, 1)', // Sáng nhất
  'hsla(17, 100%, 60%, 1)', // Cực sáng
  'hsla(17, 100%, 55%, 1)', // Rất sáng
  'hsla(17, 100%, 50%, 1)', // Sáng
  'hsla(17, 100%, 45%, 1)', // Sáng vừa
  'hsla(17, 100%, 38%, 1)', // Màu C14600
  'hsla(17, 100%, 25%, 1)', // Tối nhẹ
  'hsla(17, 100%, 20%, 1)', // Tối vừa
  'hsla(17, 100%, 15%, 1)', // Tối
  'hsla(17, 100%, 10%, 1)', // Rất tối
  'hsla(17, 100%, 5%, 1)', // Gần như đen
]

const royalBlueDark = [
  'hsla(243, 90%, 5%, 1)', // Gần như đen
  'hsla(243, 90%, 10%, 1)', // Rất tối
  'hsla(243, 90%, 15%, 1)', // Tối
  'hsla(243, 90%, 20%, 1)', // Tối vừa
  'hsla(243, 90%, 25%, 1)', // Tối nhẹ
  'hsla(243, 70%, 41%, 1)', // Màu 261FB3
  'hsla(243, 90%, 45%, 1)', // Sáng vừa
  'hsla(243, 90%, 50%, 1)', // Sáng
  'hsla(243, 90%, 55%, 1)', // Rất sáng
  'hsla(243, 90%, 60%, 1)', // Cực sáng
  'hsla(243, 90%, 65%, 1)', // Sáng nhất
  'hsla(243, 90%, 70%, 1)', // Highlight
]

const royalBlueLight = [
  'hsla(243, 90%, 70%, 1)', // Highlight
  'hsla(243, 90%, 65%, 1)', // Sáng nhất
  'hsla(243, 90%, 60%, 1)', // Cực sáng
  'hsla(243, 90%, 55%, 1)', // Rất sáng
  'hsla(243, 90%, 50%, 1)', // Sáng
  'hsla(243, 90%, 45%, 1)', // Sáng vừa
  'hsla(243, 70%, 41%, 1)', // Màu 261FB3
  'hsla(243, 90%, 25%, 1)', // Tối nhẹ
  'hsla(243, 90%, 20%, 1)', // Tối vừa
  'hsla(243, 90%, 15%, 1)', // Tối
  'hsla(243, 90%, 10%, 1)', // Rất tối
  'hsla(243, 90%, 5%, 1)', // Gần như đen
]

const burgundyDark = [
  'hsla(334, 60%, 5%, 1)', // Gần như đen
  'hsla(334, 60%, 10%, 1)', // Rất tối
  'hsla(334, 60%, 15%, 1)', // Tối
  'hsla(334, 60%, 20%, 1)', // Tối vừa
  'hsla(334, 60%, 25%, 1)', // Tối nhẹ
  'hsla(334, 60%, 27%, 1)', // Màu 872341
  'hsla(334, 60%, 35%, 1)', // Sáng vừa
  'hsla(334, 60%, 40%, 1)', // Sáng
  'hsla(334, 60%, 45%, 1)', // Rất sáng
  'hsla(334, 60%, 50%, 1)', // Cực sáng
  'hsla(334, 60%, 55%, 1)', // Sáng nhất
  'hsla(334, 60%, 60%, 1)', // Highlight
]

const burgundyLight = [
  'hsla(334, 60%, 60%, 1)', // Highlight
  'hsla(334, 60%, 55%, 1)', // Sáng nhất
  'hsla(334, 60%, 50%, 1)', // Cực sáng
  'hsla(334, 60%, 45%, 1)', // Rất sáng
  'hsla(334, 60%, 40%, 1)', // Sáng
  'hsla(334, 60%, 35%, 1)', // Sáng vừa
  'hsla(334, 60%, 27%, 1)', // Màu 872341
  'hsla(334, 60%, 25%, 1)', // Tối nhẹ
  'hsla(334, 60%, 20%, 1)', // Tối vừa
  'hsla(334, 60%, 15%, 1)', // Tối
  'hsla(334, 60%, 10%, 1)', // Rất tối
  'hsla(334, 60%, 5%, 1)', // Gần như đen
]

const tealDark = [
  'hsla(187, 94%, 5%, 1)', // Gần như đen
  'hsla(187, 94%, 10%, 1)', // Rất tối
  'hsla(187, 94%, 15%, 1)', // Tối
  'hsla(187, 94%, 20%, 1)', // Tối vừa
  'hsla(187, 94%, 25%, 1)', // Tối nhẹ
  'hsla(187, 94%, 32%, 1)', // Màu 034C53
  'hsla(187, 94%, 38%, 1)', // Sáng vừa
  'hsla(187, 94%, 43%, 1)', // Sáng
  'hsla(187, 94%, 48%, 1)', // Rất sáng
  'hsla(187, 94%, 53%, 1)', // Cực sáng
  'hsla(187, 94%, 58%, 1)', // Sáng nhất
  'hsla(187, 94%, 63%, 1)', // Highlight
]

const tealLight = [
  'hsla(187, 94%, 63%, 1)', // Highlight
  'hsla(187, 94%, 58%, 1)', // Sáng nhất
  'hsla(187, 94%, 53%, 1)', // Cực sáng
  'hsla(187, 94%, 48%, 1)', // Rất sáng
  'hsla(187, 94%, 43%, 1)', // Sáng
  'hsla(187, 94%, 38%, 1)', // Sáng vừa
  'hsla(187, 94%, 32%, 1)', // Màu 034C53
  'hsla(187, 94%, 25%, 1)', // Tối nhẹ
  'hsla(187, 94%, 20%, 1)', // Tối vừa
  'hsla(187, 94%, 15%, 1)', // Tối
  'hsla(187, 94%, 10%, 1)', // Rất tối
  'hsla(187, 94%, 5%, 1)', // Gần như đen
]

const forestDark = [
  'hsla(162, 64%, 5%, 1)', // Gần như đen
  'hsla(162, 64%, 10%, 1)', // Rất tối
  'hsla(162, 64%, 15%, 1)', // Tối
  'hsla(162, 64%, 20%, 1)', // Tối vừa
  'hsla(162, 64%, 25%, 1)', // Tối nhẹ
  'hsla(162, 64%, 30%, 1)', // Màu 1B4D3E
  'hsla(162, 64%, 35%, 1)', // Sáng vừa
  'hsla(162, 64%, 40%, 1)', // Sáng
  'hsla(162, 64%, 45%, 1)', // Rất sáng
  'hsla(162, 64%, 50%, 1)', // Cực sáng
  'hsla(162, 64%, 55%, 1)', // Sáng nhất
  'hsla(162, 64%, 60%, 1)', // Highlight
]

const forestLight = [
  'hsla(162, 64%, 60%, 1)', // Highlight
  'hsla(162, 64%, 55%, 1)', // Sáng nhất
  'hsla(162, 64%, 50%, 1)', // Cực sáng
  'hsla(162, 64%, 45%, 1)', // Rất sáng
  'hsla(162, 64%, 40%, 1)', // Sáng
  'hsla(162, 64%, 35%, 1)', // Sáng vừa
  'hsla(162, 64%, 30%, 1)', // Màu 1B4D3E
  'hsla(162, 64%, 25%, 1)', // Tối nhẹ
  'hsla(162, 64%, 20%, 1)', // Tối vừa
  'hsla(162, 64%, 15%, 1)', // Tối
  'hsla(162, 64%, 10%, 1)', // Rất tối
  'hsla(162, 64%, 5%, 1)', // Gần như đen
]

const cyanDark = [
  'hsla(186, 32%, 5%, 1)', // Gần như đen
  'hsla(186, 32%, 10%, 1)', // Rất tối
  'hsla(186, 32%, 15%, 1)', // Tối
  'hsla(186, 32%, 20%, 1)', // Tối vừa
  'hsla(186, 32%, 25%, 1)', // Tối nhẹ
  'hsla(186, 32%, 46%, 1)', // Màu 4F959D
  'hsla(186, 32%, 50%, 1)', // Sáng vừa
  'hsla(186, 32%, 55%, 1)', // Sáng
  'hsla(186, 32%, 60%, 1)', // Rất sáng
  'hsla(186, 32%, 65%, 1)', // Cực sáng
  'hsla(186, 32%, 70%, 1)', // Sáng nhất
  'hsla(186, 32%, 75%, 1)', // Highlight
]

const cyanLight = [
  'hsla(186, 32%, 75%, 1)', // Highlight
  'hsla(186, 32%, 70%, 1)', // Sáng nhất
  'hsla(186, 32%, 65%, 1)', // Cực sáng
  'hsla(186, 32%, 60%, 1)', // Rất sáng
  'hsla(186, 32%, 55%, 1)', // Sáng
  'hsla(186, 32%, 50%, 1)', // Sáng vừa
  'hsla(186, 32%, 46%, 1)', // Màu 4F959D
  'hsla(186, 32%, 25%, 1)', // Tối nhẹ
  'hsla(186, 32%, 20%, 1)', // Tối vừa
  'hsla(186, 32%, 15%, 1)', // Tối
  'hsla(186, 32%, 10%, 1)', // Rất tối
  'hsla(186, 32%, 5%, 1)', // Gần như đen
]

const darkPalette = [
  'hsla(0, 0%, 1%, 1)',
  'hsla(0, 0%, 5%, 1)',
  'hsla(0, 0%, 8%, 1)',
  'hsla(0, 0%, 12%, 1)',
  'hsla(0, 0%, 15%, 1)',
  'hsla(0, 0%, 22%, 1)',
  'hsla(0, 0%, 29%, 1)',
  'hsla(0, 0%, 36%, 1)',
  'hsla(0, 0%, 43%, 1)',
  'hsla(0, 0%, 50%, 1)',
  'hsla(0, 0%, 85%, 1)',
  'hsla(0, 0%, 100%, 1)',
]
const lightPalette = [
  'hsla(0, 0%, 100%, 1)',
  'hsla(0, 0%, 96%, 1)',
  'hsla(0, 0%, 93%, 1)',
  'hsla(0, 0%, 89%, 1)',
  'hsla(0, 0%, 85%, 1)',
  'hsla(0, 0%, 78%, 1)',
  'hsla(0, 0%, 71%, 1)',
  'hsla(0, 0%, 64%, 1)',
  'hsla(0, 0%, 57%, 1)',
  'hsla(0, 0%, 50%, 1)',
  'hsla(0, 0%, 15%, 1)',
  'hsla(0, 0%, 1%, 1)',
]

const neonDark = [
  'hsla(195, 90%, 10%, 1)',
  'hsla(221, 90%, 13%, 1)',
  'hsla(248, 90%, 15%, 1)',
  'hsla(274, 90%, 18%, 1)',
  'hsla(300, 90%, 20%, 1)',
  'hsla(294, 90%, 26%, 1)',
  'hsla(288, 90%, 32%, 1)',
  'hsla(282, 90%, 38%, 1)',
  'hsla(276, 90%, 44%, 1)',
  'hsla(270, 90%, 50%, 1)',
  'hsla(330, 90%, 90%, 1)',
  'hsla(330, 90%, 95%, 1)',
]

const neonLight = [
  'hsla(195, 90%, 97%, 1)',
  'hsla(221, 90%, 93%, 1)',
  'hsla(248, 90%, 89%, 1)',
  'hsla(274, 90%, 84%, 1)',
  'hsla(300, 90%, 80%, 1)',
  'hsla(294, 90%, 74%, 1)',
  'hsla(288, 90%, 68%, 1)',
  'hsla(282, 90%, 62%, 1)',
  'hsla(276, 90%, 56%, 1)',
  'hsla(270, 90%, 50%, 1)',
  'hsla(330, 90%, 20%, 1)',
  'hsla(330, 90%, 10%, 1)',
]

const neonRainbowDark = [
  'hsla(300, 100%, 5%, 1)', // Deep purple base
  'hsla(320, 100%, 20%, 1)', // Neon pink
  'hsla(280, 100%, 25%, 1)', // Bright purple
  'hsla(196, 100%, 30%, 1)', // Electric blue
  'hsla(160, 100%, 35%, 1)', // Neon green
  'hsla(120, 100%, 40%, 1)', // Lime
  'hsla(60, 100%, 45%, 1)', // Yellow
  'hsla(30, 100%, 50%, 1)', // Orange
  'hsla(350, 100%, 55%, 1)', // Hot pink
  'hsla(330, 100%, 60%, 1)', // Magenta
  'hsla(280, 100%, 85%, 1)', // Light purple
  'hsla(260, 100%, 95%, 1)', // Brightest highlight
]

const neonRainbowLight = [
  'hsla(300, 100%, 98%, 1)', // White with slight purple tint
  'hsla(320, 100%, 95%, 1)', // Very light pink
  'hsla(280, 100%, 90%, 1)', // Light purple
  'hsla(196, 100%, 85%, 1)', // Light blue
  'hsla(160, 100%, 80%, 1)', // Light green
  'hsla(120, 100%, 75%, 1)', // Light lime
  'hsla(60, 100%, 70%, 1)', // Light yellow
  'hsla(30, 100%, 65%, 1)', // Light orange
  'hsla(350, 100%, 60%, 1)', // Light hot pink
  'hsla(330, 100%, 55%, 1)', // Vibrant magenta
  'hsla(280, 100%, 25%, 1)', // Dark purple
  'hsla(260, 100%, 15%, 1)', // Deepest purple
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
    neon: {
      palette: {
        dark: neonDark,
        light: neonLight,
      },
    },

    neonBlue: {
      palette: {
        dark: neonBlueDark,
        light: neonBlueLight,
      },
    },

    neonRainbow: {
      palette: {
        dark: neonRainbowDark,
        light: neonRainbowLight,
      },
    },

    jade: {
      palette: {
        dark: jadeDark,
        light: jadeLight,
      },
    },

    supreme: {
      palette: {
        dark: supremeDark,
        light: supremeLight,
      },
    },

    orangeRed: {
      palette: {
        dark: orangeRedDark,
        light: orangeRedLight,
      },
    },

    royalBlue: {
      palette: {
        dark: royalBlueDark,
        light: royalBlueLight,
      },
    },

    burgundy: {
      palette: {
        dark: burgundyDark,
        light: burgundyLight,
      },
    },

    teal: {
      palette: {
        dark: tealDark,
        light: tealLight,
      },
    },

    forest: {
      palette: {
        dark: forestDark,
        light: forestLight,
      },
    },

    cyan: {
      palette: {
        dark: cyanDark,
        light: cyanLight,
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
