import { createAnimations } from '@tamagui/animations-reanimated'

export const animations = createAnimations({
  bounce1: {
    type: 'spring',
    damping: 20,
    stiffness: 90,
  },
})
