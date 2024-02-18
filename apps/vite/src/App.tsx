import { useState } from 'react'
import { TamaguiProvider, Button } from 'tamagui';
import config from './tamagui.config';

export function App() {
  const [count, setCount] = useState(0)

  return (
    <TamaguiProvider config={config}>
      <Button
        theme="red"
        opacity={1}
        enterStyle={{ opacity: 0 }}
        pressStyle={{ scale: 1.5 }}
        onPress={() => setCount(c => c + 1)}
        animation="slow"
      >
        Count {count}
      </Button>
    </TamaguiProvider>
  )
}
