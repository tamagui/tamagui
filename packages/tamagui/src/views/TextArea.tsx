import { isWeb } from '@tamagui/constants'
import { styled, useComposedRefs } from '@tamagui/core'

import { textAreaSizeVariant } from '../helpers/inputHelpers'
import type { Input, InputExtraProps, InputProps } from './Input'
import { InputFrame, defaultStyles, useInputProps } from './Input'
import { registerFocusable } from '@tamagui/focusable'
import { useEffect, useRef } from 'react'

/**
 * Is basically Input but with rows = 4 to start
 */

export const TextAreaFrame = styled(
  InputFrame,
  {
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
  },
  {
    name: 'TextArea',
  }
)

export type TextAreaProps = InputProps

export const TextArea = TextAreaFrame.styleable<InputExtraProps>(
  (propsIn, forwardedRef) => {
    const ref = useRef<Input>(null)
    const composedRefs = useComposedRefs(forwardedRef, ref)

    const props = useInputProps(propsIn, composedRefs)
    // defaults to 4 rows
    const linesProp = {
      // web uses rows now, but native not caught up :/
      [isWeb ? 'rows' : 'numberOfLines']: propsIn.unstyled ? undefined : 4,
    }

    if (process.env.TAMAGUI_TARGET === 'native') {
      useEffect(() => {
        if (!props.id) return
        if (props.disabled) return

        return registerFocusable(props.id, {
          focusAndSelect: () => {
            ref.current?.focus()
          },
          focus: () => {},
        })
      }, [props.id, props.disabled])
    }

    return <TextAreaFrame {...linesProp} {...props} />
  }
) as typeof Input
