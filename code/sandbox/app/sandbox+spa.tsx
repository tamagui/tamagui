import { DialogDemo } from '@tamagui/demos'
import { useLayoutEffect, useState } from 'react'
import { Button, Text, View, YStack } from '@tamagui/ui'

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
      <View
        width={200}
        height={200}
        bg="red"
        left="20%"
        onLayout={(e) => {
          console.log('.', e.nativeEvent.layout)
        }}
      />
    </>
  )
}
