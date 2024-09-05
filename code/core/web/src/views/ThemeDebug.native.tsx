import type { ChangedThemeResponse } from '../hooks/useTheme'
import type { ThemeProps } from '../types'

export function ThemeDebug({
  themeState,
  themeProps,
  children,
}: {
  themeState: ChangedThemeResponse
  themeProps: ThemeProps
  children: any
}) {
  // empty

  return children
}

ThemeDebug['displayName'] = 'ThemeDebug'
