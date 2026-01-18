import { LogoIcon } from '@tamagui/logo'
import { Square } from 'tamagui'

export function AnimationsHoverDemo() {
  return (
    <Square
      borderColor="$borderColor"
      transition="bouncy"
      elevation="$4"
      bg="$color9"
      size={104}
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
