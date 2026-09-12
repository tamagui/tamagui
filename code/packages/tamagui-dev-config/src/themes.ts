import { toV6Themes } from '@tamagui/config/v6-base'
import { themes as v5Themes } from '@tamagui/themes/v5-subtle'
import { componentThemes, themeNames } from './themeMetadata'

const themeNameSet = new Set(themeNames)

// Keep the site's established v5 values while using the v3 theme-key grammar.
// Level aliases let the shared v6 demos render without changing the site pack.
const selectedThemes = Object.fromEntries(
  Object.entries(v5Themes).filter(([themeName]) => themeNameSet.has(themeName))
)

for (const [themeName, theme] of Object.entries(selectedThemes)) {
  if (themeName.endsWith('_surface1')) {
    selectedThemes[themeName.replace(/_surface1$/, '_level2')] = theme
  } else if (themeName.endsWith('_surface2')) {
    selectedThemes[themeName.replace(/_surface2$/, '_level3')] = theme
  } else if (themeName.endsWith('_accent')) {
    // v5 shipped no accent surface subthemes, and its lookup stayed on the
    // active parent when one was missing. A nested level Theme (Button wraps
    // level2) must keep the accent palette the same way, so the level names
    // alias the accent theme itself.
    selectedThemes[`${themeName}_level2`] = theme
    selectedThemes[`${themeName}_level3`] = theme
  }
}

// `brand` is the loudest surface in the v3 grammar, and the convention is that
// it inverses: a brand button, checked switch or tooltip on a light page is
// near-black with light text, the same trade shadcn makes for its primary. it
// stays neutral under a tinted parent, so the two scheme roots are enough. the
// bold scale does not nest, so its levels alias it rather than walking back
// toward the page.
for (const scheme of ['light', 'dark']) {
  const inverse = selectedThemes[scheme === 'light' ? 'dark' : 'light']
  selectedThemes[`${scheme}_brand`] = inverse
  selectedThemes[`${scheme}_brand_level2`] = inverse
  selectedThemes[`${scheme}_brand_level3`] = inverse
}

// V5's component-theme lookup stays on the active parent theme when a more
// specific component subtheme does not exist. Materialize those fallback
// names so a V3 nested Theme resolves identically instead of jumping back to
// the root component theme.
for (const themeName of themeNames) {
  const component = componentThemes.find((name) => themeName.endsWith(`_${name}`))
  if (!component || selectedThemes[themeName]) continue
  const parentName = themeName.slice(0, -(component.length + 1))
  if (selectedThemes[parentName]) {
    selectedThemes[themeName] = selectedThemes[parentName]
  }
}

// V5's light gray ramp puts `border-color` on color4, twelve lightness points
// below a 97% background, so every card, input and code block on the site is
// outlined in #d9d9d9. Colored light themes already sit within six points of
// their background and read fine, so rather than repaint the pack, cap how far
// a light theme's border may fall below its own background. Dark themes are
// left alone: a border there has to climb away from the background to show up.
const MAX_LIGHT_BORDER_GAP = 8

const hsla = /^hsla\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*,\s*([\d.]+)\s*\)$/

const softenLightBorder = <Theme extends Record<string, any>>(theme: Theme): Theme => {
  const background = hsla.exec(theme.background)
  const border = hsla.exec(theme['border-color'])
  if (!background || !border) return theme

  const backgroundLightness = Number(background[3])
  const borderLightness = Number(border[3])
  if (backgroundLightness <= 50) return theme

  const gap = backgroundLightness - borderLightness
  if (gap <= MAX_LIGHT_BORDER_GAP) return theme

  const lightness = backgroundLightness - MAX_LIGHT_BORDER_GAP
  return {
    ...theme,
    'border-color': `hsla(${border[1]}, ${border[2]}%, ${lightness}%, ${border[4]})`,
  }
}

// V5's neutral light ramp is 100 97 93 85 80 70 59 45, so it drops eight
// lightness points from color3 to color4 where the steps on either side move
// four and five. Everything sitting on that step reads two steps off the page
// instead of one: the default button fill, table cells, code block backgrounds,
// component preview blocks. 88% is the value that puts the sequence back in
// order (3 4 5 8 10 11 14) and it leaves color5 where it already is.
//
// Only the neutral family has this. Every tinted light theme already steps
// evenly, and `light_gray` uses 85% at color6 legitimately, so the palette has
// to be identified before substituting. Sub-themes carry no ramp, only resolved
// values, which is why this matches on the value rather than on `color-4`:
// inside this one palette, 85% always means the fourth step of the ramp.
const NEUTRAL_STEP_4 = 'hsla(0, 0%, 85%, 1)'
const NEUTRAL_STEP_4_LIFTED = 'hsla(0, 0%, 88%, 1)'
const tintNames = ['gray', 'blue', 'red', 'yellow', 'green']

const v6Themes = toV6Themes(selectedThemes)

// Membership is decided per object, not per name, because several names share
// one object and they all have to move together: `dark_brand` IS the light
// palette (brand inverses), so splitting them would emit a second copy of every
// selector into the render-blocking stylesheet and leave the two disagreeing.
//
// The name is only how the set is seeded. A light-named theme that resolves to a
// dark fill never gets in, which is what keeps `light_brand` (85% is an accent)
// and `light_Tooltip` (85% is the text color) out.
const neutralLightPalette = new Set<object>()
for (const [themeName, theme] of Object.entries(v6Themes)) {
  const parts = themeName.split('_')
  if (parts[0] !== 'light' || parts.some((part) => tintNames.includes(part))) continue
  const background = hsla.exec(theme.background)
  if (background && Number(background[3]) > 50) neutralLightPalette.add(theme)
}

const liftNeutralStep4 = <Theme extends Record<string, any>>(theme: Theme): Theme => {
  if (!neutralLightPalette.has(theme)) return theme
  let next: Theme | undefined
  for (const key of Object.keys(theme)) {
    if (theme[key] !== NEUTRAL_STEP_4) continue
    next ??= { ...theme }
    next[key as keyof Theme] = NEUTRAL_STEP_4_LIFTED as Theme[keyof Theme]
  }
  return next ?? theme
}

// several names alias one object above, so keep that sharing through the edit
const edited = new Map<object, object>()

export const themes = Object.fromEntries(
  Object.entries(v6Themes).map(([themeName, theme]) => {
    let next = edited.get(theme)
    if (!next) {
      next = softenLightBorder(liftNeutralStep4(theme))
      edited.set(theme, next)
    }
    return [themeName, next]
  })
) as typeof v6Themes
