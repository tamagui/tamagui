import { addTheme } from './addTheme'
import { activeThemeManagers } from './hooks/useTheme'
import { ThemeDefinition } from './types'

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
