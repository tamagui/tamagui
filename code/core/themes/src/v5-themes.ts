import {
  blueDark as blueDarkIn,
  blue as blueIn,
  greenDark as greenDarkIn,
  green as greenIn,
  orangeDark as orangeDarkIn,
  orange as orangeIn,
  pinkDark as pinkDarkIn,
  pink as pinkIn,
  purpleDark as purpleDarkIn,
  purple as purpleIn,
  redDark as redDarkIn,
  red as redIn,
  tealDark as tealDarkIn,
  teal as tealIn,
  yellowDark as yellowDarkIn,
  yellow as yellowIn,
  gray as grayIn,
  grayDark as grayDarkIn,
} from '@tamagui/colors'
import { createThemes, defaultComponentThemes } from '@tamagui/theme-builder'
import { opacify } from './opacify'

// TODO we need grey which is neutral on both white and black

const blue = adjustPaletteLight('blue', blueIn)
const blueDark = adjustPaletteDark('blueDark', blueDarkIn)
const green = adjustPaletteLight('green', greenIn)
const greenDark = adjustPaletteDark('greenDark', greenDarkIn)
const purple = adjustPaletteLight('purple', purpleIn)
const purpleDark = adjustPaletteDark('purpleDark', purpleDarkIn)
const red = adjustPaletteLight('red', redIn)
const redDark = adjustPaletteDark('redDark', redDarkIn)
const yellow = adjustPaletteLight('yellow', yellowIn)
const yellowDark = adjustPaletteDark('yellowDark', yellowDarkIn)
const pink = adjustPaletteLight('pink', pinkIn)
const pinkDark = adjustPaletteDark('pinkDark', pinkDarkIn)
const orange = adjustPaletteLight('orange', orangeIn)
const orangeDark = adjustPaletteDark('orangeDark', orangeDarkIn)
const teal = adjustPaletteLight('teal', tealIn)
const tealDark = adjustPaletteDark('tealDark', tealDarkIn)
const gray = adjustPaletteLight('gray', grayIn)
const grayDark = adjustPaletteDark('grayDark', grayDarkIn)

const darkPalette = [
  '#080808',
  '#191919',
  '#282828',
  '#353535',
  '#444',
  '#484848',
  '#525252',
  '#686868',
  '#757575',
  '#9a9a9a',
  '#ccc',
  '#fefefe',
]

const lightPalette = [
  '#fff',
  '#f8f8f8',
  'hsl(0, 0%, 93%)',
  'hsl(0, 0%, 87%)',
  'hsl(0, 0%, 80%)',
  'hsl(0, 0%, 74%)',
  'hsl(0, 0%, 68%)',
  'hsl(0, 0%, 60%)',
  'hsl(0, 0%, 48%)',
  'hsl(0, 0%, 38%)',
  'hsl(0, 0%, 20%)',
  'hsl(0, 0%, 2%)',
]

// the same on both light and dark, useful for forcing white/black:
const whiteBlack = {
  white: 'rgba(255,255,255,1)',
  white0: 'rgba(255,255,255,0)',
  white02: 'rgba(255,255,255,0.2)',
  white04: 'rgba(255,255,255,0.4)',
  white06: 'rgba(255,255,255,0.6)',
  white08: 'rgba(255,255,255,0.8)',
  black: 'rgba(0,0,0,1)',
  black0: 'rgba(0,0,0,0)',
  black02: 'rgba(0,0,0,0.2)',
  black04: 'rgba(0,0,0,0.4)',
  black06: 'rgba(0,0,0,0.6)',
  black08: 'rgba(0,0,0,0.8)',
}

// highlights are lighter no matter if dark or light theme
// on light theme they are ==== background
// on dark theme === color2-4 looks good

const extraColorsDark = {
  // in between 1/2
  color1pt5: 'rgba(20,20,20)',
  color2pt5: '#222',

  // TODO: ideally just functions for alpha($color1, 0.1)
  // extra low opacities
  color01: opacify(darkPalette[darkPalette.length - 1]!, 0.1),
  color0075: opacify(darkPalette[darkPalette.length - 1]!, 0.075),
  color005: opacify(darkPalette[darkPalette.length - 1]!, 0.05),
  color0025: opacify(darkPalette[darkPalette.length - 1]!, 0.025),

  background01: opacify(darkPalette[0]!, 0.1),
  background0075: opacify(darkPalette[0]!, 0.075),
  background005: opacify(darkPalette[0]!, 0.05),
  background0025: opacify(darkPalette[0]!, 0.025),
}

