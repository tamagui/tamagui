import { isRSC, isServer, isWeb } from '@tamagui/constants'
import { useEffect, useState } from 'react'

let finished = false
const listeners = new Set<Function>()

export function useSetupHasSSRRendered() {
  if (isServer || isRSC) {
    return
  }

  useEffect(() => {
    finished = true
    listeners.forEach((cb) => cb())
    listeners.clear()
  }, [])
}

export function useDidFinishSSR() {
  // conditional hook because it never changes if already true
  if (isServer || isRSC) {
    return false
  }
  if (finished) {
    return true
  }

  const [did, setDid] = useState(false)

  useEffect(() => {
    const done = () => setDid(true)
    listeners.add(done)
    return () => {
      listeners.delete(done)
    }
  }, [])

  return did
}
