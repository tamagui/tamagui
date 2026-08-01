import { LogoIcon } from '@tamagui/logo'
import { Square } from 'tamagui'

export function AnimationsTimingDemo() {
  return (
    <Square
      bg="color9"
      transition="100ms"
      rounded="9"
      scale="hover:1.2 press:0.9"
      elevation="$4"
      size={110}
    >
      <LogoIcon downscale={0.75} />
    </Square>
  )
}
