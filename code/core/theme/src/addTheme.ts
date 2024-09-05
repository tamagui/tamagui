import type { ThemeDefinition, ThemeParsed } from '@tamagui/web'

import { _mutateTheme } from './_mutateTheme'

export function addTheme(props: {
  name: string
  theme: Partial<Record<keyof ThemeDefinition, any>>
  insertCSS?: boolean
}) {
  return _mutateTheme({ ...props, insertCSS: true, mutationType: 'add' })
}
