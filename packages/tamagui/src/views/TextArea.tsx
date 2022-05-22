import { GetProps, styled } from '@tamagui/core'

import { textAreaSizeVariant } from '../helpers/inputHelpers'
import { Input } from './Input'

export const TextArea = styled(Input, {
  name: 'TextArea',
  multiline: true,
  numberOfLines: 4,
  height: 'auto',

  focusStyle: {
    margin: -1,
    borderColor: '$borderColorFocus',
    borderWidth: 2,
  },

  variants: {
    size: {
      '...size': textAreaSizeVariant,
    },
  },
})

export type TextAreaProps = GetProps<typeof TextArea>
