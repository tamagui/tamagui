import type { ThemeProps } from 'tamagui'
import { Theme, useThemeName } from 'tamagui'

import { accentThemeName } from '../accentThemeName'
import { useHasAccent } from '../hooks/useHasAccent'
import { useThemeBuilderStore } from '../theme/store/ThemeBuilderStore'

export function useAccentTheme(): ThemeProps & { isInAccent?: boolean } {
  const rootStore = useThemeBuilderStore()
  const hasAccent = useHasAccent()
  const currentThemeName = useThemeName()
  const isInAccent = currentThemeName.includes(accentThemeName)

  if (hasAccent) {
    return {
      isInAccent,
      name: isInAccent ? 'surface3' : accentThemeName,
      inverse: isInAccent ? false : rootStore.demosOptions.inverseAccent,
    }
  }

  return {
    // name: currentThemeName,
  }
}

export function AccentTheme({ children }: { children: React.ReactNode }) {
  const { isInAccent, ...themeProps } = useAccentTheme()

  if (isInAccent) {
    return <>{children}</>
  }

  return <Theme {...themeProps}>{children}</Theme>
}
