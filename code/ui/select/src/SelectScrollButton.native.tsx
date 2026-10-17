import { createStyledHOC, styled, View } from '@tamagui/core'
import type { SelectScrollButtonExtraProps } from './types'

export const SelectScrollButtonFrame = styled(View, {
  displayName: 'SelectScrollButton',
})

export const SelectScrollUpButton = createStyledHOC(
  SelectScrollButtonFrame,
  (_props: SelectScrollButtonExtraProps) => null
)

export const SelectScrollDownButton = createStyledHOC(
  SelectScrollButtonFrame,
  (_props: SelectScrollButtonExtraProps) => null
)
