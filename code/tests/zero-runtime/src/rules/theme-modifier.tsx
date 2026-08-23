import { createRoot } from 'react-dom/client'
import { View } from 'tamagui'
import { ThemeUpdate } from 'tamagui/theme-update'

// Rule 3. An element modifier cannot describe a subtree-wide theme value: there
// is no hovered subtree, only a hovered element.
function ElementModifierThemeValue() {
  return (
    <ThemeUpdate background="#112233 hover:#445566">
      <View data-testid="zero-root" backgroundColor="$background" padding={24} />
    </ThemeUpdate>
  )
}

createRoot(document.getElementById('root')!).render(<ElementModifierThemeValue />)
