import { createStyledHOC, styled, View } from '@tamagui/core'
import type { SelectScopedProps, SelectScrollButtonProps } from './types'

export const SelectScrollButtonFrame = styled(View, {
  displayName: 'SelectScrollButton',
})

export const SelectScrollUpButton = createStyledHOC(
  SelectScrollButtonFrame,
  (_props: SelectScopedProps<SelectScrollButtonProps>) => null
)

export const SelectScrollDownButton = createStyledHOC(
  SelectScrollButtonFrame,
  (_props: SelectScopedProps<SelectScrollButtonProps>) => null
)
