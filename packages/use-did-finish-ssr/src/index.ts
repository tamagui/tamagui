import { isRSC, isServer, useIsomorphicLayoutEffect } from '@tamagui/constants'
import { startTransition, useEffect, useState } from 'react'

let finished = false
const listeners = new Set<Function>()

const onceReady =
  (typeof self !== 'undefined' &&
    self.requestIdleCallback &&
    self.requestIdleCallback.bind(window)) ||
  setTimeout

/**
 * This effect should be at your root, so React finishes it "last"
 */
export function useSetupHasSSRRendered() {
  if (isServer || isRSC) {
    return
  }

  useEffect(() => {
    onceReady(() => {
      listeners.forEach((cb) => cb())
      listeners.clear()
      finished = true
    })
  }, [])
}

export function useDidFinishSSR(props?: {
  /**
   * Disable wrapping update in `startTransition`
   */
  disableTransition?: boolean
  /**
   * Notice: don't change this value, it changes the hook type to useLayoutEffect
   */
  effectType?: 'layout'
}) {
  // conditional hook because it never changes if already true
  if (isServer || isRSC) {
    return false
  }

  const [did, setDid] = useState<boolean | undefined>()

  // this little diddly doo lets us avoid a lot of work post-ssr
  // if did is undefined and finished is true we've already SSRed before this
  // component ever rendered. We need the undefined to be sure it never rendered
  if (did === undefined && finished === true) {
    return true
  }
  if (did === undefined) {
    setDid(false)
  }

  const effect = props?.effectType === 'layout' ? useIsomorphicLayoutEffect : useEffect
  effect(() => {
    const done = () => {
      if (props?.disableTransition) {
        setDid(true)
      } else {
        startTransition(() => {
          setDid(true)
        })
      }
    }
    listeners.add(done)
    return () => {
      listeners.delete(done)
    }
  }, [props?.disableTransition])

  return did
}
