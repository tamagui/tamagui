import {
  addChildren,
  applyMask,
  createTheme,
  strengthenMask,
  weakenMask,
} from '@tamagui/create-theme'

import { colorTokens, darkColors, lightColors } from './tokens'

const { values } = Object

const palettes = {
  dark: [
    // setting 0 index to transparent
    'rgba(255,255,255,0)',
    // then background => foreground
    '#090909',
    '#151515',
    '#191919',
    '#232323',
    '#282828',
    '#323232',
    '#424242',
    '#494949',
    '#545454',
    '#626262',
    '#a5a5a5',
    '#fff',
  ],
  light: [
    'rgba(0,0,0,0)',
    '#fff',
    '#f4f4f4',
    'hsl(0, 0%, 99.0%)',
    'hsl(0, 0%, 97.3%)',
    'hsl(0, 0%, 95.1%)',
    'hsl(0, 0%, 93.0%)',
    'hsl(0, 0%, 90.9%)',
    'hsl(0, 0%, 80.0%)',
    'hsl(0, 0%, 56.1%)',
    'hsl(0, 0%, 52.3%)',
    'hsl(0, 0%, 43.5%)',
    'hsl(0, 0%, 9.0%)',
  ],
}

// offset from palette (negative goes backwards from end)
const template = {
  background: 2,
  backgroundHover: 3,
  backgroundPress: 1,
  backgroundFocus: 2,
  backgroundStrong: 1,
  backgroundTransparent: 0,
  color: -1,
  colorHover: -2,
  colorPress: -3,
  colorFocus: -4,
  shadowColor: 1,
  shadowColorHover: 1,
  shadowColorPress: 1,
  shadowColorFocus: 1,
  borderColor: 3,
  borderColorHover: 4,
  borderColorPress: 2,
  borderColorFocus: 3,
  placeholderColor: -4,
  color1: 1,
  color2: 2,
  color3: 3,
  color4: 4,
  color5: 5,
  color6: 6,
  color7: 7,
  color8: 8,
  color9: 9,
  color10: 10,
  color11: 11,
  color12: 12,
}

const colorTemplate = {
  ...template,
}

const light = createTheme(palettes.light, template, { nonInheritedValues: lightColors })
const dark = createTheme(palettes.dark, template, { nonInheritedValues: darkColors })

const baseThemes = {
  light,
  dark,
}

type Theme = typeof light

const masks = {
  weaker: weakenMask({
    by: 1,
    min: 1,
    max: palettes.dark.length,
  }),
  stronger: strengthenMask({
    by: 1,
    min: 1,
    max: palettes.dark.length,
  }),
}

export const themes = addChildren(baseThemes, (name, themeIn) => {
  const theme = themeIn as Theme

  const inverseName = name === 'light' ? 'dark' : 'light'
  const inverseTheme = baseThemes[inverseName]
  const palette = palettes[name]
  const transparent = palette[0]

  // setup colorThemes and their inverses
  const [colorThemes, inverseColorThemes] = [
    colorTokens[name],
    colorTokens[inverseName],
  ].map((colorSet) => {
    return {
      blue: createTheme([transparent, ...values(colorSet.blue)], colorTemplate),
      gray: createTheme([transparent, ...values(colorSet.gray)], colorTemplate),
      green: createTheme([transparent, ...values(colorSet.green)], colorTemplate),
      orange: createTheme([transparent, ...values(colorSet.orange)], colorTemplate),
      pink: createTheme([transparent, ...values(colorSet.pink)], colorTemplate),
      purple: createTheme([transparent, ...values(colorSet.purple)], colorTemplate),
      red: createTheme([transparent, ...values(colorSet.red)], colorTemplate),
      yellow: createTheme([transparent, ...values(colorSet.yellow)], colorTemplate),
    }
  })

  return {
    ...getAltThemes(theme, inverseTheme),
    ...getComponentThemes(theme, inverseTheme),
    ...addChildren(colorThemes, (colorName, colorTheme) => {
      const inverse = inverseColorThemes[colorName]
      return {
        ...getAltThemes(colorTheme as any, inverse as any),
        ...getComponentThemes(colorTheme as any, inverse as any),
      }
    }),
  }

  function getComponentThemes(theme: Theme, inverse: Theme) {
    const stronger1 = applyMask(theme, masks.stronger)
    const stronger2 = applyMask(stronger1, masks.stronger)
    const inverse1 = applyMask(inverse, masks.weaker)
    const inverse2 = applyMask(inverse1, masks.weaker)
    return {
      Button: stronger1,
      DrawerFrame: stronger1,
      SliderTrack: theme,
      SliderTrackActive: stronger2,
      SliderThumb: inverse1,
      Progress: stronger1,
      ProgressIndicator: inverse,
      Switch: stronger2,
      SwitchThumb: inverse2,
      TooltipArrow: stronger1,
      TooltipContent: stronger1,
    }
  }

  function getAltThemes(theme: Theme, inverse: Theme) {
    const alt1 = applyMask(theme, masks.weaker)
    const alt2 = applyMask(alt1, masks.weaker)
    console.log({ theme, alt1, alt2, stronger: applyMask(theme, masks.stronger) })
    return addChildren({ alt1, alt2 }, (name, theme) => {
      return getComponentThemes(theme as any, inverse)
    })
  }
})

globalThis['themes'] = themes
