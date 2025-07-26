import { useThemeName } from '@tamagui/ui'

import { themeBuilderStore } from '../store/ThemeBuilderStore'
import type { BuildTheme } from '../types'

export function usePalettesForTheme(theme?: BuildTheme) {
  const isDark = useThemeName().startsWith('dark')
  if (theme) {
    const palettes = themeBuilderStore.getPalettesForTheme(theme)
    return {
      ...palettes,
      active: isDark ? palettes.dark : palettes.light,
    }
  }
}