const extraColorsLight = {
  // in between 1/2
  color1pt5: '#f9f9f9',
  color2pt5: '#f4f4f4',

  // extra low opacities
  color01: opacify(lightPalette[lightPalette.length - 1]!, 0.1),
  color0075: opacify(lightPalette[lightPalette.length - 1]!, 0.075),
  color005: opacify(lightPalette[lightPalette.length - 1]!, 0.05),
  color0025: opacify(lightPalette[lightPalette.length - 1]!, 0.025),

  background01: opacify(lightPalette[0]!, 0.1),
  background0075: opacify(lightPalette[0]!, 0.075),
  background005: opacify(lightPalette[0]!, 0.05),
  background0025: opacify(lightPalette[0]!, 0.025),
}

const darkShadows = {
  shadow1: 'rgba(0,0,0,0.1)',
  shadow2: 'rgba(0,0,0,0.18)',
  shadow3: 'rgba(0,0,0,0.25)',
  shadow4: 'rgba(0,0,0,0.4)',
  shadow5: 'rgba(0,0,0,0.55)',
  shadow6: 'rgba(0,0,0,0.66)',
}

const lightShadows = {
  shadow1: 'rgba(0,0,0,0.025)',
  shadow2: 'rgba(0,0,0,0.04)',
  shadow3: 'rgba(0,0,0,0.06)',
  shadow4: 'rgba(0,0,0,0.095)',
  shadow5: 'rgba(0,0,0,0.195)',
  shadow6: 'rgba(0,0,0,0.3)',
}

const blackColors = {
  black1: darkPalette[0]!,
  black2: darkPalette[1]!,
  black3: darkPalette[2]!,
  black4: darkPalette[3]!,
  black5: darkPalette[4]!,
  black6: darkPalette[5]!,
  black7: darkPalette[6]!,
  black8: darkPalette[7]!,
  black9: darkPalette[8]!,
  black10: darkPalette[9]!,
  black11: darkPalette[10]!,
  black12: darkPalette[11]!,
}

const whiteColors = {
  white1: lightPalette[0]!,
  white2: lightPalette[1]!,
  white3: lightPalette[2]!,
  white4: lightPalette[3]!,
  white5: lightPalette[4]!,
  white6: lightPalette[5]!,
  white7: lightPalette[6]!,
  white8: lightPalette[7]!,
  white9: lightPalette[8]!,
  white10: lightPalette[9]!,
  white11: lightPalette[10]!,
  white12: lightPalette[11]!,
}

