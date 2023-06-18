import { isRSC, isServer, useIsomorphicLayoutEffect } from '@tamagui/constants'
import { startTransition, useState } from 'react'

export function useDidFinishSSR() {
  // conditional hook because it never changes if already true
  if (isServer || isRSC) {
    return false
  }

  const [did, setDid] = useState<boolean>(false)

  useIsomorphicLayoutEffect(() => {
    startTransition(() => {
      setDid(true)
    })
  }, [])

  return did
}

type FunctionOrValue<Value> = Value extends () => infer X ? X : Value

export function useClientValue<Value extends any>(
  value?: Value
): FunctionOrValue<Value> | undefined {
  if (isServer || isRSC) {
    return undefined
  }

  const [v, setV] = useState<FunctionOrValue<Value> | undefined>(undefined)

  useIsomorphicLayoutEffect(() => {
    // @ts-expect-error (this works with a function)
    setV(value)
  }, [])

  return v
}
