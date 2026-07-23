import { useState } from 'react'
import { TamaguiProvider, YStack } from 'tamagui'
import config from '../tamagui.config'
// the installed registry item — the copy-paste output, unmodified.
import { Button } from '../components/tamagui/Button'

// interaction smoke on native: pressing the installed Button fires onPress and
// updates a visible press count. mirrors the web smoke behavior.
export function App() {
  const [count, setCount] = useState(0)
  return (
    <TamaguiProvider config={config} defaultTheme="light">
      <YStack p="$4" gap="$4">
        <Button testID="smoke-button" onPress={() => setCount((c) => c + 1)}>
          <Button.Text testID="smoke-count">presses:{count}</Button.Text>
        </Button>
      </YStack>
    </TamaguiProvider>
  )
}
