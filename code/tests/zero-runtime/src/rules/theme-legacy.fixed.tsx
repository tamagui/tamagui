import { createRoot } from 'react-dom/client'
import { View } from 'tamagui'
import { ThemeUpdate } from 'tamagui/theme-update'

function ThemeUpdateValue() {
  return (
    <ThemeUpdate background="#123456">
      <View data-testid="zero-root" backgroundColor="$background" padding={24} />
    </ThemeUpdate>
  )
}

createRoot(document.getElementById('root')!).render(<ThemeUpdateValue />)
