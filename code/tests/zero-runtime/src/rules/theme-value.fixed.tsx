import { createRoot } from 'react-dom/client'
import { Theme, View } from 'tamagui'

function StaticThemeValue() {
  return (
    <Theme background="#123456">
      <View data-testid="zero-root" backgroundColor="$background" padding={24} />
    </Theme>
  )
}

createRoot(document.getElementById('root')!).render(<StaticThemeValue />)
