import { View, Text, styled } from '@tamagui/core'
import { useState } from 'react'

const YStack = styled(View, { flexDirection: 'column' })
const Button = styled(View, {
  render: 'button',
  padding: '3',
  backgroundColor: 'blue10',
  borderRadius: '4',
  cursor: 'pointer',
  opacity: '1 press:0.8',
})

export function TestComponent() {
  const [count, setCount] = useState(0)

  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      gap="4"
      padding="4"
      backgroundColor="background"
    >
      <Text color="color12" fontSize="8" fontWeight="bold">
        Tamagui + Turbopack
      </Text>
      <Text color="color10">Count: {count}</Text>
      <Button onPress={() => setCount((c) => c + 1)}>
        <Text color="white">Increment</Text>
      </Button>
      <YStack
        padding="4"
        backgroundColor="blue5 max-sm:red5"
        borderRadius="4"
      >
        <Text>Media query test (blue above sm, red below sm)</Text>
      </YStack>
    </YStack>
  )
}
