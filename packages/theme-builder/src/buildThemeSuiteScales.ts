import { hsla, parseToHsla, toHex } from 'color2k'

import { BuildTheme, ScaleTypeName } from './types'

// export function getColorForegroundBackground(color: string, isDarkMode = false) {
//   const [h, s, l] = parseToHsla(color)
//   const isColorLight = l > 0.5
//   const oppositeLightness = l > 0.5 ? 1 - l : 0.5 + l
//   const oppositeLightnessColor = toHex(hsla(h, s, oppositeLightness, 1))
//   const foreground = isDarkMode ? color : oppositeLightnessColor
//   const background = foreground === color ? oppositeLightnessColor : color
//   return {
//     foreground,
//     foregroundLightness: foreground === color ? l : oppositeLightness,
//     background,
//     backgroundLightness: foreground !== color ? l : oppositeLightness,
//   }
// }

// if (scale === 'automatic') {
//   const lightColors = getColorForegroundBackground(baseColor, false)
//   const darkColors = getColorForegroundBackground(baseColor, true)

//   const scaleLen = 12
//   const arr = new Array(scaleLen).fill(0)

//   function getScale(bgL: number, fgL: number) {
//     const stepSize = (fgL - bgL) / scaleLen
//     return arr.map((_, i) => bgL + i * stepSize)
//   }

//   return {
//     ...base,
//     lumScale: {
//       light: getScale(lightColors.backgroundLightness, lightColors.foregroundLightness),
//       dark: getScale(darkColors.backgroundLightness, darkColors.foregroundLightness),
//     },
//   }
// }

export type ScaleType<A extends ScaleTypeName = ScaleTypeName> = {
  name: string
  createdFrom?: A // we copy the scale values - keeping this helps us refer back to the scale. also helpful if we change scales in the future
  lumScale?: {
    light: Array<number>
    dark: Array<number>
  }
  satScale?: {
    light: Array<number>
    dark: Array<number>
  }
}

export function getScalePreset<Name extends ScaleTypeName>(
  a: Name
): (typeof scaleTypes)[Name] {
  return scaleTypes[a]
}

const fullSatScale = {
  light: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  dark: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
}

