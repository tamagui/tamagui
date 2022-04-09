import { GetProps, styled } from '@tamagui/core'
import { TextInput } from 'react-native'

import { inputSizeVariant } from '../helpers/inputHelpers'
import { inputStyle } from './Input'

export const TextArea = styled(TextInput, {
  name: 'TextArea',
  multiline: true,
  numberOfLines: 4,
  ...inputStyle,
})

export type TextAreaProps = GetProps<typeof TextArea>
