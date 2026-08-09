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
    const schemeName = parentName.startsWith('dark') ? 'dark' : 'light'
    const isLevelTheme = parentName.endsWith('_level2') || parentName.endsWith('_level3')
    const schemeComponentTheme = selectedThemes[`${schemeName}_${component}`]
    selectedThemes[themeName] =
      isLevelTheme && schemeComponentTheme
        ? schemeComponentTheme
        : selectedThemes[parentName]
  }
}

export const themes = toV6Themes(selectedThemes)
