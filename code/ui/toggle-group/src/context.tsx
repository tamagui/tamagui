import { createStyledContext, type SizeTokens } from '@tamagui/web'

export const context = createStyledContext({
  size: undefined as SizeTokens | undefined,
  color: '',
  active: false,
})
