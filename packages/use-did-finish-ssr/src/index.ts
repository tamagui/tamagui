import { isRSC, isServer, useIsomorphicLayoutEffect } from '@tamagui/constants'
import { startTransition, useState } from 'react'

export function useDidFinishSSR() {
  // conditional hook because it never changes if already true
  if (isServer || isRSC) {
    return false
  }

  const [did, setDid] = useState<boolean | undefined>()

  useIsomorphicLayoutEffect(() => {
    startTransition(() => {
      setDid(true)
    })
  }, [])

  return did
}
