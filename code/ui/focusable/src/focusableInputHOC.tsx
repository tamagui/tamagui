import { composeRefs } from '@tamagui/compose-refs'
import { useEvent } from '@tamagui/web'
import type { MutableRefObject } from 'react'
import React from 'react'

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
}: { isInput?: boolean; props: FocusableProps; ref?: MutableRefObject<any> }) {
  const { id, onChangeText, value, defaultValue } = props
  const inputValue = React.useRef(value || defaultValue || '')
  const unregisterFocusable = React.useRef<() => void | undefined>()

  const inputRef = React.useCallback(
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

  React.useEffect(() => {
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
