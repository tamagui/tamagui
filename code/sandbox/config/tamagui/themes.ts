import { createThemeBuilder } from '@tamagui/theme-builder'
import {
  darkColors,
  darkShadowColor,
  darkShadowColorStrong,
  lightColors,
  lightShadowColor,
  lightShadowColorStrong,
  palettes,
} from './colors'

const shadows = {
  light: {
    shadowColor: lightShadowColor,
    shadowColorStrong: lightShadowColorStrong,
  },
  dark: {
    shadowColor: darkShadowColor,
    shadowColorStrong: darkShadowColorStrong,
  },
}

const nonInherited = {
  light: {
    ...lightColors,
    ...shadows.light,
  },
  dark: {
    ...darkColors,
    ...shadows.dark,
  },
}

// --- themeBuilder ---

const templates = {
  base: {
    accentBackground: 0,
    accentColor: -0,

    background0: 1,
    background025: 2,
    background05: 3,
    background075: 4,
    color1: 5,
    color2: 6,
    color3: 7,
    color4: 8,
    color5: 9,
    color6: 10,
    color7: 11,
    color8: 12,
    color9: 13,
    color10: 14,
    color11: 15,
    color12: 16,
    color13: 17,
    color0: -1,
    color025: -2,
    color05: -3,
    color075: -4,

    color: 17,
    background: 4,
    borderColor: 6,
  },
}

const themeBuilder = createThemeBuilder()
  .addPalettes(palettes)
  .addTemplates(templates)
  .addThemes({
    light: {
      template: 'base',
      palette: 'light',
      nonInheritedValues: nonInherited.light,
    },
    dark: {
      template: 'base',
      palette: 'dark',
      nonInheritedValues: nonInherited.dark,
    },
  })
  .addChildThemes({
    gray: {
      palette: 'gray',
      template: 'base',
    },
    yellow: {
      palette: 'yellow',
      template: 'base',
    },
  })
// no need for componet themes for us
// .addComponentThemes(defaultComponentThemes, {
//   avoidNestingWithin: ['alt1', 'alt2'],
// })

// --- themes ---

const themesIn = themeBuilder.build()

type ThemeKeys = keyof typeof templates.base | keyof typeof nonInherited.light

export type Theme = Record<ThemeKeys, string>

export type ThemesOut = Record<keyof typeof themesIn, Theme>

export const themes = themesIn as any as ThemesOut
