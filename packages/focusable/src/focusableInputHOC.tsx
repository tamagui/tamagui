import { composeRefs } from '@tamagui/compose-refs'
import { TamaguiComponent, isTamaguiComponent, useEvent } from '@tamagui/core'
import { forwardRef, useCallback, useEffect, useRef } from 'react'

import { registerFocusable } from './registerFocusable'

export function focusableInputHOC<A extends TamaguiComponent>(Component: A): A {
  const component = Component.extractable(
    forwardRef(
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
        const unregisterFocusable = useRef<() => void | undefined>()

        const inputRef = useCallback(
          (input) => {
            if (!props.id) return
            if (!input) return
            unregisterFocusable.current?.()
            unregisterFocusable.current = registerFocusable(props.id, {
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
          [isInput, props.id]
        )

        const combinedRefs = composeRefs(ref, inputRef)

        useEffect(() => {
          return () => {
            unregisterFocusable.current?.()
          }
        }, [])

        const onChangeText = useEvent((value) => {
          inputValue.current = value
          props.onChangeText?.(value)
        })

        const finalProps = isInput
          ? {
              ...props,
              onChangeText,
            }
          : props

        // @ts-expect-error
        return <Component ref={combinedRefs} {...finalProps} />
      }
    )
  ) as any

  return component
}
