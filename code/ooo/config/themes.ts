import { createThemeBuilder } from '@tamagui/theme-builder'
import { defaultTemplates } from '@tamagui/themes/v3-themes'
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

const themeBuilder = createThemeBuilder()
  .addPalettes(palettes)
  .addTemplates(defaultTemplates)
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
  .addChildThemes({
    alt1: {
      template: 'alt1',
    },
    alt2: {
      template: 'alt2',
    },
  })
// no need for componet themes for us
// .addComponentThemes(defaultComponentThemes, {
//   avoidNestingWithin: ['alt1', 'alt2'],
// })

// --- themes ---

const themesIn = themeBuilder.build()

type ThemeKeys =
  | keyof typeof defaultTemplates.light_base
  | keyof typeof nonInherited.light

export type Theme = Record<ThemeKeys, string>

export type ThemesOut = Record<keyof typeof themesIn, Theme>

export const themes = themesIn as any as ThemesOut
