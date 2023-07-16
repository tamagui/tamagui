import { animations } from './animations.reanimated'
import { configWithoutAnimations } from './config'
export * from './media'
export * from './createGenericFont'

export const config = {
  ...configWithoutAnimations,
  animations,
}
