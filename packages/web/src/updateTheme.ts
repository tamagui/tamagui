import { addTheme } from './addTheme.js'
import { activeThemeManagers } from './hooks/useTheme.js'
import type { ThemeDefinition } from './types.js'

/** @deprecated import from @tamagui/theme instead */
export function updateTheme({
  name,
  theme,
}: {
  name: string
  theme: Partial<Record<keyof ThemeDefinition, any>>
}) {
  const next = addTheme({ name, theme, insertCSS: true, update: true })

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
