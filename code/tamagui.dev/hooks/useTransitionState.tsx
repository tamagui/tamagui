import { startTransition, useCallback, useState } from 'react'

export const useTransitionState = ((val) => {
  const [a, b] = useState(val)
  // @ts-ignore
  const wrapped = useCallback(
    (...args) => {
      startTransition(() => {
        // @ts-ignore
        b(...args)
      })
    },
    [b]
  )
  return [a, wrapped]
}) as typeof useState
