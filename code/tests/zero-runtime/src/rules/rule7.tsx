import { createRoot } from 'react-dom/client'
import { Text, useTheme, View } from 'tamagui'

// Rule 7. A JavaScript read of design state has no build-time value.
function Rule7() {
  const theme = useTheme()
  return (
    <View data-testid="zero-root" padding={24}>
      <Text data-testid="zero-text">{theme.background?.val}</Text>
    </View>
  )
}

createRoot(document.getElementById('root')!).render(<Rule7 />)
