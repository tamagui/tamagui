import {
  addChildren,
  applyMask,
  createStrengthenMask,
  createTheme,
  createWeakenMask,
} from '@tamagui/create-theme'

import { colorTokens, darkColors, lightColors } from './tokens'

type ColorName = keyof typeof colorTokens.dark

const lightTransparent = 'rgba(255,255,255,0)'
const darkTransparent = 'rgba(10,10,10,0)'

// background => foreground
const palettes = {
  dark: [
    darkTransparent,
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
    lightTransparent,
  ],
  light: [
    lightTransparent,
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
    darkTransparent,
  ],
}

const colorScale = {
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

// we can use subset of our template as a "skip" so it doesn't get adjusted with masks
const skip = {
  ...colorScale,
  shadowColor: 1,
  shadowColorHover: 1,
  shadowColorPress: 2,
  shadowColorFocus: 2,
}

// templates use the palette and specify index
// negative goes backwards from end so -1 is the last item
const template = {
  ...skip,
  // the background, color, etc keys here work like generics - they make it so you
  // can publish components for others to use without mandating a specific color scale
  // the @tamagui/button Button component looks for `$background`, so you set the
  // dark_red_Button theme to have a stronger background than the dark_red theme.
  background: 2,
  backgroundHover: 3,
  backgroundPress: 1,
  backgroundFocus: 2,
  backgroundStrong: 1,
  backgroundTransparent: 0,
  color: -1,
  colorHover: -2,
  colorPress: -1,
  colorFocus: -2,
  colorTransparent: -0,
  borderColor: 3,
  borderColorHover: 4,
  borderColorPress: 2,
  borderColorFocus: 3,
  placeholderColor: -4,
}

const lightShadowColor = 'rgba(0,0,0,0.15)'
const lightShadowColorStrong = 'rgba(0,0,0,0.2)'
const darkShadowColor = 'rgba(0,0,0,0.3)'
const darkShadowColorStrong = 'rgba(0,0,0,0.45)'

const lightShadows = {
  shadowColor: lightShadowColorStrong,
  shadowColorHover: lightShadowColorStrong,
  shadowColorPress: lightShadowColor,
  shadowColorFocus: lightShadowColor,
}

const darkShadows = {
  shadowColor: darkShadowColorStrong,
  shadowColorHover: darkShadowColorStrong,
  shadowColorPress: darkShadowColor,
  shadowColorFocus: darkShadowColor,
}

const lightTemplate = {
  ...template,
  ...lightShadows,
}

const darkTemplate = { ...template, ...darkShadows }

const light = createTheme(palettes.light, lightTemplate, {
  nonInheritedValues: lightColors,
})

const dark = createTheme(palettes.dark, darkTemplate, { nonInheritedValues: darkColors })

type Theme = { [key in keyof typeof lightTemplate]: string }

const baseThemes: {
  light: Theme
  dark: Theme
} = {
  light,
  dark,
}

// avoid transparent ends
const max = palettes.dark.length - 1
const masks = {
  weaker: createWeakenMask({
    by: 1,
    min: 1,
    max,
  }),
  stronger: createStrengthenMask({
    by: 1,
    min: 1,
    max,
  }),
  stronger2: createStrengthenMask({
    by: 2,
    min: 1,
    max,
  }),
}

const allThemes = addChildren(baseThemes, (name, themeIn) => {
  const theme = themeIn as Theme
  const inverseName = name === 'light' ? 'dark' : 'light'
  const inverseTheme = baseThemes[inverseName]
  const transparent = (hsl: string, opacity = 0) =>
    hsl.replace(`%)`, `%, ${opacity})`).replace(`hsl(`, `hsla(`)

  // setup colorThemes and their inverses
  const [colorThemes, inverseColorThemes] = [
    colorTokens[name],
    colorTokens[inverseName],
  ].map((colorSet) => {
    return Object.fromEntries(
      Object.keys(colorSet).map((color) => {
        const colorPalette = Object.values(colorSet[color as ColorName])
        // we want a much lighter text color by default so swap them around a bit
        const first6 = colorPalette.slice(0, 6)
        const last5 = colorPalette.slice(colorPalette.length - 5)
        return [
          color,
          createTheme(
            [
              transparent(colorPalette[0]),
              ...first6,
              ...last5,
              theme.color,
              transparent(colorPalette[colorPalette.length - 1]),
            ],
            template
          ),
        ]
      })
    ) as Record<ColorName, Theme>
  })

  const allColorThemes = addChildren(colorThemes, (colorName, colorTheme) => {
    const inverse = inverseColorThemes[colorName]
    return {
      ...getAltThemes(colorTheme as any, inverse as any),
      ...getComponentThemes(colorTheme as any, inverse as any),
    }
  })

  return {
    ...getAltThemes(theme, inverseTheme),
    ...getComponentThemes(theme, inverseTheme),
    ...allColorThemes,
  }

  function getComponentThemes(theme: Theme, inverse: Theme) {
    const stronger1 = applyMask(theme, masks.stronger, { skip })
    const stronger2 = applyMask(stronger1, masks.stronger, { skip })
    const inverse1 = applyMask(inverse, masks.weaker, { skip })
    const inverse2 = applyMask(inverse1, masks.weaker, { skip })
    return {
      Button: stronger2,
      DrawerFrame: stronger1,
      SliderTrack: theme,
      SliderTrackActive: stronger2,
      SliderThumb: inverse1,
      Progress: stronger1,
      ProgressIndicator: inverse,
      Switch: stronger2,
      SwitchThumb: inverse2,
      TooltipArrow: stronger1,
      TooltipContent: stronger2,
    }
  }

  function getAltThemes(theme: Theme, inverse: Theme) {
    const alt1 = applyMask(theme, masks.weaker, { skip })
    const alt2 = applyMask(alt1, masks.weaker, { skip })
    const active = applyMask(theme, masks.stronger2, { skip })
    return addChildren({ alt1, alt2, active }, (name, theme) => {
      return getComponentThemes(theme as any, inverse)
    })
  }
})

export const themes = {
  ...allThemes,
  // bring back the full type (the rest use a subset)
  light,
  dark,
}
