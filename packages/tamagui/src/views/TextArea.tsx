import { isWeb, styled } from '@tamagui/core'

import { textAreaSizeVariant } from '../helpers/inputHelpers'
import { InputFrame, InputProps, defaultStyles, useInputProps } from './Input'

/**
 * Is basically Input but with rows = 4 to start
 */

export const TextAreaFrame = styled(InputFrame, {
  name: 'TextArea',
  multiline: true,
  // this attribute fixes firefox newline issue
  whiteSpace: 'pre-wrap',

  variants: {
    unstyled: {
      false: {
        height: 'auto',
        ...defaultStyles,
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
  // defaults to 4 rows
  const linesProp = {
    // web uses rows now, but native not caught up :/
    [isWeb ? 'rows' : 'numberOfLines']: propsIn.unstyled ? undefined : 4,
  }
  return <TextAreaFrame {...linesProp} {...props} />
})
