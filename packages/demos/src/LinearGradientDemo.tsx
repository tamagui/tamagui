import React from 'react'
import { LinearGradient, XStack, YStack } from 'tamagui'

export function LinearGradientDemo() {
  return (
    <XStack space>
      {/* tokens */}
      <LinearGradient
        width="$6"
        height="$6"
        br="$4"
        colors={['$red10', '$yellow10']}
        start={[0, 1]}
        end={[0, 0]}
      />

      {/* theme values */}
      <LinearGradient
        width="$6"
        height="$6"
        br="$4"
        colors={['$background', '$color']}
        start={[1, 1]}
        end={[0, 0]}
      />
    </XStack>
  )
}
