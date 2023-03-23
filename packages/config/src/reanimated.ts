export * from './media'
export * from './createGenericFont'

import { animations } from './animations.reanimated'
import { createTamaguiConfig } from './createTamaguiConfig'

export const config = createTamaguiConfig(animations)
