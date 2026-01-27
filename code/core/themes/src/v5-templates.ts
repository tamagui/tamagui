import { PALETTE_BACKGROUND_OFFSET, type BuildTemplates } from '@tamagui/theme-builder'

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

  // our palettes have PALETTE_BACKGROUND_OFFSET things padding each end until you get to bg/color:
  // [accentBg, transparent1, transparent2, transparent3, transparent4, background, ...]
  const lighten = isLight ? -1 : 1
  const darken = -lighten

  // base
  const background = PALETTE_BACKGROUND_OFFSET
  const borderColor = background + 3
  const color = -background

  const baseColors = {
    color,
    colorHover: color + (isLight ? 0 : lighten),
    colorPress: color,
    colorFocus: color + darken,
    placeholderColor: color - 3,
    outlineColor: -2, // opacity
  }

  // const getGenerics = (type: 'base' | 'above-base') => {
  //   // at base we have no "room" to lighten from light theme
  //   const adjustDynamic = type === 'base' ? (isLight ? darken : lighten) : lighten

  //   return {
  //     // the background, color, etc keys here work like generics - they make it so you
  //     // can publish components for others to use without mandating a specific color scale
  //     // the @tamagui/button Button component looks for `$background`, so you set the
  //     // dark_red_Button theme to have a stronger background than the dark_red theme.
  //     background: bgIndex,
  //     // hover lightens in both light/dark modes (towards background)
  //     backgroundHover: bgIndex + adjustDynamic,
  //     // press darkens in both modes (towards foreground)
  //     backgroundPress: bgIndex + darken,
  //     // focus: darken in dark mode, stay same in light
  //     backgroundFocus: bgIndex + darken,
  //     backgroundActive: bgIndex,
  //     borderColor,
  //     borderColorHover: borderColor + lighten,
  //     borderColorPress: borderColor + darken,
  //     borderColorFocus: borderColor,
  //   }
  // }

  // helper for surface themes - they need their own hover/press/focus calculations
  // because those need to be relative to their elevated background, not base
  const makeSurface = (offset: number) => {
    const clr = color - 1
    const bg = background + offset
    const brdr = borderColor + offset

    return {
      color: clr,
      colorHover: clr + (isLight ? 0 : lighten),
      colorPress: clr,
      colorFocus: clr + darken,

      background: bg,
      // hover lightens always
      backgroundHover: bg + lighten,
      // press darkens always
      backgroundPress: bg + darken,
      // focus: lightens in dark mode, darkens in light
      backgroundFocus: bg + offset,
      backgroundActive: bg,

      borderColor: brdr,
      borderColorHover: brdr + lighten,
      borderColorFocus: brdr,
      borderColorPress: brdr + darken,
    }
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
    color1: background,
    color2: background + 1,
    color3: background + 2,
    color4: background + 3,
    color5: background + 4,
    color6: background + 5,
    color7: background + 6,
    color8: background + 7,
    color9: background + 8,
    color10: background + 9,
    color11: background + 10,
    color12: background + 11,
    color0: -1,
    color02: -2,
    color04: -3,
    color06: -4,
    color08: -5,
    // v5 = we make this actually 1 up (surface1 technically from before)
    // this way "generics" are automatically differentiated from base bg
    ...makeSurface(1),
    // but we keep stronger base color
    ...baseColors,
    colorTransparent: -1,
  }

  const surface1 = makeSurface(2)
  const surface2 = makeSurface(3)

  const accent = Object.fromEntries(
    Object.entries(base).map(([key, index]) => {
      return [key, -index]
    })
  )

  return {
    base,
    surface1,
    surface2,
    accent,
  } satisfies BuildTemplates
}

export const v5Templates = getTemplates()
