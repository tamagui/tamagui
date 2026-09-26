import { createStyledContext } from '@tamagui/core'

export const CheckboxStyledContext = createStyledContext<{
  active?: boolean
  disabled?: boolean
}>({
  active: false,
  disabled: false,
})
