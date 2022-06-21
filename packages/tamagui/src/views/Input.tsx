import { GetProps, styled } from '@tamagui/core'
import { TextInput } from 'react-native'

import { focusableInputHOC } from '../helpers/focusableInputHOC'
import { inputSizeVariant } from '../helpers/inputHelpers'

export const InputFrame = styled(TextInput, {
  name: 'Input',
  borderWidth: 1,
  color: '$color',
  focusable: true,
  borderColor: '$borderColor',
  backgroundColor: '$background',

  hoverStyle: {
    borderColor: '$borderColorHover',
  },

  focusStyle: {
    borderColor: '$borderColorFocus',
    borderWidth: 2,
    marginHorizontal: -1,
  },

  variants: {
    size: {
      '...size': inputSizeVariant,
    },
  },

  defaultVariants: {
    size: '$4',
  },
})

export type InputProps = GetProps<typeof InputFrame>

export const Input = InputFrame.extractable(focusableInputHOC(InputFrame))
