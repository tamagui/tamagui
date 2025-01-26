import { objectFromEntries, objectKeys } from './helpers'
import type { BuildTemplates } from './types'

const getTemplates = () => {
  const lightTemplates = getBaseTemplates('light')
  const darkTemplates = getBaseTemplates('dark')
  const templates = {
    ...objectFromEntries(
      objectKeys(lightTemplates).map(
        (name) => [`light_${name}`, lightTemplates[name]] as const
      )
    ),
    ...objectFromEntries(
      objectKeys(darkTemplates).map(
        (name) => [`dark_${name}`, darkTemplates[name]] as const
      )
    ),
  }
  return templates as Record<keyof typeof templates, typeof lightTemplates.base>
}

const getBaseTemplates = (scheme: 'dark' | 'light') => {
  const isLight = scheme === 'light'

  // our palettes have 4 things padding each end until you get to bg/color:
  // [accentBg, transparent1, transparent2, transparent3, transparent4, background, ...]
  const bgIndex = 6
  const lighten = isLight ? -1 : 1
  const darken = -lighten
  const borderColor = bgIndex + 3

  // templates use the palette and specify index
  // negative goes backwards from end so -1 is the last item
  const base = {
    accentBackground: 0,
    accentColor: -0,

    background0: 1,
    background02: 2,
    background04: 3,
    background06: 4,
    background08: 5,
    color1: bgIndex,
    color2: bgIndex + 1,
    color3: bgIndex + 2,
    color4: bgIndex + 3,
    color5: bgIndex + 4,
    color6: bgIndex + 5,
    color7: bgIndex + 6,
    color8: bgIndex + 7,
    color9: bgIndex + 8,
    color10: bgIndex + 9,
    color11: bgIndex + 10,
    color12: bgIndex + 11,
    color0: -1,
    color02: -2,
    color04: -3,
    color06: -4,
    color08: -5,
    // the background, color, etc keys here work like generics - they make it so you
    // can publish components for others to use without mandating a specific color scale
    // the @tamagui/button Button component looks for `$background`, so you set the
    // dark_red_Button theme to have a stronger background than the dark_red theme.
    background: bgIndex,
    backgroundHover: bgIndex + lighten, // always lighten on hover no matter the scheme
    backgroundPress: bgIndex + darken, // always darken on press no matter the theme
    backgroundFocus: bgIndex + darken,
    borderColor,
    borderColorHover: borderColor + lighten,
    borderColorPress: borderColor + darken,
    borderColorFocus: borderColor,
    color: -bgIndex,
    colorHover: -bgIndex - 1,
    colorPress: -bgIndex,
    colorFocus: -bgIndex - 1,
    colorTransparent: -1,
    placeholderColor: -bgIndex - 3,
    outlineColor: -2,
  }

  const surface1 = {
    background: base.background + 1,
    backgroundHover: base.backgroundHover + 1,
    backgroundPress: base.backgroundPress + 1,
    backgroundFocus: base.backgroundFocus + 1,
    borderColor: base.borderColor + 1,
    borderColorHover: base.borderColorHover + 1,
    borderColorFocus: base.borderColorFocus + 1,
    borderColorPress: base.borderColorPress + 1,
  }

  const surface2 = {
    background: base.background + 2,
    backgroundHover: base.backgroundHover + 2,
    backgroundPress: base.backgroundPress + 2,
    backgroundFocus: base.backgroundFocus + 2,
    borderColor: base.borderColor + 2,
    borderColorHover: base.borderColorHover + 2,
    borderColorFocus: base.borderColorFocus + 2,
    borderColorPress: base.borderColorPress + 2,
  }

  const surface3 = {
    background: base.background + 3,
    backgroundHover: base.backgroundHover + 3,
    backgroundPress: base.backgroundPress + 3,
    backgroundFocus: base.backgroundFocus + 3,
    borderColor: base.borderColor + 3,
    borderColorHover: base.borderColorHover + 3,
    borderColorFocus: base.borderColorFocus + 3,
    borderColorPress: base.borderColorPress + 3,
  }

  const alt1 = {
    color: base.color - 1,
    colorHover: base.colorHover - 1,
    colorPress: base.colorPress - 1,
    colorFocus: base.colorFocus - 1,
  }

  const alt2 = {
    color: base.color - 2,
    colorHover: base.colorHover - 2,
    colorPress: base.colorPress - 2,
    colorFocus: base.colorFocus - 2,
  }

  const inverse = Object.fromEntries(
    Object.entries(base).map(([key, index]) => {
      return [key, -index]
    })
  )

  return {
    base,
    surface1,
    surface2,
    surface3,
    alt1,
    alt2,
    inverse,
  } satisfies BuildTemplates
}

export const defaultTemplates = getTemplates()
