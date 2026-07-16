import type { SizeTokens } from '@tamagui/core'
import { createStyledContext } from '@tamagui/core'

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
