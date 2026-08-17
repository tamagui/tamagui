import { createRoot } from 'react-dom/client'
import { Text, View } from 'tamagui'
import { countSpaceTokens } from './opaqueDesignState'

function NegativeControl() {
  return (
    <View data-testid="zero-root" padding={24}>
      <Text data-testid="zero-text">space tokens: {countSpaceTokens()}</Text>
    </View>
  )
}

createRoot(document.getElementById('root')!).render(<NegativeControl />)
