import { createRoot } from 'react-dom/client'
import { Theme, View } from 'tamagui'

// Rule 3. A direct theme value the compiler cannot evaluate.
const runtimeBackground = window.getComputedStyle(document.body).backgroundColor

function DynamicThemeValue() {
  return (
    <Theme background={runtimeBackground}>
      <View data-testid="zero-root" backgroundColor="$background" padding={24} />
    </Theme>
  )
}

createRoot(document.getElementById('root')!).render(<DynamicThemeValue />)
