import type { SizeTokens } from '@tamagui/core'
import { createStyledContext } from '@tamagui/core'

export const SwitchStyledContext = createStyledContext<{
  size?: SizeTokens
  unstyled?: boolean
}>({
  size: undefined,
  unstyled: process.env.TAMAGUI_HEADLESS === '1',
})
