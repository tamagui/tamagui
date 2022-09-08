import { GetProps, styled } from '@tamagui/core'
import { focusableInputHOC } from '@tamagui/focusable'

import { textAreaSizeVariant } from '../helpers/inputHelpers'
import { InputFrame } from './Input'

export const TextAreaFrame = styled(InputFrame, {
  name: 'TextArea',
  multiline: true,
  numberOfLines: 4,
  height: 'auto',

  focusStyle: {
    marginHorizontal: -1,
    borderColor: '$borderColorFocus',
    borderWidth: 2,
  },

  variants: {
    size: {
      '...size': textAreaSizeVariant,
    },
  } as const,
})

export type TextAreaProps = GetProps<typeof TextArea>

export const TextArea = InputFrame.extractable(focusableInputHOC(TextAreaFrame))
