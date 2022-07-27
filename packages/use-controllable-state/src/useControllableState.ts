import { useEvent } from '@tamagui/use-event'
import React, { useCallback, useEffect, useRef, useState } from 'react'

// can configure to allow most-recent-wins or prop-wins
// defaults to prop-wins

type ChangeCb<T> = ((next: T) => void) | React.Dispatch<React.SetStateAction<T>>

export function useControllableState<T>({
  prop,
  defaultProp,
  onChange,
  strategy = 'prop-wins',
  preventUpdate,
}: {
  prop?: T | undefined
  defaultProp: T
  onChange?: ChangeCb<T>
  strategy?: 'prop-wins' | 'most-recent-wins'
  preventUpdate?: boolean
}): [T, (next: T) => void] {
  const [state, setState] = useState(prop ?? defaultProp)
  const previous = useRef<any>(state)
  const value = strategy === 'prop-wins' ? prop : state
  const propWins = strategy === 'prop-wins'
  const onChangeCb = useEvent(onChange || idFn)

  useEffect(() => {
    if (state !== previous.current) {
      previous.current = state
      onChangeCb(state)
    }
  }, [onChangeCb, state])

  return [
    value as T,
    useCallback(
      (next: T) => {
        if (preventUpdate) return
        if (propWins) {
          onChangeCb(next)
        } else {
          setState(next)
        }
      },
      [preventUpdate, propWins, onChangeCb]
    ),
  ]
}

const idFn = () => {}
