import { SizeTokens, createStyledContext } from '@tamagui/core'

export const SwitchStyledContext = createStyledContext<{
  frameWidth: number
  size?: SizeTokens
  unstyled?: boolean
}>({
  size: undefined,
  frameWidth: 0,
  unstyled: process.env.TAMAGUI_HEADLESS === '1' ? true : false,
})
