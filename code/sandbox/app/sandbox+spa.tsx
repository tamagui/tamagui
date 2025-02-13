import { useLayoutEffect, useState } from 'react'
import { Button, Text, View, YStack } from 'tamagui'

export default function Sandbox() {
  const [x, setX] = useState(Date.now())
  const [time, setTime] = useState(0)

  useLayoutEffect(() => {
    if (x) {
      setTime(Date.now() - x)
    }
  }, [x])

  return (
    <>
      <Button theme="accent">hello world</Button>

      <YStack width={200} height={200} p="$4" bg="#f2f2f2">
        <Button
          shadowColor="$shadow6"
          shadowRadius={4}
          shadowOffset={{ height: 2, width: 0 }}
        >
          testing
        </Button>
      </YStack>

      <View p={20} onPress={() => setX(Date.now())}>
        <Text>
          Re-render {x} in {time}ms
        </Text>
      </View>
    </>
  )
}
