import { composeRefs } from '@tamagui/compose-refs'
import type { TamaguiComponent } from '@tamagui/web'
import { useEvent } from '@tamagui/web'
import React, { useCallback, useEffect, useRef } from 'react'

import { registerFocusable } from './registerFocusable'

type FocusableProps = {
  id?: string
  onChangeText?: (val: string) => void
  value?: string
  defaultValue?: string
}

export function useFocusable({
  isInput,
  props,
  ref,
}: {
  isInput?: boolean
  props: FocusableProps
  ref?: React.MutableRefObject<any>
}) {
  const { id, onChangeText, value, defaultValue } = props
  const inputValue = useRef(value || defaultValue || '')
  const unregisterFocusable = useRef<() => void | undefined>()

  const inputRef = useCallback(
    (input) => {
      if (!id) return
      if (!input) return
      unregisterFocusable.current?.()
      unregisterFocusable.current = registerFocusable(id, {
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
    [isInput, id]
  )

  const combinedRefs = composeRefs(ref, inputRef)

  useEffect(() => {
    return () => {
      unregisterFocusable.current?.()
    }
  }, [])

  return {
    ref: combinedRefs,
    onChangeText: useEvent((value) => {
      inputValue.current = value
      onChangeText?.(value)
    }),
  }
}

export function focusableInputHOC<A extends TamaguiComponent>(Component: A): A {
  return Component.styleable((props: FocusableProps, ref) => {
    const isInput = Component.staticConfig?.isInput
    const { ref: combinedRef, onChangeText } = useFocusable({
      ref,
      props,
      isInput,
    })
    const finalProps = isInput
      ? {
          ...props,
          onChangeText,
        }
      : props

    // @ts-expect-error
    return <Component ref={combinedRef} {...finalProps} />
  }) as any
}
