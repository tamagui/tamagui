import { createStyledContext, type SizeTokens } from '@tamagui/core'

export const SizableContext = createStyledContext({
  size: undefined as SizeTokens | undefined,
})
