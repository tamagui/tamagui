import type { SizeTokens } from '@tamagui/core'
import { createStyledContext } from '@tamagui/core'

export const CheckboxStyledContext = createStyledContext<{
  size: SizeTokens | true
  active?: boolean
  disabled?: boolean
}>({
  size: true,
  active: false,
  disabled: false,
})
