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
}: {
  isInput?: boolean
  props: FocusableProps
  ref?: MutableRefObject<any>
}) {
  const { id, onChangeText, value, defaultValue } = props
  const inputValue = React.useRef(value || defaultValue || '')
  const unregisterFocusable = React.useRef<() => void | undefined>(undefined)

  const focusAndSelect = React.useCallback((input: any) => {
    input.focus()
    if (input.setSelection && typeof inputValue.current === 'string') {
      input.setSelection(0, inputValue.current.length)
    }
  }, [])

  const registerFocusableHandler = React.useCallback(
    (input: any) => {
      if (!id || !input) return

      unregisterFocusable.current?.()
      unregisterFocusable.current = registerFocusable(id, {
        focus: input.focus,
        ...(isInput && {
          focusAndSelect: () => focusAndSelect(input),
        }),
      })
    },
    [id, isInput, focusAndSelect]
  )

  const inputRef = React.useCallback(
    (input: any) => {
      if (input) {
        registerFocusableHandler(input)
      }
    },
    [registerFocusableHandler]
  )

  const handleChangeText = useEvent((value: string) => {
    inputValue.current = value
    onChangeText?.(value)
  })

  React.useEffect(() => {
    return () => {
      unregisterFocusable.current?.()
    }
  }, [])

  return {
    ref: React.useMemo(() => composeRefs(ref, inputRef), [ref, inputRef]),
    onChangeText: handleChangeText,
  }
}
