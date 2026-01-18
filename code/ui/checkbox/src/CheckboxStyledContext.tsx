import type { SizeTokens } from '@tamagui/core'
import { createStyledContext } from '@tamagui/core'

export const CheckboxStyledContext = createStyledContext<{
  size: SizeTokens
  scaleIcon: number
  unstyled?: boolean
  active?: boolean
  disabled?: boolean
}>({
  size: '$true' as SizeTokens,
  scaleIcon: 1,
  unstyled: process.env.TAMAGUI_HEADLESS === '1',
  active: false,
  disabled: false,
})
