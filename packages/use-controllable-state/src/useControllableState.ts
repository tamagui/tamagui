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

  useEffect(() => {
    const next = getNextStateWithCallback(val, prop)
    if (next !== undefined && next !== val) {
      setVal(next)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prop])

  return [
    val,
    useEvent((next: unknown) => {
      if (preventUpdate) return
      if (propWins && prop !== undefined) {
        return
      }
      setVal((prev) => {
        return getNextStateWithCallback(
          prev,
          typeof next === 'function' ? next(prev) : next,
          onChange
        )
      })
    }),
  ]
}

const getNextStateWithCallback = (prev: any, next: any, handleChange?: ChangeCb<any>) => {
  if (prev === next || next === undefined) {
    return prev
  }
  handleChange?.(next)
  return next
}
