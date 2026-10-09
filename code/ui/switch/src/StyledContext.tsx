import { createStyledContext } from '@tamagui/core'

export const SwitchStyledContext = createStyledContext<{
  active?: boolean
  disabled?: boolean
  frameWidth?: number
  size?: string | number | boolean
}>({
  active: false,
  disabled: false,
  frameWidth: undefined,
  size: undefined,
})
