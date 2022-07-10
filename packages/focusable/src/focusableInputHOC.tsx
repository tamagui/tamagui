import { composeRefs } from '@tamagui/compose-refs'
import { isTamaguiComponent } from '@tamagui/core'
import React, { useRef } from 'react'
import { forwardRef, useCallback, useEffect } from 'react'

import { registerFocusable, unregisterFocusable } from './registerFocusable'

export function focusableInputHOC<A extends Function>(Component: A): A {
  return forwardRef(
    (
      props: {
        id?: string
        onChangeText?: (val: string) => void
        value?: string
        defaultValue?: string
      },
      ref
    ) => {
      const isInput = isTamaguiComponent(Component) && Component.staticConfig.isInput
      const inputValue = useRef(props.value || props.defaultValue || '')

      const inputRef = useCallback(
        (input) => {
          if (!props.id) return
          if (!input) return
          registerFocusable(props.id, {
            focus: input.focus,

            ...(isInput && {
              // react-native doesn't support programmatic .select()
              focusAndSelect() {
                input.focus()
                if (input.setSelection && typeof inputValue.current === 'string') {
                  input.setSelection(0, inputValue.current.length)
                }
              },
            }),
          })
        },
        [props.id]
      )

      const combinedRefs = composeRefs(ref, inputRef)

      useEffect(() => {
        return () => {
          if (!props.id) return
          unregisterFocusable(props.id)
        }
      }, [props.id])

      const finalProps = isInput
        ? {
            ...props,
            onChangeText(value) {
              inputValue.current = value
              props.onChangeText?.(value)
            },
          }
        : props

      return <Component ref={combinedRefs} {...finalProps} />
    }
  ) as any
}
