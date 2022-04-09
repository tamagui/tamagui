import { useCallbackRef } from '@radix-ui/react-use-callback-ref'
import { useCallback, useEffect, useState } from 'react'

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
  onChange?: (next: T) => void
  strategy?: 'prop-wins' | 'most-recent-wins'
}): [T, React.Dispatch<React.SetStateAction<T>>] {
  const handleChange = useCallbackRef(onChange)
  const [val, setVal] = useState(prop ?? defaultProp)
  const propWins = strategy === 'prop-wins'

  useEffect(() => {
    console.warn('prop cahnge', prop)
    setVal((prev) => getNextStateWithCallback(prev, prop, handleChange))
  }, [prop])

  return [
    val,
    useCallback(
      (next: any) => {
        console.log('huh')
        if (propWins && prop !== undefined) {
          return
        }
        setVal((prev) => {
          console.log(
            'next',
            getNextStateWithCallback(
              prev,
              typeof next === 'function' ? next(prev) : next,
              handleChange
            )
          )
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
