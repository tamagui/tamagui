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
}): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState(prop ?? defaultProp)
  const previous = useRef<any>(state)
  const propWins = strategy === 'prop-wins' && prop !== undefined
  const value = propWins ? prop : state
  const onChangeCb = useEvent(onChange || idFn)

  useEffect(() => {
    if (state !== previous.current) {
      previous.current = state
      onChangeCb(state)
    }
  }, [onChangeCb, state])

  const setter = useEvent((next) => {
    if (preventUpdate) return
    console.log('setting', propWins, prop, next)
    if (propWins) {
      const nextValue = typeof next === 'function' ? next(previous.current) : next
      onChangeCb(nextValue)
    } else {
      setState(next)
    }
  })

  return [value as T, setter]
}

const idFn = () => {}
