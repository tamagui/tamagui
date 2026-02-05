import { View, Text, styled } from '@tamagui/core'
import { useState } from 'react'

const YStack = styled(View, { flexDirection: 'column' })
const Button = styled(View, {
  render: 'button',
  padding: '$3',
  backgroundColor: '$blue10',
  borderRadius: '$4',
  cursor: 'pointer',
  pressStyle: { opacity: 0.8 },
})

export function TestComponent() {
  const [count, setCount] = useState(0)

  return (
    <YStack flex={1} justifyContent="center" alignItems="center" gap="$4" padding="$4" backgroundColor="$background">
      <Text color="$color12" fontSize="$8" fontWeight="bold">Tamagui + Turbopack</Text>
      <Text color="$color10">Count: {count}</Text>
      <Button onPress={() => setCount(c => c + 1)}>
        <Text color="white">Increment</Text>
      </Button>
      <YStack padding="$4" backgroundColor="$blue5" borderRadius="$4" $sm={{ backgroundColor: '$red5' }}>
        <Text>Media query test (blue on lg, red on sm)</Text>
      </YStack>
    </YStack>
  )
}
