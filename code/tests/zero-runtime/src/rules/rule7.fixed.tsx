import { createRoot } from 'react-dom/client'
import { Text, View } from 'tamagui'

function Rule7Fixed() {
  return (
    <View data-testid="zero-root" padding={24}>
      <Text data-testid="zero-text" color="$background">
        static
      </Text>
    </View>
  )
}

createRoot(document.getElementById('root')!).render(<Rule7Fixed />)
