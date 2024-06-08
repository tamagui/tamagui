import { useEffect } from 'react'

let didHydrateOnce = false

export function useDidHydrateOnceRoot() {
  if (process.env.TAMAGUI_TARGET !== 'web') {
    return true
  }

  useEffect(() => {
    const tm = setInterval(() => {
      if (Date.now() - last > 500) {
        didHydrateOnce = true
        clearInterval(tm)
      }
    }, 16)
    return () => {
      clearInterval(tm)
    }
  }, [])
}

let last = Date.now()

export function useDidHydrateOnce() {
  if (process.env.TAMAGUI_TARGET !== 'web') {
    return true
  }
  if (!didHydrateOnce) {
    last = Date.now()
  }
  return didHydrateOnce
}
