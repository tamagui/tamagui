import { activeThemeManagers } from '@tamagui/web'
import type { ThemeDefinition } from '@tamagui/web'

import { _mutateTheme } from './_mutateTheme.js'

export function replaceTheme({
  name,
  theme,
}: {
  name: string
  theme: Partial<Record<keyof ThemeDefinition, any>>
}) {
  const next = _mutateTheme({ name, theme, insertCSS: true, mutationType: 'replace' })

  if (process.env.TAMAGUI_TARGET === 'native') {
    activeThemeManagers.forEach((manager) => {
      if (manager.state.name === name) {
        manager.updateState({
          name,
          forceTheme: next.theme,
        })
      }
    })
  }

  return next
}
