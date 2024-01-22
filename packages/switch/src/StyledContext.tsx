import { SizeTokens, createStyledContext } from '@tamagui/core'

export const SwitchStyledContext = createStyledContext<{
  size?: SizeTokens
  unstyled?: boolean
}>({
  size: undefined,
  unstyled: process.env.TAMAGUI_HEADLESS === '1' ? true : false,
})
