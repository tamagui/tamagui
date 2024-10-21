import { useEffect, useState } from 'react'
import { getSetting } from '../config'

let didHydrateOnce = false

const listeners = new Set<Function>()

export function useDidHydrateOnceRoot() {
  useEffect(() => {
    // is it hacky? yes, but we need something better from react
    // and this should be pretty safe - though long suspends may need help
    // so we can be a bit conservative
    const tm = setInterval(() => {
      if (Date.now() - last > 1000) {
        listeners.forEach((l) => l())
        listeners.clear()
        didHydrateOnce = true
        clearInterval(tm)
      }
    }, 500)
    return () => {
      clearInterval(tm)
    }
  }, [])

  return true
}

let last = Date.now()

const NeedsHook = new WeakMap<any, boolean>()

// the main points are:
//  - its fast after hydration done - no hooks at all
export function useDidHydrateOnce(uidObject: Object) {
  if (process.env.TAMAGUI_TARGET !== 'web') {
    return true
  }
  if (getSetting('disableSSR')) {
    return true
  }

  if (!didHydrateOnce || NeedsHook.get(uidObject)) {
    NeedsHook.set(uidObject, true)
    last = Date.now()

    // for components that are running pre-hydrate we have some extra hookery
    const [state, setState] = useState(false)
    useEffect(() => {
      const onDone = () => {
        setState(true)
      }
      listeners.add(onDone)
    }, [])

    return state
  }

  return true
}
