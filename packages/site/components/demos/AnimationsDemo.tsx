import React, { useCallback, useState } from 'react'
import { Button } from 'tamagui'

export default function AnimationsDemo() {
  const [scale, setScale] = useState(1)

  const onPress = useCallback(() => setScale(2), [])

  return (
    <Button scale={scale} animation="bouncy" onPress={onPress}>
      Hello World
    </Button>
  )
}
