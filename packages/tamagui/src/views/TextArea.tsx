import { GetProps, styled } from '@tamagui/core'
import { focusableInputHOC } from '@tamagui/focusable'

import { textAreaSizeVariant } from '../helpers/inputHelpers'
import { InputFrame, defaultStyles } from './Input'

export const TextAreaFrame = styled(InputFrame, {
  name: 'TextArea',
  multiline: true,

  variants: {
    unstyled: {
      false: {
        ...defaultStyles,
        height: 'auto',
        numberOfLines: 4,
      },
    },

    size: {
      '...size': textAreaSizeVariant,
    },
  } as const,

  defaultVariants: {
    unstyled: false,
  },
})

export type TextAreaProps = GetProps<typeof TextArea>

export const TextArea = focusableInputHOC(TextAreaFrame)
