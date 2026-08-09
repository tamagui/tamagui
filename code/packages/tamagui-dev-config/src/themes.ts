import { toV6Themes } from '@tamagui/config/v6-base'
import { themes as v5Themes } from '@tamagui/themes/v5-subtle'
import { themeNames } from './themeMetadata'

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

export const themes = toV6Themes(selectedThemes)
