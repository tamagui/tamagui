import { LogoIcon } from '@tamagui/logo'
import { Square } from 'tamagui'

export function AnimationsHoverDemo() {
  return (
    <Square
      borderColor="border-color"
      transition="bouncy"
      bg="color-9"
      rounded="9"
      scale="hover:1.2 press:0.9"
      boxShadow="0 4px 12px shadow-color"
      size={104}
    >
      <LogoIcon downscale={0.75} />
    </Square>
  )
}
