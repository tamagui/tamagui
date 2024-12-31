import { createAnimations as createAnimationsCSS } from '@tamagui/animations-css'
import { Configuration } from 'tamagui'
import { SheetDemo } from '@tamagui/demos'

export const animationsCSS = createAnimationsCSS({
  '100ms': 'ease-in 100ms',
  bouncy: 'ease-in 200ms',
  lazy: 'ease-in 600ms',
  slow: 'ease-in 500ms',
  quick: 'ease-in 100ms',
  tooltip: 'ease-in 400ms',
  medium: 'ease-in 400ms',
})

export default () => {
  return (
    <Configuration animationDriver={animationsCSS}>
      <SheetDemo />
    </Configuration>
  )
}
