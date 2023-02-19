import {
  MaskOptions,
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
    '#050505',
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
    '#f9f9f9',
    'hsl(0, 0%, 97.3%)',
    'hsl(0, 0%, 95.1%)',
    'hsl(0, 0%, 94.0%)',
    'hsl(0, 0%, 92.0%)',
    'hsl(0, 0%, 89.5%)',
    'hsl(0, 0%, 81.0%)',
    'hsl(0, 0%, 56.1%)',
    'hsl(0, 0%, 50.3%)',
    'hsl(0, 0%, 42.5%)',
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
  borderColor: 5,
  borderColorHover: 6,
  borderColorPress: 4,
  borderColorFocus: 5,
  placeholderColor: -4,
}

const lightShadowColor = 'rgba(0,0,0,0.02)'
const lightShadowColorStrong = 'rgba(0,0,0,0.066)'
const darkShadowColor = 'rgba(0,0,0,0.2)'
const darkShadowColorStrong = 'rgba(0,0,0,0.3)'

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
  // our light color palette is... a bit unique
  borderColor: 6,
  borderColorHover: 7,
  borderColorFocus: 5,
  borderColorPress: 6,
  ...lightShadows,
}

const darkTemplate = { ...template, ...darkShadows }

const light = createTheme(palettes.light, lightTemplate)
const dark = createTheme(palettes.dark, darkTemplate)

type SubTheme = typeof light

const baseThemes: {
  light: SubTheme
  dark: SubTheme
} = {
  light,
  dark,
}

const masks = {
  weaker: createWeakenMask(),
  stronger: createStrengthenMask(),
}

const maskOptions: MaskOptions = {
  skip,

  // avoids the transparent ends
  max: palettes.light.length - 2,
  min: 1,
}

const allThemes = addChildren(baseThemes, (name, theme) => {
  const isLight = name === 'light'
  const inverseName = isLight ? 'dark' : 'light'
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
        const colorPalette = Object.values(colorSet[color]) as string[]
        // were re-ordering these
        const [head, tail] = [
          colorPalette.slice(0, 6),
          colorPalette.slice(colorPalette.length - 5),
        ]
        // add our transparent colors first/last
        // and make sure the last (foreground) color is white/black rather than colorful
        // this is mostly for consistency with the older theme-base
        const palette = [
          transparent(colorPalette[0]),
          ...head,
          ...tail,
          theme.color,
          transparent(colorPalette[colorPalette.length - 1]),
        ]
        const colorTheme = createTheme(
          palette,
          isLight
            ? {
                ...lightTemplate,
                // light color themes are a bit less sensitive
                borderColor: 4,
                borderColorHover: 5,
                borderColorFocus: 3,
                borderColorPress: 3,
              }
            : darkTemplate
        )
        return [color, colorTheme]
      })
    ) as Record<ColorName, SubTheme>
  })

  const allColorThemes = addChildren(colorThemes, (colorName, colorTheme) => {
    const inverse = inverseColorThemes[colorName]
    return {
      ...getAltThemes(colorTheme, inverse),
      ...getComponentThemes(colorTheme, inverse),
    }
  })

  const baseActiveTheme = applyMask(colorThemes.blue, masks.weaker, {
    ...maskOptions,
    strength: 4,
  })

  const baseSubThemes = {
    ...getAltThemes(theme, inverseTheme, baseActiveTheme),
    ...getComponentThemes(theme, inverseTheme),
    Button: inverseTheme,
  }

  return {
    ...baseSubThemes,
    ...allColorThemes,
  }

  function getComponentThemes(theme: SubTheme, inverse: SubTheme) {
    const weaker1 = applyMask(theme, masks.weaker, maskOptions)
    const weaker2 = applyMask(weaker1, masks.weaker, maskOptions)
    const stronger1 = applyMask(theme, masks.stronger, maskOptions)
    const inverse1 = applyMask(inverse, masks.weaker, maskOptions)
    const inverse2 = applyMask(inverse1, masks.weaker, maskOptions)
    return {
      Card: weaker1,
      Button: weaker2,
      DrawerFrame: weaker1,
      SliderTrack: stronger1,
      SliderTrackActive: weaker2,
      SliderThumb: inverse1,
      Progress: weaker1,
      ProgressIndicator: inverse,
      Switch: weaker1,
      SwitchThumb: inverse2,
      TooltipArrow: weaker1,
      TooltipContent: weaker2,
      Input: stronger1,
      TextArea: stronger1,
    }
  }

  function getAltThemes(theme: SubTheme, inverse: SubTheme, activeTheme?: SubTheme) {
    const alt1 = applyMask(theme, masks.weaker, maskOptions)
    const alt2 = applyMask(alt1, masks.weaker, maskOptions)
    const active =
      activeTheme ??
      applyMask(theme, masks.weaker, {
        ...maskOptions,
        strength: 4,
      })
    return addChildren({ alt1, alt2, active }, (name, subTheme) => {
      return getComponentThemes(subTheme, subTheme === inverse ? theme : inverse)
    })
  }
})

export const themes = {
  ...allThemes,
  // bring back the full type, the rest use a subset to avoid clogging up ts,
  // tamagui will be smart and use the top level themes as the type for useTheme() etc
  light: createTheme(palettes.light, lightTemplate, { nonInheritedValues: lightColors }),
  dark: createTheme(palettes.dark, darkTemplate, { nonInheritedValues: darkColors }),
}
