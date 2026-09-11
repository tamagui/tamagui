import type { SizeTokens } from '@tamagui/style'
import { createStyledContext } from '@tamagui/style'

export const CheckboxStyledContext = createStyledContext<{
  size: SizeTokens | true
  active?: boolean
  disabled?: boolean
}>({
  size: true,
  active: false,
  disabled: false,
})
