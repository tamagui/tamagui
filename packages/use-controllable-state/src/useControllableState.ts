import { useEvent } from '@tamagui/use-event'
import React, { useEffect, useRef, useState } from 'react'

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
  const [val, setVal] = useState(prop ?? defaultProp)
  const propWins = strategy === 'prop-wins'
  const onChangeCb = useEvent(onChange || idFn)

  // sync prop to state
  useEffect(() => {
    const next = getNextState(val, prop)
    if (next !== undefined && next !== val) {
      setVal(next)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prop])

  useEffect(() => {
    onChangeCb(val)
  }, [onChangeCb, val])

  return [
    propWins ? (prop as T) : val,
    useEvent((next: unknown) => {
      if (preventUpdate) return
      if (propWins && prop !== undefined) {
        return
      }
      setVal((prev) => getNextState(prev, typeof next === 'function' ? next(prev) : next))
    }),
  ]
}

const getNextState = (prev: any, next: any) => {
  if (prev === next || next === undefined) {
    return prev
  }
  return next
}

const idFn = () => {}
