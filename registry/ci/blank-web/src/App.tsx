import { useState } from 'react'
import { YStack } from 'tamagui'
// the installed registry item — this is the copy-paste output, unmodified.
import { Button } from '../components/tamagui/Button'

// interaction smoke: pressing the installed Button must fire onPress and update
// visible state. proves the copied component builds AND behaves in a blank app.
export function App() {
  const [count, setCount] = useState(0)
  return (
    <YStack p="$4" gap="$4" ai="center">
      <Button id="smoke-button" onPress={() => setCount((c) => c + 1)}>
        <Button.Text>pressed {count}</Button.Text>
      </Button>
    </YStack>
  )
}
