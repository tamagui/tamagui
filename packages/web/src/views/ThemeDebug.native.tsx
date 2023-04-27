import { ChangedThemeResponse } from '../hooks/useTheme'
import { ThemeProps } from '../types'

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
