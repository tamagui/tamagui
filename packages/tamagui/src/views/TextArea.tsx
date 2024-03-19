import { isWeb } from '@tamagui/constants'
import { styled } from '@tamagui/core'

import { textAreaSizeVariant } from '../helpers/inputHelpers'
import type { Input, InputExtraProps, InputProps } from './Input'
import { InputFrame, defaultStyles, useInputProps } from './Input'

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
    unstyled: process.env.TAMAGUI_HEADLESS === '1' ? true : false,
  },
})

export type TextAreaProps = InputProps

export const TextArea = TextAreaFrame.styleable<InputExtraProps>((propsIn, ref) => {
  const props = useInputProps(propsIn, ref)
  // defaults to 4 rows
  const linesProp = {
    // web uses rows now, but native not caught up :/
    [isWeb ? 'rows' : 'numberOfLines']: propsIn.unstyled ? undefined : 4,
  }
  return <TextAreaFrame {...linesProp} {...props} />
}) as typeof Input
