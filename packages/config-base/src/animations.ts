// import { createAnimations } from '@tamagui/animations-reanimated'

// export const animations = createAnimations({
//   bouncy: {
//     type: 'spring',
//     damping: 9,
//     mass: 0.9,
//     stiffness: 150,
//   },
//   lazy: {
//     type: 'spring',
//     damping: 18,
//     stiffness: 50,
//   },
//   slow: {
//     type: 'spring',
//     damping: 15,
//     stiffness: 40,
//   },
//   quick: {
//     type: 'spring',
//     damping: 20,
//     mass: 1.2,
//     stiffness: 250,
//   },
//   tooltip: {
//     type: 'spring',
//     damping: 10,
//     mass: 0.9,
//     stiffness: 100,
//   },
// })

import { createAnimations } from '@tamagui/animations-react-native'

export const animations = createAnimations({
  bouncy: {
    damping: 9,
    mass: 0.9,
    stiffness: 150,
  },
  lazy: {
    damping: 18,
    stiffness: 50,
  },
  slow: {
    damping: 15,
    stiffness: 40,
  },
  quick: {
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },
  tooltip: {
    damping: 10,
    mass: 0.9,
    stiffness: 100,
  },
})
