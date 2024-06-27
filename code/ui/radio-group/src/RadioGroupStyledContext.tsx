import type { SizeTokens } from '@tamagui/core'
import { createStyledContext } from '@tamagui/core'

export const RadioGroupStyledContext = createStyledContext({
  size: '$true' as SizeTokens,
  scaleIcon: 1,
})
