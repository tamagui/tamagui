import { composeRefs } from '@tamagui/compose-refs'
import React from 'react'
import { forwardRef, useCallback, useEffect } from 'react'

import { registerFocusable, unregisterFocusable } from '../lib/registerFocusable'

export function focusableInputHOC<A extends Function>(Component: A): A {
  return forwardRef((props: { id?: string }, ref) => {
    const inputRef = useCallback(
      (input) => {
        if (!props.id) return
        registerFocusable(props.id, input)
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

    return <Component ref={combinedRefs} {...props} />
  }) as any
}
