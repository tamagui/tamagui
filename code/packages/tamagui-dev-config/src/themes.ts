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

// Each neutral ramp breaks once. Light runs 100 97 93 85 80 70 59 45 and drops
// eight lightness points at step 4 where the steps on either side move four and
// five. Dark runs 4 8 10 14 20 27 40 47 and jumps 13.9 in CIE L* at step 7 where
// its neighbours move 8.0 and 7.2. Both are a break inside a band rather than
// between two, so whatever sits on them reads a step further from the page than
// it should: in light the default button fill, table cells, code blocks and
// preview blocks, in dark the hover borders and focus fills.
//
// 88% and 36% put each sequence back in order without moving the step after it.
//
// The substitution is by value across the whole theme rather than by key or by
// name, for three reasons. Sub-themes carry resolved values and no ramp at all,
// so there is no `color-4` on `light_Button` to match. Every root carries BOTH
// ramps, the opposite scheme's under `accent-*`. And the accent theme swaps them
// again, so `light_accent` holds the dark ramp under `color-*`. Keying on the
// name missed the last two and left `dark.accent-4` disagreeing with
// `light.color-4` about the same step.
//
// Inside the non-tinted family each of these two strings has exactly one
// meaning. Gray is desaturated like the neutrals and genuinely collides
// (`light_gray` uses 85% at color6), so tinted themes come out first.
const neutralRampFixes = [
  ['hsla(0, 0%, 85%, 1)', 'hsla(0, 0%, 88%, 1)'],
  ['hsla(0, 0%, 40%, 1)', 'hsla(0, 0%, 36%, 1)'],
] as const
const tintNames = ['gray', 'blue', 'red', 'yellow', 'green']

const v6Themes = toV6Themes(selectedThemes)

// Exclusion is held per object, not per name, because several names share one
// object: `dark_brand` IS the light palette and `light_brand` IS the dark one.
// Deciding per name split those objects in two, and the generated CSS emitted a
// second copy of every `.t_dark_brand*` selector with the two copies disagreeing.
// Any object a tinted name points to is out, whichever name reaches it first.
const tinted = new Set<object>()
for (const [themeName, theme] of Object.entries(v6Themes)) {
  if (themeName.split('_').some((part) => tintNames.includes(part))) tinted.add(theme)
}

const smoothNeutralRamps = <Theme extends Record<string, any>>(theme: Theme): Theme => {
  if (tinted.has(theme)) return theme
  let next: Theme | undefined
  for (const key of Object.keys(theme)) {
    const fix = neutralRampFixes.find(([from]) => theme[key] === from)
    if (!fix) continue
    next ??= { ...theme }
    next[key as keyof Theme] = fix[1] as Theme[keyof Theme]
  }
  return next ?? theme
}

// several names alias one object above, so keep that sharing through the edit
const edited = new Map<object, object>()

// the ramps are smoothed first. softenLightBorder derives a capped border from
// the background, and on a 93% surface that cap lands on 85% itself, so running
// it first would hand its own output back to the substitution and pull those
// borders three points off the cap.
export const themes = Object.fromEntries(
  Object.entries(v6Themes).map(([themeName, theme]) => {
    let next = edited.get(theme)
    if (!next) {
      next = softenLightBorder(smoothNeutralRamps(theme))
      edited.set(theme, next)
    }
    return [themeName, next]
  })
) as typeof v6Themes
