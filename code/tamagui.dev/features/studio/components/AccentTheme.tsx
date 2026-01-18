import type { ThemeProps } from 'tamagui'
import { Theme, useThemeName } from 'tamagui'

import { accentThemeName } from '../accentThemeName'
import { useHasAccent } from '../hooks/useHasAccent'

export function useAccentTheme(): ThemeProps & { isInAccent?: boolean } {
  const hasAccent = useHasAccent()
  const currentThemeName = useThemeName()
  const isInAccent = currentThemeName.includes(accentThemeName)

  if (hasAccent) {
    return {
      isInAccent,
      name: isInAccent ? 'accent' : accentThemeName,
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
