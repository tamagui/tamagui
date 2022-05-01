import { useCallbackRef } from '@radix-ui/react-use-callback-ref'
import React, { useCallback, useEffect, useState } from 'react'

// can configure to allow most-recent-wins or prop-wins
// defaults to most-recent-wins

export function useControllableState<T>({
  prop,
  defaultProp,
  onChange,
  strategy,
}: {
  prop?: T | undefined
  defaultProp: T
  onChange?: ((next: T) => void) | React.Dispatch<React.SetStateAction<T>>
  strategy?: 'prop-wins' | 'most-recent-wins'
}): [T, React.Dispatch<React.SetStateAction<T>>] {
  const handleChange = useCallbackRef(onChange)
  const [val, setVal] = useState(prop ?? defaultProp)
  const propWins = strategy === 'prop-wins'

  useEffect(() => {
    setVal((prev) => getNextStateWithCallback(prev, prop, handleChange))
  }, [prop])

  return [
    val,
    useCallback(
      (next: any) => {
        if (propWins && prop !== undefined) {
          return
        }
        setVal((prev) => {
          return getNextStateWithCallback(
            prev,
            typeof next === 'function' ? next(prev) : next,
            handleChange
          )
        })
      },
      [setVal, propWins]
    ) as any,
  ]
}

const getNextStateWithCallback = (prev: any, next: any, handleChange: any) => {
  if (prev === next || next === undefined) {
    return prev
  }
  handleChange(next)
  return next
}
