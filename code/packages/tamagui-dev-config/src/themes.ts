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

const v6Themes = toV6Themes(selectedThemes)

// several names alias one object above, so keep that sharing through the edit
const softened = new Map<object, object>()

export const themes = Object.fromEntries(
  Object.entries(v6Themes).map(([themeName, theme]) => {
    let next = softened.get(theme)
    if (!next) {
      next = softenLightBorder(theme)
      softened.set(theme, next)
    }
    return [themeName, next]
  })
) as typeof v6Themes
