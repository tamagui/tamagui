// TODO: have more sensible default/min/max/step for these?

export const animationTypesInfo = {
  spring: {
    stiffness: { default: 1, min: 1, max: 300, step: 1 },
    mass: { default: 1, min: 1, max: 10, step: 0.01 },
    damping: { default: 1, min: 1, max: 100, step: 1 },
  },
  timing: {
    duration: {
      default: 100,
      min: 1,
      max: 10000,
      step: 10,
    },
  },
}

export const generateAnimationConfig = (animations: { [key: string]: any }) => {
  return `import { createAnimations } from '@tamagui/animations-react-native'

const animations = createAnimations(${JSON.stringify(animations, null, 2)})
`
}
