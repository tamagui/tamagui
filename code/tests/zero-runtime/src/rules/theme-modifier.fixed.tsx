import { createRoot } from 'react-dom/client'
import { Theme, View } from 'tamagui'

function ThemeModifierThemeValue() {
  return (
    <Theme background="#112233 dark:#445566">
      <View data-testid="zero-root" backgroundColor="$background" padding={24} />
    </Theme>
  )
}

createRoot(document.getElementById('root')!).render(<ThemeModifierThemeValue />)
