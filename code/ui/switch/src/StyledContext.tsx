import type { SizeTokens } from '@tamagui/core'
import { createStyledContext } from '@tamagui/core'

export const SwitchStyledContext = createStyledContext<{
  active?: boolean
  disabled?: boolean
  frameWidth?: number
  size?: SizeTokens
  unstyled?: boolean
}>({
  active: false,
  disabled: false,
  frameWidth: undefined,
  size: undefined,
  unstyled: process.env.TAMAGUI_HEADLESS === '1',
})
