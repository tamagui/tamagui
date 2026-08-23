import { createRoot } from 'react-dom/client'
import { View } from 'tamagui'
import { ThemeUpdate } from 'tamagui/theme-update'

function ThemeModifierThemeValue() {
  return (
    <ThemeUpdate background="#112233 dark:#445566">
      <View data-testid="zero-root" backgroundColor="$background" padding={24} />
    </ThemeUpdate>
  )
}

createRoot(document.getElementById('root')!).render(<ThemeModifierThemeValue />)
