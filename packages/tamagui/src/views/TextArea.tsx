import { GetProps, styled } from '@tamagui/core'

import { Input } from './Input'

export const TextArea = styled(Input, {
  name: 'TextArea',
  multiline: true,
  numberOfLines: 4,
})

export type TextAreaProps = GetProps<typeof TextArea>
