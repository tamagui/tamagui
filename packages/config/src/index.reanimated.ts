import { animations } from './animations.reanimated'
import { configWithoutAnimations } from './config'
export * from './media'
export * from './createGenericFont'
export * from './animations.reanimated'

export const config = {
  ...configWithoutAnimations,
  animations,
}
