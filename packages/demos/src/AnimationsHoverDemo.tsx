import { LogoIcon } from '@tamagui/logo'
import React from 'react'
import { Square } from 'tamagui'

export function AnimationsHoverDemo() {
  return (
    <Square
      bc="$pink10"
      animation="bouncy"
      elevation="$4"
      size={110}
      br="$9"
      hoverStyle={{
        scale: 1.2,
      }}
      pressStyle={{
        scale: 0.9,
      }}
    >
      <LogoIcon downscale={0.75} />
    </Square>
  )
}
