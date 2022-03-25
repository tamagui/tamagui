import React, { useState } from 'react'
import { Button } from 'tamagui'

export default function AnimationsDemo() {
  const [scale, setScale] = useState(1)

  return (
    <Button scale={scale} animated animation="bounce1" onPress={() => setScale(2)}>
      Hello World
    </Button>
  )
}
