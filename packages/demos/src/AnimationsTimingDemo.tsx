import { LogoIcon } from '@tamagui/logo'
import { Square } from 'tamagui'

export function AnimationsTimingDemo() {
  return (
    <Square
      bc="$pink10"
      animation="100ms"
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
