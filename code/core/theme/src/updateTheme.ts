import type { ThemeDefinition, ThemeName } from '@tamagui/web'

import { _mutateTheme } from './_mutateTheme'

export function updateTheme({
  name,
  theme,
}: {
  name: ThemeName | (string & {})
  theme: Partial<Record<keyof ThemeDefinition, any>>
}) {
  return _mutateTheme({ name, theme, insertCSS: true, mutationType: 'update' })
}
