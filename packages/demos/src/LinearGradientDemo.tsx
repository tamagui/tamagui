import React from 'react'
import { LinearGradient } from 'tamagui'

export function LinearGradientDemo() {
  return (
    <LinearGradient
      als="center"
      width={100}
      height={100}
      colors={['$red10', '$yellow10']}
      start={[0, 1]}
      br="$4"
      end={[0, 0]}
    />
  )
}
