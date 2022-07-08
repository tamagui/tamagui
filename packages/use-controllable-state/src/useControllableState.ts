import { useCallbackRef } from '@radix-ui/react-use-callback-ref'
import React, { useCallback, useEffect, useRef, useState } from 'react'

// can configure to allow most-recent-wins or prop-wins
// defaults to prop-wins

export function useControllableState<T>({
  prop,
  defaultProp,
  onChange,
  strategy = 'prop-wins',
}: {
  prop?: T | undefined
  defaultProp: T
  onChange?: ((next: T) => void) | React.Dispatch<React.SetStateAction<T>>
  strategy?: 'prop-wins' | 'most-recent-wins'
}): [T, React.Dispatch<React.SetStateAction<T>>] {
  const currentProp = useRef(prop)
  const handleChange = useCallbackRef(onChange)
  const [val, setVal] = useState(prop ?? defaultProp)
  const propWins = strategy === 'prop-wins'

  useEffect(() => {
    currentProp.current = prop
    setVal((prev) => getNextStateWithCallback(prev, prop, handleChange))
  }, [handleChange, prop])

  return [
    val,
    useCallback(
      (next: unknown) => {
        if (propWins && currentProp.current !== undefined) {
          handleChange(next as T)
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
      [propWins, handleChange]
    ),
  ]
}

const getNextStateWithCallback = (prev: any, next: any, handleChange: any) => {
  if (prev === next || next === undefined) {
    return prev
  }
  handleChange(next)
  return next
}
