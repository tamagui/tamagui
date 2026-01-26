import type { BuildTemplates } from '@tamagui/theme-builder'

const objectFromEntries = <const T extends readonly (readonly [string, any])[]>(
  entries: T
): { [K in T[number] as K[0]]: K[1] } => {
  return Object.fromEntries(entries) as any
}

const objectKeys = <O extends object>(obj: O): (keyof O)[] => {
  return Object.keys(obj) as (keyof O)[]
}

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

  const baseColors = {
    color: -bgIndex,
    colorHover: -bgIndex - 1,
    colorPress: -bgIndex,
    colorFocus: -bgIndex - 1,
    placeholderColor: -bgIndex - 3,
    outlineColor: -2,
  }

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
    // hover lightens in both light/dark modes (towards background)
    backgroundHover: bgIndex + lighten * 2,
    // press darkens in both modes (towards foreground)
    backgroundPress: bgIndex + darken * 2,
    // focus: darken in dark mode, stay same in light
    backgroundFocus: bgIndex + (isLight ? 0 : darken),
    backgroundActive: bgIndex + darken * 3,
    borderColor,
    borderColorHover: borderColor + lighten,
    borderColorPress: borderColor + darken,
    borderColorFocus: borderColor,
    ...baseColors,
    colorTransparent: -1,
  }

  // helper for surface themes - they need their own hover/press/focus calculations
  // because those need to be relative to their elevated background, not base
  const makeSurface = (offset: number) => {
    const bg = base.background + offset
    return {
      ...baseColors,
      background: bg,
      // hover lightens (towards background)
      backgroundHover: bg + lighten,
      // press darkens (towards foreground)
      backgroundPress: bg + darken,
      // focus: darken in dark mode, stay same in light
      backgroundFocus: bg + (isLight ? 0 : darken),
      backgroundActive: bg + darken * 2,
      borderColor: base.borderColor + offset,
      borderColorHover: base.borderColor + offset + lighten,
      borderColorFocus: base.borderColor + offset,
      borderColorPress: base.borderColor + offset + darken,
    }
  }

  const surface1 = makeSurface(1)
  const surface2 = makeSurface(2)
  const surface3 = makeSurface(3)

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

export const v5Templates = getTemplates()
