import { createRoot } from 'react-dom/client'
import { View } from 'tamagui'
import { ThemeUpdate } from 'tamagui/theme-update'

// Rule 3. A direct theme value the compiler cannot evaluate.
const runtimeBackground = window.getComputedStyle(document.body).backgroundColor

function DynamicThemeValue() {
  return (
    <ThemeUpdate background={runtimeBackground}>
      <View data-testid="zero-root" backgroundColor="$background" padding={24} />
    </ThemeUpdate>
  )
}

createRoot(document.getElementById('root')!).render(<DynamicThemeValue />)
