import { createStyledHOC, styled, View } from '@tamagui/core'
import type { SelectScopedProps, SelectScrollButtonProps } from './types'

export const SelectScrollButtonFrame = styled(View, {
  name: 'SelectScrollButton',
})

export const SelectScrollUpButton = createStyledHOC(SelectScrollButtonFrame)<{
  scope?: string
}>((_props: SelectScopedProps<SelectScrollButtonProps>) => null)

export const SelectScrollDownButton = createStyledHOC(SelectScrollButtonFrame)<{
  scope?: string
}>((_props: SelectScopedProps<SelectScrollButtonProps>) => null)
