import type { ThemeState } from '../hooks/useThemeState'
import type { ThemeProps } from '../types'

export function ThemeDebug({
  themeState,
  themeProps,
  children,
}: {
  themeState: ThemeState
  themeProps: ThemeProps
  children: any
}) {
  // empty

  return children
}

ThemeDebug['displayName'] = 'ThemeDebug'
