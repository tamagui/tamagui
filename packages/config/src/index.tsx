import { themes } from '@tamagui/themes'

import { animations } from './animations'
import { configWithoutAnimations } from './config'

export { configWithoutAnimations } from './config'
export * from './media'
export * from './createGenericFont'
export * from './animations'

export const config = {
  ...configWithoutAnimations,
  // fixes typescript exporting this using internal /types/ path
  themes: themes as typeof themes,
  animations,
}
