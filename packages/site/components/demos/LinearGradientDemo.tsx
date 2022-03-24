import React from 'react'
import { LinearGradient, XStack } from 'tamagui'

export default function LinearGradientDemo() {
  return (
    <XStack als="center" space width={100} height={100}>
      <LinearGradient colors={['red', 'yellow']} start={[0, 1]} end={[0, 0]} />
    </XStack>
  )
}
