import type { SizeTokens } from '@tamagui/style'
import { createStyledContext } from '@tamagui/style'

export const SwitchStyledContext = createStyledContext<{
  active?: boolean
  disabled?: boolean
  frameWidth?: number
  size?: SizeTokens | number | true
}>({
  active: false,
  disabled: false,
  frameWidth: undefined,
  size: undefined,
})