export const themes = createThemes({
  // ‼️ we can probably get rid of this since we have mostly moved off the default component themes
  componentThemes: defaultComponentThemes,

  base: {
    palette: {
      dark: darkPalette,
      light: lightPalette,
    },

    // for values we don't want being inherited onto sub-themes
    extra: {
      light: {
        ...blackColors,
        ...blue,
        ...gray,
        ...green,
        ...lightShadows,
        ...orange,
        ...pink,
        ...purple,
        ...red,
        ...teal,
        ...whiteColors,
        ...yellow,
        shadowColor: lightShadows.shadow1,
        ...whiteBlack,
        ...extraColorsLight,
      },
      dark: {
        ...blackColors,
        ...blueDark,
        ...darkShadows,
        ...grayDark,
        ...greenDark,
        ...orangeDark,
        ...pinkDark,
        ...purpleDark,
        ...redDark,
        ...tealDark,
        ...whiteColors,
        ...yellowDark,
        shadowColor: darkShadows.shadow1,
        ...whiteBlack,
        ...extraColorsDark,
      },
    },
  },

  // inverse accent theme
  accent: {
    palette: {
      dark: lightPalette,
      light: darkPalette,
    },
  },

  childrenThemes: {
    black: {
      palette: {
        dark: Object.values(blackColors),
        light: Object.values(blackColors),
      },
    },
    white: {
      palette: {
        dark: Object.values(whiteColors),
        light: Object.values(whiteColors),
      },
    },
    gray: {
      palette: {
        dark: Object.values(grayDark),
        light: Object.values(gray),
      },
    },
    blue: {
      palette: {
        dark: Object.values(blueDark),
        light: Object.values(blue),
      },
    },
    red: {
      palette: {
        dark: Object.values(redDark),
        light: Object.values(red),
      },
    },
    yellow: {
      palette: {
        dark: Object.values(yellowDark),
        light: Object.values(yellow),
      },
    },
    green: {
      palette: {
        dark: Object.values(greenDark),
        light: Object.values(green),
      },
    },
    teal: {
      palette: {
        dark: Object.values(tealDark),
        light: Object.values(teal),
      },
    },
    orange: {
      palette: {
        dark: Object.values(orangeDark),
        light: Object.values(orange),
      },
    },
    pink: {
      palette: {
        dark: Object.values(pinkDark),
        light: Object.values(pink),
      },
    },
    purple: {
      palette: {
        dark: Object.values(purpleDark),
        light: Object.values(purple),
      },
    },
  },
})

function parseHSL(hslString: string): { h: number; s: number; l: number } {
  const match = hslString.match(
    /hsl\((\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?)%,\s*(\d+(?:\.\d+)?)%\)/
  )
  if (!match) throw new Error(`Invalid HSL string: ${hslString}`)
  return {
    h: Number.parseFloat(match[1]!),
    s: Number.parseFloat(match[2]!),
    l: Number.parseFloat(match[3]!),
  }
}

function buildHSL(h: number, s: number, l: number): string {
  return `hsl(${h}, ${s}%, ${Math.round(l)}%)`
}

/**
 * I found the 11th color far too different, we smooth it out here
 */

function adjustPaletteLight(
  name: string,
  palette: Record<string, string>
): Record<string, string> {
  const adjusted: Record<string, string> = { ...palette }

  const color11Key = Object.keys(palette).find((key) => key.endsWith('11'))
  if (color11Key && palette[color11Key]?.startsWith('hsl(')) {
    const { h, s, l } = parseHSL(palette[color11Key]!)
    const newL = Math.min(100, l * 0.9)
    const newS = 65
    adjusted[color11Key] = buildHSL(h, newS, newL)
  }

  const isYellow = name === 'yellow'
  // de-saturate
  for (const key in adjusted) {
    const color = adjusted[key]!
    const { h, s, l } = parseHSL(color)
    const newS = s * (isYellow ? 0.65 : 0.9)
    const newL = Math.round(l * 0.982) // matches dark a bit better
    adjusted[key] = buildHSL(h, newS, newL)
  }

  return adjusted
}

function adjustPaletteDark(
  name: string,
  palette: Record<string, string>
): Record<string, string> {
  const adjusted: Record<string, string> = { ...palette }
  const isYellow = name === 'yellowDark'

  for (const [index, key] of Object.keys(palette).entries()) {
    const number = index + 1
    const value = palette[key]
    if (value?.startsWith('hsl(')) {
      const { h, s, l } = parseHSL(value)

      // we need to strongly de-saturate 11
      if (number === 11) {
        const newL = Math.round(Math.min(100, l * 1.1))
        const newS = name === 'yellowDark' ? 45 : 65
        adjusted[key] = buildHSL(h, newS, newL)
        continue
      }

      // keep our 8-10 saturation high its meant as the bright value
      const newS = Math.round(
        s *
          (number >= 8 && number <= 10
            ? 1
            : isYellow
              ? 0.24
              : // for lower index dark numbers they are used for backgrounds, more de-saturated looks better
                number < 5
                ? 0.5
                : 0.9)
      )

      // to match our themes we darken number < 4
      const newL =
        number < 4
          ? Math.round(Math.min(100, l * 0.65))
          : Math.round(l * (isYellow ? 1.1 : 0.88))

      adjusted[key] = buildHSL(h, newS, newL)
    }
  }

  return adjusted
}
