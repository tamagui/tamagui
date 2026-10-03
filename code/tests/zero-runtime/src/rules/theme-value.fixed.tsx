import { createRoot } from 'react-dom/client'
import { ThemeUpdate, View } from 'tamagui'

function StaticThemeValue() {
  return (
    <ThemeUpdate background="#123456">
      <View data-testid="zero-root" backgroundColor="$background" padding={24} />
    </ThemeUpdate>
  )
}

createRoot(document.getElementById('root')!).render(<StaticThemeValue />)
