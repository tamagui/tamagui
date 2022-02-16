import { createAnimations } from '@tamagui/animations-reanimated'

export const animations = createAnimations({
  springy: {
    type: 'spring',
    damping: 20,
    stiffness: 90,
  },
})
