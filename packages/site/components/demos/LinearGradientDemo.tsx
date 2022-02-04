import React from 'react'
import { LinearGradient, XStack } from 'tamagui'

export function LinearGradientDemo() {
  return (
    <XStack als="center" space>
      <LinearGradient
        colors={['red', 'yellow']}
        start={[0, 1]}
        end={[0, 0]}
        width={100}
        height={100}
      />
    </XStack>
  )
}