export const scaleTypes = {
  custom: {
    name: 'Custom',
    createdFrom: 'custom',
  },

  radix: {
    name: 'Radius',
    createdFrom: 'radix',
    lumScale: {
      light: [
        0.992, 0.95, 0.92, 0.868, 0.832, 0.804, 0.747, 0.659, 0.541, 0.453, 0.27, 0.086,
      ],
      dark: [
        0.07, 0.11, 0.136, 0.158, 0.179, 0.205, 0.243, 0.313, 0.439, 0.52, 0.61, 0.93,
      ],
    },
    satScale: {
      light: [0.65, 0.55, 0.4, 0.4, 0.35, 0.35, 0.35, 0.35, 0.4, 0.4, 0.3, 0.2],
      dark: [0.65, 0.55, 0.4, 0.4, 0.35, 0.35, 0.35, 0.35, 0.4, 0.4, 0.3, 0.2],
    },
  },

  'radix-b': {
    name: 'Radius B',
    createdFrom: 'radix-b',
    lumScale: {
      light: [
        0.92, 0.868, 0.832, 0.804, 0.747, 0.7, 0.659, 0.541, 0.453, 0.36, 0.32, 0.27,
      ],
      dark: [
        0.11, 0.136, 0.158, 0.179, 0.205, 0.243, 0.313, 0.439, 0.47, 0.52, 0.56, 0.61,
      ],
    },
    satScale: {
      light: [0.65, 0.55, 0.4, 0.4, 0.35, 0.35, 0.35, 0.35, 0.4, 0.4, 0.3, 0.2],
      dark: [0.65, 0.55, 0.4, 0.4, 0.35, 0.35, 0.35, 0.35, 0.4, 0.4, 0.3, 0.2],
    },
  },

  'radius-bright': {
    name: 'Radius Bright',
    createdFrom: 'radius-bright',
    lumScale: {
      light: [1, 0.954, 0.94, 0.9, 0.85, 0.804, 0.747, 0.659, 0.541, 0.453, 0.27, 0.086],
      dark: [0, 0.1, 0.16, 0.2, 0.24, 0.36, 0.42, 0.46, 0.5, 0.54, 0.84, 0.97],
    },
    satScale: {
      light: [0.65, 0.55, 0.4, 0.4, 0.35, 0.35, 0.35, 0.35, 0.4, 0.4, 0.3, 0.2],
      dark: [0.65, 0.55, 0.4, 0.4, 0.35, 0.35, 0.35, 0.35, 0.4, 0.4, 0.3, 0.2],
    },
  },

  'radius-bold': {
    name: 'Radius Bold',
    createdFrom: 'radius-bold',
    lumScale: {
      light: [1, 0.9, 0.885, 0.82, 0.77, 0.54, 0.32, 0.25, 0.16, 0.12, 0.075, 0],
      dark: [0, 0.13, 0.2, 0.24, 0.3, 0.34, 0.45, 0.55, 0.65, 0.885, 0.9, 1],
    },
    satScale: {
      light: [0.65, 0.55, 0.4, 0.4, 0.35, 0.35, 0.35, 0.35, 0.4, 0.4, 0.3, 0.2],
      dark: [0.65, 0.55, 0.4, 0.4, 0.35, 0.35, 0.35, 0.35, 0.4, 0.4, 0.3, 0.2],
    },
  },

  linear: {
    name: 'Linear',
    createdFrom: 'linear',
    lumScale: {
      light: [1, 0.925, 0.9, 0.85, 0.75, 0.6, 0.4, 0.3, 0.25, 0.15, 0.125, 0],
      dark: [0, 0.075, 0.125, 0.15, 0.25, 0.4, 0.6, 0.75, 0.85, 0.9, 0.925, 1],
    },
    satScale: {
      light: [0.65, 0.55, 0.4, 0.4, 0.35, 0.35, 0.35, 0.35, 0.4, 0.4, 0.3, 0.2],
      dark: [0.65, 0.55, 0.4, 0.4, 0.35, 0.35, 0.35, 0.35, 0.4, 0.4, 0.3, 0.2],
    },
  },

  neon: {
    name: 'Neon',
    createdFrom: 'neon',
    lumScale: {
      light: [
        0.978, 0.938, 0.902, 0.868, 0.832, 0.804, 0.747, 0.659, 0.541, 0.453, 0.27, 0.086,
      ],
      dark: [
        0.07, 0.11, 0.136, 0.158, 0.179, 0.205, 0.243, 0.313, 0.439, 0.52, 0.61, 0.93,
      ],
    },
    satScale: {
      light: [0.65, 0.55, 0.4, 0.4, 0.35, 0.35, 0.35, 0.35, 0.4, 0.4, 0.3, 0.2],
      dark: [0.65, 0.55, 0.4, 0.4, 0.35, 0.35, 0.35, 0.35, 0.4, 0.4, 0.3, 0.2],
    },
  },

  'neon-bright': {
    name: 'Neon B',
    createdFrom: 'neon-bright',
    lumScale: {
      light: [0.45, 0.475, 0.5, 0.525, 0.55, 0.575, 0.6, 0.625, 0.65, 0.2, 0.1, 0],
      dark: [0.45, 0.475, 0.5, 0.525, 0.55, 0.575, 0.6, 0.625, 0.65, 0.2, 0.1, 0],
    },
    satScale: {
      light: [0.65, 0.55, 0.4, 0.4, 0.35, 0.35, 0.35, 0.35, 0.4, 0.4, 0.3, 0.2],
      dark: [0.65, 0.55, 0.4, 0.4, 0.35, 0.35, 0.35, 0.35, 0.4, 0.4, 0.3, 0.2],
    },
  },

  'neon-c': {
    name: 'Neon C',
    createdFrom: 'neon-c',
    lumScale: {
      light: [0.45, 0.475, 0.5, 0.525, 0.55, 0.575, 0.6, 0.625, 0.65, 0.2, 0.1, 0],
      dark: [0.45, 0.475, 0.5, 0.525, 0.55, 0.575, 0.6, 0.625, 0.65, 0.2, 0.1, 0],
    },
    satScale: fullSatScale,
  },

  pastel: {
    name: 'Pastel',
    createdFrom: 'pastel',
    lumScale: {
      light: [
        0.978, 0.938, 0.902, 0.868, 0.832, 0.804, 0.747, 0.659, 0.541, 0.453, 0.36, 0.2,
      ],
      dark: [0.07, 0.15, 0.176, 0.198, 0.2, 0.225, 0.243, 0.313, 0.439, 0.52, 0.61, 0.9],
    },
    satScale: {
      light: [0.5, 0.45, 0.4, 0.4, 0.35, 0.35, 0.35, 0.35, 0.4, 0.4, 0.3, 0.2],
      dark: [0.5, 0.45, 0.4, 0.4, 0.35, 0.35, 0.35, 0.35, 0.4, 0.4, 0.3, 0.2],
    },
  },

  'pastel-desaturating': {
    name: 'Pastel D',
    createdFrom: 'pastel-desaturating',
    lumScale: {
      light: [
        0.935, 0.838, 0.802, 0.768, 0.732, 0.704, 0.647, 0.559, 0.441, 0.353, 0.17, 0,
      ],
      dark: [0.085, 0.1, 0.12, 0.14, 0.17, 0.22, 0.27, 0.35, 0.409, 0.49, 0.58, 0.9],
    },
    satScale: {
      light: [0.6, 0.5, 0.4, 0.35, 0.3, 0.3, 0.3, 0.3, 0.4, 0.35, 0.25, 0.15],
      dark: [0.6, 0.5, 0.4, 0.35, 0.3, 0.3, 0.3, 0.3, 0.4, 0.35, 0.25, 0.15],
    },
  },
} satisfies Record<ScaleTypeName, ScaleType>

const adjustScale = (
  theme: BuildTheme,
  scale: number[],
  userVal: number,
  isLight = false
) => {
  const scaleMin = scale.reduce((acc, cur) => Math.min(cur, acc), Infinity)
  const scaleMax = scale.reduce((acc, cur) => Math.max(cur, acc), 0)

  if (scaleMin === scaleMax) {
    return scale.map(() => userVal)
  }

  const res = scale.map((val, i) => {
    if (userVal > 0.5) {
      return val + (userVal - 0.5) * (1 - val)
    } else {
      return val * (1 / (1.5 - userVal))
    }

    // // goes from 0 - 1 where 0 = closest to edge, 1 = furthest
    // const distanceFromEdge = 2 * (userVal < 0.5 ? userVal : 1 - userVal)

    // // goes from 0 - 1 where 0 = furthest from edge, 1 = closest
    // const strengthOfUserVal = 1 - distanceFromEdge

    // // gets stronger as we get closer to edges
    // const next = userVal * strengthOfUserVal + val * (1 - strengthOfUserVal)

    // return clamp(
    //   val < 0
    //     ? // TODO
    //       val
    //     : next,
    //   [0, 1]
    // )
  })

  return res
}
