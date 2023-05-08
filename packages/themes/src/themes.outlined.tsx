import {
  MaskOptions,
  addChildren,
  applyMask,
  createStrengthenMask,
  createTheme,
  createWeakenMask,
  skipMask,
} from '@tamagui/create-theme'

import { colorTokens, darkColors, lightColors, tokens } from './tokens'

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

const templateColors = {
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

const templateShadows = {
  shadowColor: 1,
  shadowColorHover: 1,
  shadowColorPress: 2,
  shadowColorFocus: 2,
}

// we can use subset of our template as a "override" so it doesn't get adjusted with masks
// we want to skip over templateColor + templateShadows
const toSkip = {
  ...templateShadows,
}

const override = Object.fromEntries(Object.entries(toSkip).map(([k]) => [k, 0]))
const overrideShadows = Object.fromEntries(
  Object.entries(templateShadows).map(([k]) => [k, 0])
)
const overrideWithColors = {
  ...override,
  color: 0,
  colorHover: 0,
  colorFocus: 0,
  colorPress: 0,
}

// templates use the palette and specify index
// negative goes backwards from end so -1 is the last item
const template = {
  ...templateColors,
  ...toSkip,
  // the background, color, etc keys here work like generics - they make it so you
  // can publish components for others to use without mandating a specific color scale
  // the @tamagui/button Button component looks for `$background`, so you set the
  // dark_red_Button theme to have a stronger background than the dark_red theme.
  background: 1,
  backgroundHover: 1,
  backgroundPress: 1,
  backgroundFocus: 1,
  backgroundStrong: 1,
  backgroundTransparent: 0,
  color: -1,
  colorHover: -2,
  colorPress: -1,
  colorFocus: -2,
  colorTransparent: -0,
  borderColor: 8,
  borderColorHover: 9,
  borderColorPress: 7,
  borderColorFocus: 6,
  placeholderColor: -4,
}

const lightTemplate = {
  ...template,

  background: 2,
  backgroundHover: 3,
  backgroundPress: 4,

  // our light color palette is... a bit unique
  borderColor: 10,
  borderColorHover: 9,
  borderColorFocus: 8,
  borderColorPress: 7,
}

const darkTemplate = { ...template }

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
  skip: skipMask,
  weaker: createWeakenMask(),
  stronger: createStrengthenMask(),
}

// default mask options for most uses
const maskOptions: MaskOptions = {
  override,
  skip: toSkip,
  // avoids the transparent ends
  max: palettes.light.length - 2,
  min: 1,
}

const transparent = (hsl: string, opacity = 0) =>
  hsl.replace(`%)`, `%, ${opacity})`).replace(`hsl(`, `hsla(`)

// setup colorThemes and their inverses
const [lightColorThemes, darkColorThemes] = [colorTokens.light, colorTokens.dark].map(
  (colorSet, i) => {
    const isLight = i === 0
    const theme = baseThemes[isLight ? 'light' : 'dark']

    return Object.fromEntries(
      Object.keys(colorSet).map((color) => {
        const colorPalette = Object.values(colorSet[color]) as string[]
        // were re-ordering these
        const [head, tail] = [
          colorPalette.slice(0, 4),
          colorPalette.slice(colorPalette.length - 7),
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
                borderColorFocus: 4,
                borderColorPress: 4,
              }
            : darkTemplate
        )

        return [color, colorTheme]
      })
    ) as Record<ColorName, SubTheme>
  }
)

const allThemes = addChildren(baseThemes, (name, theme) => {
  const isLight = name === 'light'
  const inverseName = isLight ? 'dark' : 'light'
  const inverseTheme = baseThemes[inverseName]
  const colorThemes = isLight ? lightColorThemes : darkColorThemes
  const inverseColorThemes = isLight ? darkColorThemes : lightColorThemes

  const allColorThemes = addChildren(colorThemes, (colorName, colorTheme) => {
    const inverse = inverseColorThemes[colorName]
    return {
      ...getAltThemes({
        theme: colorTheme,
        inverse,
        isLight,
      }),
    }
  })

  const baseSubThemes = {
    ...getAltThemes({ theme, inverse: inverseTheme, isLight }),
  }

  return {
    ...baseSubThemes,
    ...allColorThemes,
  }
})

function getAltThemes({
  theme,
  inverse,
  isLight,
  activeTheme,
}: {
  theme: SubTheme
  inverse: SubTheme
  isLight: boolean
  activeTheme?: SubTheme
}) {
  const maskOptionsAlt = {
    ...maskOptions,
    override: overrideShadows,
  }
  const alt1 = applyMask(theme, masks.weaker, maskOptionsAlt)
  const alt2 = applyMask(alt1, masks.weaker, maskOptionsAlt)

  const active =
    activeTheme ??
    (process.env.ACTIVE_THEME_INVERSE
      ? inverse
      : (() => {
          return applyMask(theme, masks.weaker, {
            ...maskOptions,
            strength: 3,
            skip: {
              ...maskOptions.skip,
              color: 1,
            },
          })
        })())

  return { alt1, alt2, active }
}

export const themes = {
  ...allThemes,
  // bring back the full type, the rest use a subset to avoid clogging up ts,
  // tamagui will be smart and use the top level themes as the type for useTheme() etc
  light: createTheme(palettes.light, lightTemplate, { nonInheritedValues: lightColors }),
  dark: createTheme(palettes.dark, darkTemplate, { nonInheritedValues: darkColors }),
}

// if (process.env.NODE_ENV === 'development') {
//   console.log(JSON.stringify(themes).length)
// }
