import { activeThemeManagers } from '@tamagui/web'
import type { ThemeDefinition } from '@tamagui/web'

import { _mutateTheme } from './_mutateTheme'

export function updateTheme({
  name,
  theme,
}: {
  name: string
  theme: Partial<Record<keyof ThemeDefinition, any>>
}) {
  return _mutateTheme({ name, theme, insertCSS: true, mutationType: 'update' })
}
