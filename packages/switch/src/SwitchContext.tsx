import { SizeTokens, createStyledContext } from '@tamagui/core'

export const SwitchContext = createStyledContext<{
  checked: boolean
  disabled?: boolean
  frameWidth: number
  size?: SizeTokens
  unstyled?: boolean
}>({
  checked: false,
  disabled: false,
  size: undefined,
  frameWidth: 0,
  unstyled: false,
})
