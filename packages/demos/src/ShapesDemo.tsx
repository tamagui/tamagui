import React from 'react'
import { Circle, Square, XStack } from 'tamagui'

export default function ShapesDemo() {
  return (
    <XStack p="$2" space="$4">
      <Square size={100} bc="$color" elevation="$4" />
      <Circle size={100} bc="$color" elevation="$4" />
    </XStack>
  )
}
