import { MaskOptions } from '@tamagui/create-theme'

import { palettes } from './palettes'

export const { templates, maskOptions } = (() => {
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

  // templates use the palette and specify index
  // negative goes backwards from end so -1 is the last item
  const template = {
    ...templateColors,
    // the background, color, etc keys here work like generics - they make it so you
    // can publish components for others to use without mandating a specific color scale
    // the @tamagui/button Button component looks for `$background`, so you set the
    // dark_red_Button theme to have a stronger background than the dark_red theme.
    background: 2,
    backgroundHover: 3,
    backgroundPress: 4,
    backgroundFocus: 5,
    backgroundStrong: 1,
    backgroundTransparent: 0,
    color: -1,
    colorHover: -2,
    colorPress: -1,
    colorFocus: -2,
    colorTransparent: -0,
    borderColor: 5,
    borderColorHover: 6,
    borderColorFocus: 4,
    borderColorPress: 5,
    placeholderColor: -4,
  }

  const templates = {
    base: template,
    colorLight: {
      ...template,
      // light color themes are a bit less sensitive
      borderColor: 4,
      borderColorHover: 5,
      borderColorFocus: 4,
      borderColorPress: 4,
    },
  }

  const overrideShadows = {
    shadowColor: 0,
    shadowColorHover: 0,
    shadowColorPress: 0,
    shadowColorFocus: 0,
  }

  const overrideWithColors = {
    ...overrideShadows,
    color: 0,
    colorHover: 0,
    colorFocus: 0,
    colorPress: 0,
  }

  const baseMaskOptions: MaskOptions = {
    override: overrideShadows,
    skip: overrideShadows,
    // avoids the transparent ends
    max: palettes.light.length - 2,
    min: 1,
  }

  const skipShadowsAndColors = {
    ...overrideShadows,
    ...templateColors,
  }

  const maskOptions = {
    component: {
      ...baseMaskOptions,
      override: overrideWithColors,
      skip: skipShadowsAndColors,
    },
    alt: {
      ...baseMaskOptions,
    },
    button: {
      ...baseMaskOptions,
      override: {
        ...overrideWithColors,
        borderColor: 'transparent',
        borderColorHover: 'transparent',
      },
      skip: skipShadowsAndColors,
    },
  } satisfies Record<string, MaskOptions>

  return {
    templates,
    maskOptions,
  }
})()
