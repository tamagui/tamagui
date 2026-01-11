import { LogoIcon } from '@tamagui/logo'
import { Square } from 'tamagui'

export function AnimationsTimingDemo() {
  return (
    <Square
      bg="$pink10"
      transition="100ms"
      elevation="$4"
      size={110}
      rounded="$9"
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
