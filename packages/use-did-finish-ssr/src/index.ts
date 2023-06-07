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

export function useClientValue<Value extends any>(value?: Value): Value | undefined {
  if (isServer || isRSC) {
    return undefined
  }

  const [v, setV] = useState<Value | undefined>(undefined)

  useIsomorphicLayoutEffect(() => {
    setV(value)
  }, [])

  return v
}
