import { styled } from '@tamagui/core'

import { textAreaSizeVariant } from '../helpers/inputHelpers'
import { InputFrame, InputProps, defaultStyles, useInputProps } from './Input'

/**
 * Is basically Input but with numberOfLines = 4 to start
 */

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

export type TextAreaProps = InputProps

export const TextArea = TextAreaFrame.styleable<InputProps>((propsIn, ref) => {
  const props = useInputProps(propsIn, ref)
  return <TextAreaFrame {...props} />
})
